const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * POST /api/cooking-logs
 * Simpan log memasak + kalkulasi karbon dari bahan yang dipakai.
 *
 * Body: {
 *   resepNama: string,
 *   resepId?: string,
 *   bahanUsed: Array<{ nama: string, karbon_co2e: number }>
 * }
 *
 * Asumsi kalkulasi: karbon_co2e per bahan adalah flat per unit/porsi wajar,
 * karena jumlah di stok user adalah string bebas (tidak bisa di-parse reliably).
 * Label "Estimasi" wajib ditampilkan di frontend.
 */
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

    // Validasi setiap item di bahanUsed
    for (const b of bahanUsed) {
      if (!b.nama || typeof b.karbon_co2e !== "number") {
        return res.status(400).json({
          success: false,
          message: "Setiap bahan harus memiliki nama (string) dan karbon_co2e (number).",
        });
      }
    }

    // Hitung total karbon: sum karbon_co2e semua bahan yang dipakai
    // Flat per bahan — bukan per gram, karena quantity tidak bisa di-parse reliably.
    const totalKarbon = parseFloat(
      bahanUsed.reduce((sum, b) => sum + (b.karbon_co2e || 0), 0).toFixed(3)
    );

    const log = await prisma.cookingLog.create({
      data: {
        userId,
        resepNama,
        resepId: resepId ? String(resepId) : null,
        bahanUsed,      // Prisma simpan sebagai JSON
        totalKarbon,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Log memasak berhasil disimpan.",
      data: log,
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