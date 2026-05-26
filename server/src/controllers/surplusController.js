const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createSurplusPost = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, category, quantity, pickupTime, address, latitude, longitude } = req.body;
    
    // Tangkap nama file / url gambar dari upload multer
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description || !category || !quantity || !pickupTime || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Mohon lengkapi semua data form.",
      });
    }

    const newPost = await prisma.surplusPost.create({
      data: {
        userId,
        title,
        description,
        category,
        quantity,
        pickupTime,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        imageUrl,
        status: "Tersedia",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Surplus berhasil diposting!",
      data: newPost,
    });
  } catch (error) {
    console.error("createSurplusPost error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat postingan surplus.",
      error: error.message,
    });
  }
};

const getAllSurplusPosts = async (req, res) => {
  try {
    const posts = await prisma.surplusPost.findMany({
      where: {
        status: "Tersedia",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil data surplus.",
      data: posts,
    });
  } catch (error) {
    console.error("getAllSurplusPosts error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data surplus.",
      error: error.message,
    });
  }
};

const claimSurplusPost = async (req, res) => {
  try {
    const receiverId = req.userId;
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({
        success: false,
        message: "ID postingan tidak valid.",
      });
    }

    const post = await prisma.surplusPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Postingan tidak ditemukan.",
      });
    }

    if (post.status === "Diambil") {
      return res.status(400).json({
        success: false,
        message: "Makanan sudah diklaim orang lain.",
      });
    }

    if (post.userId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "Anda tidak bisa mengklaim makanan Anda sendiri.",
      });
    }

    // Gunakan Prisma Transaction agar update post dan poin terjadi serentak
    const [updatedPost, updatedUser] = await prisma.$transaction([
      // 1. Ubah status surplus menjadi Diambil dan catat receiver
      prisma.surplusPost.update({
        where: { id: postId },
        data: {
          status: "Diambil",
          receiverId: receiverId,
        },
      }),
      // 2. Berikan 10 poin ke PEMBERI makanan (post.userId)
      prisma.user.update({
        where: { id: post.userId },
        data: {
          points: {
            increment: 10,
          },
        },
      })
    ]);

    return res.status(200).json({
      success: true,
      message: "Berhasil mengklaim makanan! 10 Poin telah diberikan kepada pemberi.",
      data: updatedPost,
    });
  } catch (error) {
    console.error("claimSurplusPost error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengklaim surplus.",
      error: error.message,
    });
  }
};

module.exports = {
  createSurplusPost,
  getAllSurplusPosts,
  claimSurplusPost,
};
