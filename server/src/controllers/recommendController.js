const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8003";

/**
 * POST /api/recommend/dashboard
 * Mengambil nama bahan dari kulkas user dan meminta rekomendasi resep ke AI.
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

    // Filter bahan yang akan kadaluarsa dalam 3 hari ke depan
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const ingredients = await prisma.ingredient.findMany({
      where: {
        userId,
        expDate: {
          lte: threeDaysFromNow,
          gte: today,
        },
      },
      select: { nama: true },
    });

    const ingredientNames = ingredients.map((item) => item.nama);

    if (ingredientNames.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Tidak ada bahan yang akan kadaluwarsa dalam 3 hari ke depan.",
        data: { recipes: [] },
      });
    }

    // 3. Tembakkan array tersebut via fetch ke Server FastAPI eksternal
    let upstream;
    try {
      upstream = await fetch(`${AI_SERVICE_URL}/recommend-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: ingredientNames }),
      });
    } catch (fetchErr) {
      // 4. Penanganan error (try-catch) jika server AI port 8003 mati
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

    // 5. Tampilkan contoh format JSON response sukses dari AI
    /*
      Contoh format payload sukses:
      {
        "success": true,
        "data": {
          "recipes": [
            {
              "id": 1,
              "title": "Tumis Bayam Tahu",
              "description": "Resep sehat dan cepat dari bayam dan tahu."
            }
          ]
        }
      }
    */
    return res.status(upstream.status).json(payload);
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
  getGeneralRecommendation,
};
