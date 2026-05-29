const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const TODAY_CRITICAL_DAYS = 3;

const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau expired.",
      });
    }

    // ─── 1. Data User (nama + poin) ──────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, points: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    // ─── 2. Semua Ingredient milik user ──────────────────────────────────────
    const allIngredients = await prisma.ingredient.findMany({
      where: { userId },
      orderBy: { expDate: "asc" },
    });

    const totalBahanKulkas = allIngredients.length;

    // ─── 3. Agregasi expired / kritis / aman ─────────────────────────────────
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let safe = 0;
    let critical = 0;
    let warning = 0;
    let expired = 0;

    for (const item of allIngredients) {
      const expDate = new Date(item.expDate);
      expDate.setHours(0, 0, 0, 0);
      const daysRemaining = Math.floor(
        (expDate - today) / (1000 * 60 * 60 * 24),
      );

      if (daysRemaining < 0) {
        expired++;
      } else if (daysRemaining <= 1) {
        critical++;
      } else if (daysRemaining <= 3) {
        warning++;
      } else {
        safe++;
      }
    }

    // ─── 4. Kulkas Preview — 5 bahan terbaru (diurutkan createdAt DESC) ──────
    const kulkasPreviewRaw = [...allIngredients]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const kulkasPreview = kulkasPreviewRaw.map((item) => {
      const expDate = new Date(item.expDate);
      expDate.setHours(0, 0, 0, 0);
      const daysRemaining = Math.floor(
        (expDate - today) / (1000 * 60 * 60 * 24),
      );

      let expStatus;
      let expLabel;

      if (daysRemaining < 0) {
        expStatus = "expired";
        expLabel = "Kadaluwarsa";
      } else if (daysRemaining === 0) {
        expStatus = "danger";
        expLabel = "Hari ini!";
      } else if (daysRemaining === 1) {
        expStatus = "danger";
        expLabel = "Besok!";
      } else if (daysRemaining <= TODAY_CRITICAL_DAYS) {
        expStatus = "warning";
        expLabel = `${daysRemaining} hari`;
      } else if (daysRemaining <= 7) {
        expStatus = "ok";
        expLabel = `${daysRemaining} hari`;
      } else {
        expStatus = "fresh";
        expLabel = `${daysRemaining} hari`;
      }

      return {
        id: item.id,
        nama: item.nama,
        kategori: item.kategori,
        jumlah: item.jumlah,
        storage: item.storage,
        expDate: item.expDate,
        daysRemaining,
        expStatus,
        expLabel,
      };
    });

    // ─── 5. Placeholder stats (model Surplus belum dibuat) ───────────────────
    const postingAktif = 0;
    // const surplusDiselamatkan = user.points > 0
    //   ? Math.floor(user.points / 10)
    //   : 0;
    const surplusDiselamatkan = 0; // TODO: hitung dari model Surplus saat sudah dibuat
      
    const cookingLogs = await prisma.cookingLog.findMany({
      where: { userId },
      select: { totalKarbon: true },
    });
    const karbonDiselamatkan = parseFloat(
      cookingLogs.reduce((sum, log) => sum + log.totalKarbon, 0).toFixed(2)
    );

    // ─── 6. Susun response ───────────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          points: user.points,
        },
        stats: {
          totalBahanKulkas,
          safe,
          warning,
          critical,
          expired,
          postingAktif,
          surplusDiselamatkan,
          karbonDiselamatkan,
        },
        kulkasPreview,
      },
    });
  } catch (err) {
    console.error("getDashboardSummary error:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data dashboard.",
    });
  }
};

module.exports = { getDashboardSummary };