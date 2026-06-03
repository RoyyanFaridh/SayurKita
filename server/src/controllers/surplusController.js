const { sendEmail } = require("../utils/sendEmail");
const { claimTemplate, confirmTemplate } = require("../utils/emailTemplates");

const prisma = require("../lib/prisma");

const CARBON_FACTOR_GRAM = {
  "Makanan Matang": 400,
  "Sayuran":        200,
  "Sayur":          200,
  "Lauk":           350,
  "Buah":           150,
  "Lainnya":        250,
};

function hitungCarbonOffset(category, quantity) {
  const factorGram = CARBON_FACTOR_GRAM[category] || 250;
  const match = quantity.match(/([\d,.]+)/);
  const jumlahUnit = match ? parseFloat(match[1].replace(",", ".")) : 1;
  return Math.round(factorGram * jumlahUnit);
}

function emitStatusUpdate(req, eventName, data) {
  const io = req.app.get("io");
  if (io) io.emit(eventName, data);
}

function sanitizeCoords(post) {
  const lat = parseFloat(post.latitude);
  const lng = parseFloat(post.longitude);
  return {
    ...post,
    latitude:  Number.isFinite(lat) ? lat : null,
    longitude: Number.isFinite(lng) ? lng : null,
  };
}

const AUTO_RELEASE_HOURS = 1;

async function autoReleaseExpiredClaims(req) {
  const cutoff = new Date(Date.now() - AUTO_RELEASE_HOURS * 60 * 60 * 1000);

  const expiredPosts = await prisma.surplusPost.findMany({
    where: { status: "Diklaim", claimedAt: { lt: cutoff } },
  });

  if (expiredPosts.length === 0) return 0;

  for (const post of expiredPosts) {
    const updatedPost = await prisma.surplusPost.update({
      where: { id: post.id },
      data: {
        status: "Tersedia",
        expiredReceivers: { push: post.receiverId },
        receiverId: null,
        claimedAt: null,
      },
    });
    emitStatusUpdate(req, "statusUpdated", updatedPost);
  }

  console.log(`[Auto-Release] ${expiredPosts.length} klaim expired dikembalikan ke Tersedia.`);
  return expiredPosts.length;
}

const createSurplusPost = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, category, quantity, pickupTime, address, latitude, longitude } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const latFloat = parseFloat(latitude);
    const lngFloat = parseFloat(longitude);

    const fieldErrors = {};
    if (!title)                                          fieldErrors.nama      = 'Nama makanan wajib diisi';
    if (!description)                                    fieldErrors.deskripsi = 'Deskripsi wajib diisi';
    if (!quantity)                                       fieldErrors.jumlah    = 'Jumlah wajib diisi';
    if (!address)                                        fieldErrors.lokasi    = 'Alamat wajib diisi';
    if (!Number.isFinite(latFloat) || !Number.isFinite(lngFloat)) {
      fieldErrors.lokasi = 'Koordinat tidak valid — klik "Gunakan lokasimu"';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Mohon lengkapi semua data form.',
        fields: fieldErrors,
      });
    }

    const newPost = await prisma.surplusPost.create({
      data: {
        userId, title, description, category, quantity,
        pickupTime, address,
        latitude: latFloat,
        longitude: lngFloat,
        imageUrl,
        status: "Tersedia",
      },
    });

    emitStatusUpdate(req, "newSurplus", sanitizeCoords(newPost));

    return res.status(201).json({
      success: true,
      message: "Surplus berhasil diposting!",
      data: sanitizeCoords(newPost),
    });
  } catch (error) {
    console.error("createSurplusPost error:", error);
    return res.status(500).json({ success: false, message: "Gagal membuat postingan surplus.", error: error.message });
  }
};

