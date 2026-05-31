const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { sendEmail } = require('./sendEmail');

const prisma = new PrismaClient();

const expiryEmailTemplate = (userName, items) => {
  const rows = items.map(item => {
    const status = item.daysRemaining <= 1 ? '🔴 Bahaya' : '🟡 Peringatan';
    const days = item.daysRemaining <= 0
      ? 'Sudah kadaluwarsa!'
      : item.daysRemaining === 1
        ? 'Besok!'
        : `${item.daysRemaining} hari lagi`;
    return `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.nama}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.kategori}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${days}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${status}</td>
      </tr>
    `;
  }).join('');

  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px;">
      <h2 style="color:#0D1F15;margin-bottom:8px;">⚠️ Peringatan Bahan Kadaluwarsa</h2>
      <p style="color:#4b5563;">Hei <strong>${userName}</strong>, beberapa bahanmu di SayurKita akan segera kadaluwarsa:</p>
      <table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;margin:16px 0;">
        <thead>
          <tr style="background:#0D1F15;color:white;">
            <th style="padding:10px 12px;text-align:left;font-size:13px;">Bahan</th>
            <th style="padding:10px 12px;text-align:left;font-size:13px;">Kategori</th>
            <th style="padding:10px 12px;text-align:left;font-size:13px;">Sisa Waktu</th>
            <th style="padding:10px 12px;text-align:left;font-size:13px;">Status</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="color:#4b5563;font-size:13px;">Segera gunakan atau bagikan via fitur <strong>Selamatkan!</strong> sebelum terbuang sia-sia.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">Jangan Buang, Jadikan Berkah. — SayurKita</p>
    </div>
  `;
};

const runExpiryCheck = async () => {
  console.log('[ExpiryNotifier] Menjalankan cek kadaluwarsa...');

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const ingredients = await prisma.ingredient.findMany({
      where: {
        expDate: { lte: threeDaysFromNow, gte: today },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (ingredients.length === 0) {
      console.log('[ExpiryNotifier] Tidak ada bahan yang akan kadaluwarsa.');
      return 0;
    }

    const byUser = {};
    for (const item of ingredients) {
      const uid = item.user.id;
      if (!byUser[uid]) {
        byUser[uid] = { user: item.user, items: [] };
      }
      const expDate = new Date(item.expDate);
      expDate.setHours(0, 0, 0, 0);
      const daysRemaining = Math.floor((expDate - today) / 86400000);
      byUser[uid].items.push({ ...item, daysRemaining });
    }

    let totalSent = 0;
    for (const { user, items } of Object.values(byUser)) {
      await sendEmail({
        to: user.email,
        subject: `⚠️ ${items.length} bahan akan kadaluwarsa — SayurKita`,
        html: expiryEmailTemplate(user.name, items),
      });
      console.log(`[ExpiryNotifier] Email dikirim ke ${user.email} (${items.length} bahan)`);
      totalSent++;
    }

    return totalSent;
  } catch (err) {
    console.error('[ExpiryNotifier] Error:', err.message);
    return 0;
  }
};

const runExpiryNotifier = () => {
  // Jalan setiap hari jam 07.00 WIB (00.00 UTC)
  cron.schedule('0 0 * * *', runExpiryCheck);
  console.log('[ExpiryNotifier] Cron job aktif — cek setiap hari jam 07.00 WIB');
};

module.exports = { runExpiryNotifier, runExpiryCheck };