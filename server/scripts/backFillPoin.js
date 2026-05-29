const { PrismaClient } = require("@prisma/client");
const { awardPoin } = require("../src/services/poinService");
const prisma = new PrismaClient();

async function backfill() {
  const logs = await prisma.cookingLog.findMany({
    orderBy: { createdAt: "asc" }, // urutan lama ke baru agar streak akurat
  });

  // Ambil semua refId yang sudah pernah di-award (guard double-run)
  const sudahAward = await prisma.poinLog.findMany({
    where:  { source: "KARBON", refId: { not: null } },
    select: { refId: true },
  });
  const sudahAwardIds = new Set(sudahAward.map(p => p.refId));

  const belumAward = logs.filter(log => !sudahAwardIds.has(log.id));
  console.log(`Total logs: ${logs.length} | Belum di-award: ${belumAward.length}`);

  for (const log of belumAward) {
    try {
      const result = await awardPoin(log.userId, log.totalKarbon, log.id);
      console.log(`✓ logId=${log.id} | +${result.poinKarbon}p karbon | +${result.bonusStreak}p streak | streak=${result.newStreak}`);
    } catch (err) {
      console.error(`✗ logId=${log.id}`, err.message);
    }
  }

  console.log("Backfill selesai.");
  await prisma.$disconnect();
}

backfill();