const getAllSurplusPosts = async (req, res) => {
  try {
    const { lat, lng, radius, category } = req.query;
    const currentUserId = String(req.userId || 'guest');

    await autoReleaseExpiredClaims(req);

    if (lat && lng) {
      const latFloat = parseFloat(lat);
      const lngFloat = parseFloat(lng);

      if (!Number.isFinite(latFloat) || !Number.isFinite(lngFloat)) {
        return res.status(400).json({ success: false, message: "Koordinat lokasi tidak valid." });
      }

      const radiusKm = parseFloat(radius) || 10;
      let categoryFilter = "";
      const params = [lngFloat, latFloat, radiusKm, currentUserId];

      if (category && category !== "Semua") {
        categoryFilter = `AND sp.category = $5`;
        params.push(category);
      }

      const postsRaw = await prisma.$queryRawUnsafe(
        `SELECT sp.*, u.name as "userName",
                (ST_DistanceSphere(
                  ST_MakePoint(sp.longitude, sp.latitude),
                  ST_MakePoint($1, $2)
                ) / 1000) as "distanceKm"
         FROM "SurplusPost" sp
         JOIN "User" u ON sp."userId" = u.id
         WHERE (
             sp.status = 'Tersedia'
             OR (sp.status IN ('Diklaim', 'Dikonfirmasi') AND (sp."userId" = $4 OR sp."receiverId" = $4))
           )
           AND (ST_DistanceSphere(
                 ST_MakePoint(sp.longitude, sp.latitude),
                 ST_MakePoint($1, $2)
               ) / 1000) <= $3
           ${categoryFilter}
         ORDER BY "distanceKm" ASC`,
        ...params
      );

      const mappedPosts = postsRaw.map((p) => ({
        ...sanitizeCoords(p),
        user: { name: p.userName },
      }));

      return res.status(200).json({
        success: true,
        message: "Berhasil mengambil data surplus terdekat.",
        data: mappedPosts,
      });
    }

    const whereClause = {
      AND: [
        {
          OR: [
            { status: "Tersedia" },
            {
              status: { in: ["Diklaim", "Dikonfirmasi"] },
              OR: [{ userId: currentUserId }, { receiverId: currentUserId }],
            },
          ],
        },
      ],
    };

    if (category && category !== "Semua") {
      whereClause.AND.push({ category });
    }

    const posts = await prisma.surplusPost.findMany({
      where: whereClause,
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil semua data surplus.",
      data: posts.map(sanitizeCoords),
    });
  } catch (error) {
    console.error("getAllSurplusPosts error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil data surplus.", error: error.message });
  }
};

const claimSurplusPost = async (req, res) => {
  try {
    const receiverId = String(req.userId);
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({ success: false, message: "ID postingan tidak valid." });
    }

    const post = await prisma.surplusPost.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ success: false, message: "Postingan tidak ditemukan." });

    if (post.status !== "Tersedia") {
      return res.status(400).json({ success: false, message: `Makanan tidak dapat diklaim, status saat ini: ${post.status}.` });
    }
    if (String(post.userId) === receiverId) {
      return res.status(400).json({ success: false, message: "Anda tidak bisa mengklaim makanan Anda sendiri." });
    }
    if (post.expiredReceivers && post.expiredReceivers.includes(receiverId)) {
      return res.status(400).json({ success: false, message: "Klaim Anda untuk makanan ini telah kadaluwarsa." });
    }

    const updatedPost = await prisma.surplusPost.update({
      where: { id: postId },
      data: { status: "Diklaim", receiverId, claimedAt: new Date() },
    });

    emitStatusUpdate(req, "statusUpdated", sanitizeCoords(updatedPost));

    const poster = await prisma.user.findUnique({
      where: { id: post.userId },
      select: { email: true, name: true },
    });
    if (poster) {
      await sendEmail({
        to: poster.email,
        subject: 'Ada yang mengklaim surplusmu! — SayurKita',
        html: claimTemplate(poster.name, post.title),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Berhasil mengklaim makanan! Menunggu konfirmasi dari pendonor.",
      data: sanitizeCoords(updatedPost),
    });
  } catch (error) {
    console.error("claimSurplusPost error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengklaim surplus." });
  }
};

const confirmSurplusPost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = parseInt(req.params.id);

    const post = await prisma.surplusPost.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ success: false, message: "Postingan tidak ditemukan." });
    if (post.userId !== userId) return res.status(403).json({ success: false, message: "Hanya pendonor yang bisa melakukan konfirmasi." });
    if (post.status !== "Diklaim") return res.status(400).json({ success: false, message: "Makanan belum diklaim atau sudah di tahap lain." });

    const updatedPost = await prisma.surplusPost.update({
      where: { id: postId },
      data: { status: "Dikonfirmasi" },
    });

    emitStatusUpdate(req, "statusUpdated", sanitizeCoords(updatedPost));

    const claimer = await prisma.user.findUnique({
      where: { id: post.receiverId },
      select: { email: true, name: true },
    });
    if (claimer) {
      await sendEmail({
        to: claimer.email,
        subject: 'Klaimmu dikonfirmasi! — SayurKita',
        html: confirmTemplate(claimer.name, post.title),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Klaim berhasil dikonfirmasi! Silakan bertemu dengan penerima.",
      data: sanitizeCoords(updatedPost),
    });
  } catch (error) {
    console.error("confirmSurplusPost error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengkonfirmasi surplus." });
  }
};

