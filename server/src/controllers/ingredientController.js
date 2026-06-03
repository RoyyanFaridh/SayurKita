const prisma = require("../lib/prisma");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8003";

const getIngredients = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Token tidak valid atau expired." });
    }

    const ingredients = await prisma.ingredient.findMany({
      where: { userId },
      orderBy: { expDate: "asc" },
    });

    return res.status(200).json({ success: true, data: ingredients });
  } catch (err) {
    console.error("getIngredients error:", err);
    return res.status(500).json({ success: false, message: "Gagal mengambil data bahan." });
  }
};

const addIngredient = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Token tidak valid atau expired." });
    }

    const { nama, kategori, jumlah, storage, beliDate, expDate } = req.body;

    if (!nama || !kategori || !jumlah) {
      return res.status(400).json({ success: false, message: "Nama, kategori, dan jumlah harus diisi." });
    }

    let finalExpDate;
    if (expDate) {
      finalExpDate = new Date(expDate);
    } else {
      let extraDays = 3;
      try {
        const response = await fetch(`${AI_SERVICE_URL}/shelf-life?ingredient=${encodeURIComponent(nama)}`);
        if (response.ok) {
          const data = await response.json();
          if (data?.umur_kulkas !== undefined) {
            extraDays = parseInt(data.umur_kulkas, 10) || 3;
          }
        }
      } catch (error) {
        console.error("Gagal terhubung ke API Shelf-Life AI:", error.message);
      }

      const baseDate = beliDate ? new Date(beliDate) : new Date();
      finalExpDate = new Date(baseDate);
      finalExpDate.setDate(finalExpDate.getDate() + extraDays);
    }

    const ingredient = await prisma.ingredient.create({
      data: {
        userId,
        nama,
        kategori,
        jumlah,
        storage: storage || "kulkas",
        beliDate: beliDate ? new Date(beliDate) : new Date(),
        expDate: finalExpDate,
      },
    });

    // Fire and forget — carbon update tidak blocking response
    const parsedJumlah = parseFloat(jumlah);
    if (!isNaN(parsedJumlah) && parsedJumlah > 0) {
      fetch(`${AI_SERVICE_URL}/carbon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredient_name: nama, weight_grams: parsedJumlah }),
      })
        .then(async (carbonResponse) => {
          if (!carbonResponse.ok) return;
          const carbonData = await carbonResponse.json();
          if (carbonData?.co2e_kg) {
            await prisma.user.update({
              where: { id: userId },
              data: { totalKarbonAkumulasi: { increment: carbonData.co2e_kg } },
            });
            console.log(`Berhasil menambahkan ${carbonData.co2e_kg} kg CO2e ke total user ${userId}`);
          }
        })
        .catch((err) => console.error("Carbon update error:", err));
    }

    return res.status(201).json({
      success: true,
      message: "Bahan berhasil ditambahkan.",
      data: ingredient,
    });
  } catch (err) {
    console.error("addIngredient error:", err);
    return res.status(500).json({ success: false, message: "Gagal menambah bahan." });
  }
};

const updateIngredient = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { nama, kategori, jumlah, storage, beliDate, expDate } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Token tidak valid atau expired." });
    }

    const ingredient = await prisma.ingredient.findFirst({
      where: { id, userId },
    });

    if (!ingredient) {
      return res.status(404).json({ success: false, message: "Bahan tidak ditemukan." });
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

    return res.status(200).json({ success: true, message: "Bahan berhasil diperbarui.", data: updated });
  } catch (err) {
    console.error("updateIngredient error:", err);
    return res.status(500).json({ success: false, message: "Gagal memperbarui bahan." });
  }
};

const deleteIngredient = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Token tidak valid atau expired." });
    }

    const deleted = await prisma.ingredient.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ success: false, message: "Bahan tidak ditemukan." });
    }

    return res.status(200).json({ success: true, message: "Bahan berhasil dihapus." });
  } catch (err) {
    console.error("deleteIngredient error:", err);
    return res.status(500).json({ success: false, message: "Gagal menghapus bahan." });
  }
};

const getExpiryAlerts = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Token tidak valid atau expired." });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const alerts = await prisma.ingredient.findMany({
      where: {
        userId,
        expDate: { lte: threeDaysFromNow, gte: today },
      },
      orderBy: { expDate: "asc" },
    });

    const alertsWithStatus = alerts.map((item) => {
      const expDate = new Date(item.expDate);
      expDate.setHours(0, 0, 0, 0);
      const daysRemaining = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));

      return {
        ...item,
        daysRemaining,
        alertStatus: daysRemaining <= 1 ? "danger" : "warning",
      };
    });

    return res.status(200).json({ success: true, data: alertsWithStatus, count: alertsWithStatus.length });
  } catch (err) {
    console.error("getExpiryAlerts error:", err);
    return res.status(500).json({ success: false, message: "Gagal mengambil data peringatan kadaluwarsa." });
  }
};

const getIngredientsSummary = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Token tidak valid atau expired." });
    }

    const ingredients = await prisma.ingredient.findMany({
      where: { userId },
      select: { expDate: true },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let safe = 0;
    let critical = 0;

    for (const item of ingredients) {
      const expDate = new Date(item.expDate);
      expDate.setHours(0, 0, 0, 0);
      const daysRemaining = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
      daysRemaining <= 3 ? critical++ : safe++;
    }

    return res.status(200).json({
      success: true,
      data: { total: ingredients.length, safe, critical },
    });
  } catch (err) {
    console.error("getIngredientsSummary error:", err);
    return res.status(500).json({ success: false, message: "Gagal mengambil ringkasan data bahan." });
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