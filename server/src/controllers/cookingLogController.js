const { awardPoin } = require("../services/poinService");
const prisma = require("../lib/prisma");

const COOLDOWN_HOURS = 8;
const DAILY_CAP      = 5;

const createCookingLog = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau expired.",
      });
    }

    const { resepNama, resepId, bahanUsed } = req.body;

    if (!resepNama || !Array.isArray(bahanUsed) || bahanUsed.length === 0) {
      return res.status(400).json({
        success: false,
        message: "resepNama dan bahanUsed (array) harus diisi.",
      });
    }

    for (const b of bahanUsed) {
      if (!b.nama || typeof b.karbon_co2e !== "number") {
        return res.status(400).json({
          success: false,
          message: "Setiap bahan harus memiliki nama (string) dan karbon_co2e (number).",
        });
      }
    }

    // ─── Anti-abuse: cooldown per resep ──────────────────────────────────────
    if (resepId) {
      const cooldownSince = new Date(Date.now() - COOLDOWN_HOURS * 60 * 60 * 1000);
      const recentSame = await prisma.cookingLog.findFirst({
        where: {
          userId,
          resepId: String(resepId),
          createdAt: { gte: cooldownSince },
        },
      });
      if (recentSame) {
        return res.status(429).json({
          success: false,
          message: `Resep ini baru saja dimasak. Tunggu ${COOLDOWN_HOURS} jam sebelum mencatat resep yang sama.`,
        });
      }
    }

    // ─── Anti-abuse: daily cap ────────────────────────────────────────────────
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = await prisma.cookingLog.count({
      where: { userId, createdAt: { gte: todayStart } },
    });
    if (todayCount >= DAILY_CAP) {
      return res.status(429).json({
        success: false,
        message: `Batas ${DAILY_CAP} log memasak per hari telah tercapai. Coba lagi besok.`,
      });
    }

    // ─── Simpan log ───────────────────────────────────────────────────────────
    const totalKarbon = parseFloat(
      bahanUsed.reduce((sum, b) => sum + (b.karbon_co2e || 0), 0).toFixed(3)
    );

    const log = await prisma.cookingLog.create({
      data: {
        userId,
        resepNama,
        resepId: resepId ? String(resepId) : null,
        bahanUsed,
        totalKarbon,
      },
    });

    // Award poin — jika gagal, cooking log tetap tersimpan (non-fatal)
    let poinResult = null;
    try {
      poinResult = await awardPoin(userId, totalKarbon, log.id);
    } catch (poinErr) {
      console.error("awardPoin error (non-fatal):", poinErr);
    }

    return res.status(201).json({
      success: true,
      message: "Log memasak berhasil disimpan.",
      data: log,
      poin: poinResult,
    });
  } catch (err) {
    console.error("createCookingLog error:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal menyimpan log memasak.",
    });
  }
};

/**
 * GET /api/cooking-logs
 * Ambil semua cooking log milik user, terbaru duluan.
 */
const getCookingLogs = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau expired.",
      });
    }

    const logs = await prisma.cookingLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (err) {
    console.error("getCookingLogs error:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil log memasak.",
    });
  }
};

module.exports = { createCookingLog, getCookingLogs };