const completeSurplusPost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = parseInt(req.params.id);

    const post = await prisma.surplusPost.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ success: false, message: "Postingan tidak ditemukan." });
    if (String(post.userId) !== String(userId)) return res.status(403).json({ success: false, message: "Hanya pemilik makanan yang dapat menyelesaikan transaksi ini." });
    if (post.status !== "Dikonfirmasi") return res.status(400).json({ success: false, message: "Makanan harus dikonfirmasi sebelum diselesaikan." });

    const carbonOffsetGram = hitungCarbonOffset(post.category, post.quantity);
    const carbonOffsetKg   = carbonOffsetGram / 1000;

    const [updatedPost] = await prisma.$transaction([
      prisma.surplusPost.update({
        where: { id: postId },
        data: { status: "Selesai" },
      }),
      prisma.user.update({
        where: { id: post.userId },
        data: {
          points:               { increment: 10 },
          totalKarbonAkumulasi: { increment: carbonOffsetKg },
        },
      }),
      prisma.poinLog.create({
        data: {
          userId: post.userId,
          delta: 10,
          source: "KARBON",
          note: `Donasi surplus diselesaikan! (+10 Poin)`,
          refId: postId.toString(),
        },
      }),
    ]);

    emitStatusUpdate(req, "statusUpdated", sanitizeCoords(updatedPost));

    return res.status(200).json({
      success: true,
      message: `Transaksi selesai! +10 Poin & ${carbonOffsetGram}g CO₂ diselamatkan.`,
      data: sanitizeCoords(updatedPost),
      carbonOffset: { gram: carbonOffsetGram, kg: carbonOffsetKg },
    });
  } catch (error) {
    console.error("completeSurplusPost error:", error);
    return res.status(500).json({ success: false, message: "Gagal menyelesaikan surplus." });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.userId;

    const post = await prisma.surplusPost.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ success: false, message: "Postingan tidak ditemukan." });
    if (post.userId !== userId && post.receiverId !== userId) {
      return res.status(403).json({ success: false, message: "Hanya pemilik atau pengklaim yang bisa mengakses chat." });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { surplusPostId: postId },
      include: { sender: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("getChatMessages error:", error);
    return res.status(500).json({ success: false, message: "Gagal memuat pesan obrolan." });
  }
};

const sendChatMessage = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = String(req.userId);
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, message: "Pesan tidak boleh kosong." });
    }

    const post = await prisma.surplusPost.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ success: false, message: "Postingan tidak ditemukan." });
    if (String(post.userId) !== userId && String(post.receiverId) !== userId) {
      return res.status(403).json({ success: false, message: "Hanya pemilik atau pengklaim yang bisa mengakses chat." });
    }

    const newMessage = await prisma.chatMessage.create({
      data: { surplusPostId: postId, senderId: userId, message: message.trim() },
      include: { sender: { select: { id: true, name: true } } },
    });

    const io = req.app.get("io");
    if (io) io.to(`chat_${postId}`).emit("newMessage", newMessage);

    return res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error("sendChatMessage error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengirim pesan obrolan." });
  }
};

const getSurplusStats = async (req, res) => {
  try {
    const currentUserId = String(req.userId || 'guest');
    const { lat, lng, radius } = req.query;

    let activeCount   = 0;
    let expiringCount = 0;

    if (lat && lng) {
      const latFloat = parseFloat(lat);
      const lngFloat = parseFloat(lng);

      if (!Number.isFinite(latFloat) || !Number.isFinite(lngFloat)) {
        return res.status(400).json({ success: false, message: "Koordinat lokasi tidak valid." });
      }

      const radiusKm = parseFloat(radius) || 10;

      const postsRaw = await prisma.$queryRawUnsafe(
        `SELECT sp."pickupTime"
         FROM "SurplusPost" sp
         WHERE sp.status = 'Tersedia'
           AND (ST_DistanceSphere(
                 ST_MakePoint(sp.longitude, sp.latitude),
                 ST_MakePoint($1, $2)
               ) / 1000) <= $3`,
        lngFloat, latFloat, radiusKm
      );

      activeCount   = postsRaw.length;
      expiringCount = postsRaw.filter(p => p.pickupTime === 'Segera ambil').length;
    } else {
      activeCount   = await prisma.surplusPost.count({ where: { status: 'Tersedia' } });
      expiringCount = await prisma.surplusPost.count({ where: { status: 'Tersedia', pickupTime: 'Segera ambil' } });
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const savedThisMonth = await prisma.surplusPost.count({
      where: {
        status: 'Selesai',
        receiverId: currentUserId,
        createdAt: { gte: startOfMonth },
      },
    });

    return res.status(200).json({
      success: true,
      data: { active: activeCount, expiring: expiringCount, savedThisMonth },
    });
  } catch (error) {
    console.error("getSurplusStats error:", error);
    return res.status(500).json({ success: false, message: "Gagal memuat statistik surplus." });
  }
};

const getMySurplusPosts = async (req, res) => {
  try {
    const currentUserId = String(req.userId);

    const myPosts = await prisma.surplusPost.findMany({
      where: { userId: currentUserId },
      orderBy: { createdAt: "desc" },
      include: {
        user:     { select: { name: true } },
        receiver: { select: { name: true } },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil riwayat donasi.",
      data: myPosts.map(sanitizeCoords),
    });
  } catch (error) {
    console.error("getMySurplusPosts error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil riwayat donasi." });
  }
};

module.exports = {
  createSurplusPost,
  getAllSurplusPosts,
  getMySurplusPosts,
  claimSurplusPost,
  confirmSurplusPost,
  completeSurplusPost,
  getChatMessages,
  sendChatMessage,
  getSurplusStats,
};