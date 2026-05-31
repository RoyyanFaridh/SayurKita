const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getPublicStats = async (req, res) => {
  try {
    const [totalUsers, totalSaved, karbonResult] = await Promise.all([
      prisma.user.count(),
      prisma.surplusPost.count({ where: { status: "Selesai" } }),
      prisma.user.aggregate({ _sum: { totalKarbonAkumulasi: true } }),
    ]);

    const totalKarbon = karbonResult._sum.totalKarbonAkumulasi || 0;

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalSaved,
        totalKarbonTon: parseFloat((totalKarbon).toFixed(2)),
      },
    });
  } catch (error) {
    console.error("getPublicStats error:", error);
    return res.status(500).json({ success: false, message: "Gagal memuat statistik." });
  }
};

module.exports = { getPublicStats };