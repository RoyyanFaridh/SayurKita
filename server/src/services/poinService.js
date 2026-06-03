const prisma = require("../lib/prisma");

function hitungBonusStreak(streak) {
  if (streak <= 3)  return 1;
  if (streak <= 10) return 2;
  return 3;
}

const awardPoin = async (userId, totalKarbon, cookingLogId) => {
  // Guard idempoten — cegah double-award untuk cookingLog yang sama
  const [sudahAda, user] = await Promise.all([
    prisma.poinLog.findFirst({
      where: { refId: cookingLogId, source: "KARBON" },
    }),
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
  ]);

  if (sudahAda) {
    return { poinKarbon: 0, bonusStreak: 0, newStreak: user.streakCount };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const karbonBaru        = user.totalKarbonAkumulasi + totalKarbon;
  const totalPoinKarbon = Math.floor(karbonBaru / 20);
  const poinKarbon        = totalPoinKarbon - user.poinKarbonAwarded; 

  // ── Kalkulasi streak ───────────────────────────────────────────────────────
  let diffDays = null;
  if (user.lastActiveDate) {
    const last = new Date(user.lastActiveDate);
    last.setHours(0, 0, 0, 0);
    diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
  }

  let newStreak;
  if (diffDays === null || diffDays > 1) {
    newStreak = 1;
  } else if (diffDays === 1) {
    newStreak = user.streakCount + 1;
  } else {
    newStreak = user.streakCount;
  }

  const sudahAktifHariIni = diffDays === 0;
  const bonusStreak       = sudahAktifHariIni ? 0 : hitungBonusStreak(newStreak);
  const totalDelta        = poinKarbon + bonusStreak;

  if (totalDelta === 0 && sudahAktifHariIni) {
    return { poinKarbon, bonusStreak, newStreak };
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        points:               { increment: totalDelta },
        streakCount:          newStreak,
        lastActiveDate:       sudahAktifHariIni ? undefined : today,
        totalKarbonAkumulasi: karbonBaru,
        poinKarbonAwarded:    totalPoinKarbon,
      },
    });

    if (poinKarbon > 0) {
      await tx.poinLog.create({
        data: {
          userId,
          delta:  poinKarbon,
          source: "KARBON",
          note:   `${totalKarbon} kg CO₂ diselamatkan (total ${karbonBaru.toFixed(2)} kg)`,
          refId:  cookingLogId,
        },
      });
    }

    if (bonusStreak > 0) {
      await tx.poinLog.create({
        data: {
          userId,
          delta:  bonusStreak,
          source: "STREAK",
          note:   `Streak hari ke-${newStreak}`,
        },
      });
    }
  });

  return { poinKarbon, bonusStreak, newStreak };
};

module.exports = { awardPoin };