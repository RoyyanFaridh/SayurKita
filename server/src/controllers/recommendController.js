const { awardPoin } = require("../services/poinService");
const prisma = require("../lib/prisma");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8003";
const DAILY_CAP      = 5;

const getDashboardRecommendation = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau expired.",
      });
    }

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

    const ingredientNames = [];
    const expiredDays     = [];

    for (const item of allIngredients) {
      ingredientNames.push(item.nama);
      if (item.expDate) {
        const exp = new Date(item.expDate);
        exp.setHours(0, 0, 0, 0);
        expiredDays.push(Math.round((exp - today) / (1000 * 60 * 60 * 24)));
      } else {
        expiredDays.push(15);
      }
    }

    let upstream;
    try {
      upstream = await fetch(`${AI_SERVICE_URL}/recommend-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: ingredientNames, expired: expiredDays }),
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

    return res.status(200).json({ success: true, data: { recipes: payload } });
  } catch (err) {
    console.error("getDashboardRecommendation error:", err);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server saat mengambil rekomendasi.",
      error: err.message,
    });
  }
};

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

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [sudahDimasak, todayCount] = await Promise.all([
      resepId
        ? prisma.cookingLog.findFirst({
            where: {
              userId,
              resepId: String(resepId),
              createdAt: { gte: todayStart },
            },
          })
        : Promise.resolve(null),
      prisma.cookingLog.count({
        where: { userId, createdAt: { gte: todayStart } },
      }),
    ]);

    if (sudahDimasak) {
      return res.status(429).json({
        success: false,
        message: "Resep ini sudah pernah dimasak hari ini. Coba lagi besok.",
      });
    }
    if (todayCount >= DAILY_CAP) {
      return res.status(429).json({
        success: false,
        message: `Batas ${DAILY_CAP} log memasak per hari telah tercapai. Coba lagi besok.`,
      });
    }

    // ─── Catat log memasak ───────────────────────────────────────────────────
    const cookingLog = await prisma.cookingLog.create({
      data: {
        userId,
        resepNama,
        resepId: resepId ? String(resepId) : null,
        bahanUsed,
        totalKarbon: parseFloat(totalKarbon.toFixed(3)),
      },
    });

    const result = { cookingLog, deletedIngredients: [] };

    // Award poin — non-fatal jika gagal
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

const getCookingTips = async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Daftar bahan kosong.",
      });
    }

    let upstream;
    try {
      upstream = await fetch(`${AI_SERVICE_URL}/cooking-tips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
    } catch (fetchErr) {
      console.error("Fetch error connecting to AI service:", fetchErr.message);
      return res.status(502).json({
        success: false,
        message: "Layanan AI tidak dapat dijangkau.",
        error: fetchErr.message,
      });
    }

    const text = await upstream.text();
    let payload;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      return res.status(502).json({
        success: false,
        message: "Respons layanan AI tidak valid.",
      });
    }

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        success: false,
        message: payload?.detail || "Layanan AI mengembalikan error.",
      });
    }

    return res.status(200).json({ success: true, tip: payload.tip });
  } catch (err) {
    console.error("getCookingTips error:", err);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil tips memasak.",
      error: err.message,
    });
  }
};

module.exports = {
  getDashboardRecommendation,
  cookRecipe,
  getGeneralRecommendation,
  getCookingTips,
};