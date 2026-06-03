const prisma = require("../lib/prisma");

/**
 * GET /api/poin
 * Ambil ringkasan poin + streak milik user.
 */
const getPoinSummary = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau expired.",
      });
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        points: true,
        streakCount: true,
        lastActiveDate: true,
      },
    });

    // Cek apakah streak masih aktif (lastActiveDate <= kemarin)
    // Jika lastActiveDate > 1 hari yang lalu, streak sudah putus tapi belum di-reset
    // (reset terjadi saat transaksi berikutnya, bukan secara scheduled)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streakMasihAktif = false;
    if (user.lastActiveDate) {
      const last = new Date(user.lastActiveDate);
      last.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
      streakMasihAktif = diffDays <= 1;
    }

    return res.status(200).json({
      success: true,
      data: {
        points:         user.points,
        streakCount:    streakMasihAktif ? user.streakCount : 0,
        lastActiveDate: user.lastActiveDate,
      },
    });
  } catch (err) {
    console.error("getPoinSummary error:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data poin.",
    });
  }
};

/**
 * GET /api/poin/riwayat
 * Ambil riwayat PoinLog milik user, terbaru duluan.
 * Query params: ?limit=20&offset=0
 */
const getRiwayatPoin = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau expired.",
      });
    }

    const limit  = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const source = req.query.source;

    const where = {
      userId,
      ...(source && ["KARBON", "STREAK"].includes(source) && { source }),
    };

    const [logs, total] = await prisma.$transaction([
      prisma.poinLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take:    limit,
        skip:    offset,
      }),
      prisma.poinLog.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      data: { logs, total, limit, offset },
    });
  } catch (err) {
    console.error("getRiwayatPoin error:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil riwayat poin.",
    });
  }
};

module.exports = { getPoinSummary, getRiwayatPoin };