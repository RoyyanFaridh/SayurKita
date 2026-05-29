const { PrismaClient } = require("@prisma/client");
const { awardPoin } = require("../services/poinService");
const prisma = new PrismaClient();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8003";

/**
 * POST /api/recommend/dashboard
 * Mengambil SEMUA bahan dari kulkas user dan meminta rekomendasi resep ke AI.
 * Expired days dihitung per bahan dan dikirim agar urgency_boost di Python bekerja.
 */
const getDashboardRecommendation = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau expired.",
      });
    }

    // Ambil SEMUA bahan user di kulkas (tanpa filter tanggal)
    const allIngredients = await prisma.ingredient.findMany({
      where: { userId },
      select: { nama: true, expDate: true },
    });

    if (allIngredients.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Kulkas kosong. Tambahkan bahan terlebih dahulu.",
        data: { recipes: [] },
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Hitung sisa hari expired per bahan
    // Jika tidak ada expDate, beri nilai default 15 hari (aman, tapi tetap < 30 agar urgency_boost aktif)
    const ingredientNames = [];
    const expiredDays = [];

    for (const item of allIngredients) {
      ingredientNames.push(item.nama);

      if (item.expDate) {
        const exp = new Date(item.expDate);
        exp.setHours(0, 0, 0, 0);
        const diffMs = exp - today;
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        expiredDays.push(diffDays);
      } else {
        expiredDays.push(15); // default aman: < 30 hari agar urgency_boost aktif
      }
    }

    // Kirim ingredients + expired ke FastAPI AI
    let upstream;
    try {
      upstream = await fetch(`${AI_SERVICE_URL}/recommend-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: ingredientNames,
          expired: expiredDays,
        }),
      });
    } catch (fetchErr) {
      console.error("Fetch error connecting to AI service:", fetchErr.message);
      return res.status(502).json({
        success: false,
        message: "Layanan AI tidak dapat dijangkau. Pastikan FastAPI berjalan di port 8003.",
        error: fetchErr.message,
      });
    }

    const text = await upstream.text();
    let payload;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr.message);
      return res.status(502).json({
        success: false,
        message: "Respons layanan AI tidak valid (format bukan JSON).",
        error: "Invalid JSON response from AI service",
      });
    }

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        success: false,
        message: payload?.message || "Layanan AI mengembalikan error.",
        detail: payload,
      });
    }

    return res.status(200).json({
      success: true,
      data: { recipes: payload },
    });
  } catch (err) {
    console.error("getDashboardRecommendation error:", err);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server saat mengambil rekomendasi.",
      error: err.message,
    });
  }
};

/**
 * POST /api/recommend/cook
 * Menangani aksi "Sudah Dimasak" dengan atomic transaction:
 * 1. Menghapus bahan dari kulkas user
 * 2. Mencatat cooking log + emisi karbon
 * 3. Award poin (non-fatal jika gagal)
 *
 * Body: {
 *   resepNama: string,
 *   resepId?: string,
 *   ingredientsUsed: Array<string>, // nama bahan yang digunakan
 *   bahanUsed: Array<{ nama: string, karbon_co2e: number }>, // untuk cooking log
 *   totalKarbon: number
 * }
 */
const cookRecipe = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau expired.",
      });
    }

    const { resepNama, resepId, ingredientsUsed, bahanUsed, totalKarbon } = req.body;

    // Validasi input
    if (!resepNama || !Array.isArray(ingredientsUsed) || ingredientsUsed.length === 0) {
      return res.status(400).json({
        success: false,
        message: "resepNama dan ingredientsUsed (array) harus diisi.",
      });
    }

    if (!Array.isArray(bahanUsed) || bahanUsed.length === 0) {
      return res.status(400).json({
        success: false,
        message: "bahanUsed (array dengan karbon_co2e) harus diisi.",
      });
    }

    if (typeof totalKarbon !== "number") {
      return res.status(400).json({
        success: false,
        message: "totalKarbon harus berupa number.",
      });
    }

    // Atomic transaction: hapus bahan + catat cooking log
    const result = await prisma.$transaction(async (tx) => {
      const deletedIngredients = [];

      // Loop setiap bahan yang digunakan
      for (const ingredientName of ingredientsUsed) {
        // Cari bahan di kulkas user (case-insensitive)
        const found = await tx.ingredient.findFirst({
          where: {
            userId,
            nama: {
              equals: ingredientName,
              mode: "insensitive",
            },
          },
        });

        // Jika ditemukan, hapus dari kulkas
        if (found) {
          await tx.ingredient.delete({
            where: { id: found.id },
          });
          deletedIngredients.push(found.nama);
        }
      }

      // Catat cooking log
      const cookingLog = await tx.cookingLog.create({
        data: {
          userId,
          resepNama,
          resepId: resepId ? String(resepId) : null,
          bahanUsed,
          totalKarbon: parseFloat(totalKarbon.toFixed(3)),
        },
      });

      return { cookingLog, deletedIngredients };
    });

    // Award poin (non-fatal jika gagal)
    let poinResult = null;
    try {
      poinResult = await awardPoin(userId, totalKarbon, result.cookingLog.id);
    } catch (poinErr) {
      console.error("awardPoin error (non-fatal):", poinErr);
    }

    return res.status(200).json({
      success: true,
      message: "Resep berhasil dimasak. Bahan telah dikurangi dari kulkas.",
      data: {
        cookingLog: result.cookingLog,
        deletedIngredients: result.deletedIngredients,
        poin: poinResult,
      },
    });
  } catch (err) {
    console.error("cookRecipe error:", err);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memproses aksi memasak.",
      error: err.message,
    });
  }
};

/**
 * POST /api/recommend
 * Proxy umum ke endpoint AI (backward compatibility dengan implementasi sebelumnya)
 */
const getGeneralRecommendation = async (req, res) => {
  try {
    let upstream;
    try {
      upstream = await fetch(`${AI_SERVICE_URL}/recommend-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
    } catch (fetchErr) {
      console.error("Fetch error connecting to AI service:", fetchErr.message);
      return res.status(502).json({
        success: false,
        message: "Layanan AI tidak dapat dijangkau. Pastikan FastAPI berjalan di port 8003.",
        error: fetchErr.message,
      });
    }

    const text = await upstream.text();
    let payload;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr.message);
      return res.status(502).json({
        success: false,
        message: "Respons layanan AI tidak valid (format bukan JSON).",
        error: "Invalid JSON response from AI service",
      });
    }

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        success: false,
        message: payload?.message || "Layanan AI mengembalikan error.",
        detail: payload,
      });
    }

    return res.status(upstream.status).json(payload);
  } catch (err) {
    console.error("Proxy /api/recommend:", err);
    return res.status(502).json({
      success: false,
      message: "Terjadi kesalahan saat menghubungi layanan AI.",
      error: err.message,
    });
  }
};

module.exports = {
  getDashboardRecommendation,
  cookRecipe,
  getGeneralRecommendation,
};
