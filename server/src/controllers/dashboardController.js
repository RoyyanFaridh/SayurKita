const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const TODAY_CRITICAL_DAYS = 3;

/**
 * GET /api/dashboard/summary
 * Menyuplai semua data yang dibutuhkan halaman Dashboard secara real-time.
 * Terproteksi oleh authMiddleware (req.userId sudah diisi sebelum fungsi ini dipanggil).
 *
 * Response mencakup:
 *  - user         : sapaan dinamis (name, points)
 *  - stats        : totalBahanKulkas, postingAktif, surplusDiselamatkan, karbonDiselamatkan
 *  - kulkasPreview: maksimal 5 bahan terakhir ditambahkan beserta status kedaluwarsa
 */
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

    // ─── 3. Agregasi aman / kritis (logika sama dengan getIngredientsSummary) ─
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let safe = 0;
    let critical = 0;

    for (const item of allIngredients) {
      const expDate = new Date(item.expDate);
      expDate.setHours(0, 0, 0, 0);
      const daysRemaining = Math.floor(
        (expDate - today) / (1000 * 60 * 60 * 24),
      );

      if (daysRemaining <= TODAY_CRITICAL_DAYS) {
        critical++;
      } else {
        safe++;
      }
    }

    // ─── 4. Kulkas Preview — 5 bahan terbaru (diurutkan createdAt DESC) ──────
    // Ambil dari data yang sudah ada di memory agar tidak double-query.
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
        expStatus,  // "expired" | "danger" | "warning" | "ok" | "fresh"
        expLabel,   // Label tampilan untuk badge, cth: "Besok!", "3 hari", dll.
      };
    });

    // ─── 5. Placeholder stats (model Surplus belum dibuat) ───────────────────
    // Ketika model Surplus sudah tersedia, ganti bagian ini dengan query nyata.
    const postingAktif = 0;
    const surplusDiselamatkan = user.points > 0
      ? Math.floor(user.points / 10) // estimasi: 10 poin per surplus
      : 0;

    // Estimasi karbon: setiap 1 bahan di kulkas mewakili ~0.5 kg CO2 yang diselamatkan
    const karbonDiselamatkan = parseFloat((totalBahanKulkas * 0.5).toFixed(1));

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
          critical,
          postingAktif,          // placeholder — model Surplus belum ada
          surplusDiselamatkan,   // placeholder — estimasi dari poin
          karbonDiselamatkan,    // placeholder — estimasi dari total bahan
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
