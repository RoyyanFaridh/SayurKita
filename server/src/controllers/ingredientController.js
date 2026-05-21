const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * GET /api/ingredients
 * Ambil semua ingredients user yang login
 */
const getIngredients = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau expired.",
      });
    }

    const ingredients = await prisma.ingredient.findMany({
      where: { userId },
      orderBy: { expDate: "asc" },
    });

    return res.status(200).json({
      success: true,
      data: ingredients,
    });
  } catch (err) {
    console.error("getIngredients error:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data bahan.",
    });
  }
};

/**
 * POST /api/ingredients
 * Tambah ingredient baru
 * Body: { nama, kategori, jumlah, storage, beliDate, expDate }
 */
const addIngredient = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau expired.",
      });
    }

    const { nama, kategori, jumlah, storage, beliDate, expDate } = req.body;

    // Validasi input
    if (!nama || !kategori || !jumlah || !expDate) {
      return res.status(400).json({
        success: false,
        message: "Nama, kategori, jumlah, dan expDate harus diisi.",
      });
    }

    const ingredient = await prisma.ingredient.create({
      data: {
        userId,
        nama,
        kategori,
        jumlah,
        storage: storage || "kulkas",
        beliDate: beliDate ? new Date(beliDate) : new Date(),
        expDate: new Date(expDate),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Bahan berhasil ditambahkan.",
      data: ingredient,
    });
  } catch (err) {
    console.error("addIngredient error:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal menambah bahan.",
    });
  }
};

/**
 * PUT /api/ingredients/:id
 * Update ingredient
 * Body: { nama, kategori, jumlah, storage, beliDate, expDate }
 */
const updateIngredient = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { nama, kategori, jumlah, storage, beliDate, expDate } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau expired.",
      });
    }

    // Cek apakah ingredient milik user
    const ingredient = await prisma.ingredient.findFirst({
      where: { id, userId },
    });

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: "Bahan tidak ditemukan.",
      });
    }

    const updated = await prisma.ingredient.update({
      where: { id },
      data: {
        ...(nama && { nama }),
        ...(kategori && { kategori }),
        ...(jumlah && { jumlah }),
        ...(storage && { storage }),
        ...(beliDate && { beliDate: new Date(beliDate) }),
        ...(expDate && { expDate: new Date(expDate) }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Bahan berhasil diperbarui.",
      data: updated,
    });
  } catch (err) {
    console.error("updateIngredient error:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui bahan.",
    });
  }
};

/**
 * DELETE /api/ingredients/:id
 * Hapus ingredient
 */
const deleteIngredient = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau expired.",
      });
    }

    // Cek apakah ingredient milik user
    const ingredient = await prisma.ingredient.findFirst({
      where: { id, userId },
    });

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: "Bahan tidak ditemukan.",
      });
    }

    await prisma.ingredient.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Bahan berhasil dihapus.",
    });
  } catch (err) {
    console.error("deleteIngredient error:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus bahan.",
    });
  }
};

/**
 * GET /api/ingredients/alerts/expiry
 * Ambil semua ingredients user yang hampir kadaluwarsa (<=3 hari dari hari ini)
 * Filter: expDate <= today + 3 days
 * Sort: paling kritis (terdekat) di atas
 */
const getExpiryAlerts = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau expired.",
      });
    }

    // Dapatkan tanggal hari ini (midnight, local timezone)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Hitung 3 hari dari hari ini
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    // Query: ambil ingredients yang expDate <= 3 hari dari sekarang
    const alerts = await prisma.ingredient.findMany({
      where: {
        userId,
        expDate: {
          lte: threeDaysFromNow, // Less than or equal to 3 days from now
          gte: today, // Greater than or equal to today (exclude already expired)
        },
      },
      orderBy: { expDate: "asc" }, // Paling kritis di atas (terdekat duluan)
    });

    // Map data dan tambahkan status alert berdasarkan days remaining
    const alertsWithStatus = alerts.map((item) => {
      const expDate = new Date(item.expDate);
      expDate.setHours(0, 0, 0, 0);
      const daysRemaining = Math.floor(
        (expDate - today) / (1000 * 60 * 60 * 24),
      );

      let alertStatus = "warning";
      if (daysRemaining <= 1) {
        alertStatus = "danger"; // Merah: sisa 1 hari
      } else if (daysRemaining <= 3) {
        alertStatus = "warning"; // Orange: sisa 2-3 hari
      }

      return {
        ...item,
        daysRemaining,
        alertStatus,
      };
    });

    return res.status(200).json({
      success: true,
      data: alertsWithStatus,
      count: alertsWithStatus.length,
    });
  } catch (err) {
    console.error("getExpiryAlerts error:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data peringatan kadaluwarsa.",
    });
  }
};

/**
 * GET /api/ingredients/stats/summary
 * Ambil ringkasan statistik ingredients user
 * Total bahan, aman, dan kritis
 */
const getIngredientsSummary = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau expired.",
      });
    }

    // Dapatkan semua ingredients user
    const ingredients = await prisma.ingredient.findMany({
      where: { userId },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Hitung statistik
    let safe = 0;
    let critical = 0;

    for (const item of ingredients) {
      const expDate = new Date(item.expDate);
      expDate.setHours(0, 0, 0, 0);
      const daysRemaining = Math.floor(
        (expDate - today) / (1000 * 60 * 60 * 24),
      );

      if (daysRemaining <= 3) {
        critical++;
      } else {
        safe++;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        total: ingredients.length,
        safe,
        critical,
      },
    });
  } catch (err) {
    console.error("getIngredientsSummary error:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil ringkasan data bahan.",
    });
  }
};

module.exports = {
  getIngredients,
  addIngredient,
  updateIngredient,
  deleteIngredient,
  getExpiryAlerts,
  getIngredientsSummary,
};
