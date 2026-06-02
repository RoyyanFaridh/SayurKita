const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { sendEmail } = require('./sendEmail');

const prisma = new PrismaClient();

const expiryEmailTemplate = (userName, items) => {

  const rows = items.map(item => {

    const status =
      item.daysRemaining <= 1
        ? '🔴 Bahaya'
        : '🟡 Peringatan';

    const days =
      item.daysRemaining <= 0
        ? 'Sudah kadaluwarsa!'
        : item.daysRemaining === 1
          ? 'Besok!'
          : `${item.daysRemaining} hari lagi`;

    return `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
          ${item.nama}
        </td>

        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
          ${item.kategori}
        </td>

        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
          ${days}
        </td>

        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
          ${status}
        </td>
      </tr>
    `;

  }).join('');

  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px;">

      <h2 style="color:#0D1F15;margin-bottom:8px;">
        ⚠️ Peringatan Bahan Kadaluwarsa
      </h2>

      <p style="color:#4b5563;">
        Hei <strong>${userName}</strong>,
        beberapa bahanmu di SayurKita akan segera kadaluwarsa:
      </p>

      <table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;margin:16px 0;">

        <thead>
          <tr style="background:#0D1F15;color:white;">
            <th style="padding:10px 12px;text-align:left;">Bahan</th>
            <th style="padding:10px 12px;text-align:left;">Kategori</th>
            <th style="padding:10px 12px;text-align:left;">Sisa Waktu</th>
            <th style="padding:10px 12px;text-align:left;">Status</th>
          </tr>
        </thead>

        <tbody>
          ${rows}
        </tbody>

      </table>

      <p style="color:#4b5563;font-size:13px;">
        Segera gunakan atau bagikan via fitur
        <strong>Selamatkan!</strong>
        sebelum terbuang sia-sia.
      </p>

    </div>
  `;
};

const runExpiryCheck = async () => {

  console.log(
    '[ExpiryNotifier] Menjalankan cek kadaluwarsa...'
  );

  try {

    const today = new Date();
    today.setHours(0,0,0,0);

    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(
      threeDaysFromNow.getDate() + 3
    );

    console.log(
      '[ExpiryNotifier] Date Range:',
      today,
      '->',
      threeDaysFromNow
    );

    const ingredients =
      await prisma.ingredient.findMany({

        where:{
          expDate:{
            gte: today,
            lte: threeDaysFromNow,
          },
        },

        include:{
          user:{
            select:{
              id:true,
              name:true,
              email:true,
            },
          },
        },
      });

    console.log(
      `[ExpiryNotifier] Ingredients found: ${ingredients.length}`
    );

    if (ingredients.length === 0) {

      console.log(
        '[ExpiryNotifier] Tidak ada bahan eligible.'
      );

      return 0;
    }

    const byUser = {};

    for (const item of ingredients) {

      const uid = item.user.id;

      if (!byUser[uid]) {

        byUser[uid] = {
          user: item.user,
          items: [],
        };
      }

      const expDate = new Date(item.expDate);
      expDate.setHours(0,0,0,0);

      const daysRemaining =
        Math.floor(
          (expDate - today) / 86400000
        );

      byUser[uid].items.push({
        ...item,
        daysRemaining,
      });
    }

    console.log(
      '[DEBUG users]',
      Object.values(byUser).map(x => ({
        id: x.user.id,
        email: x.user.email,
      }))
    );

    let totalSent = 0;

    for (const { user, items }
      of Object.values(byUser)) {

      try {

        if (!user.email) {

          console.log(
            `[ExpiryNotifier] Skip user ${user.id} — no email`
          );

          continue;
        }

        console.log(
          `[ExpiryNotifier] Attempt -> ${user.id} | ${user.email}`
        );

        await sendEmail({

          to: user.email,

          subject:
            `⚠️ ${items.length} bahan akan kadaluwarsa — SayurKita`,

          html:
            expiryEmailTemplate(
              user.name,
              items
            ),
        });

        console.log(
          `[ExpiryNotifier] SUCCESS -> ${user.email}`
        );

        totalSent++;

      } catch (err) {

        console.error(
          `[ExpiryNotifier] FAILED -> ${user.email}`,
          err.message
        );
      }
    }

    console.log(
      `[ExpiryNotifier] Total sent: ${totalSent}`
    );

    return totalSent;

  } catch (err) {

    console.error(
      '[ExpiryNotifier] ERROR:',
      err
    );

    return 0;
  }
};

const runExpiryNotifier = () => {

  cron.schedule(
    '0 7 * * *',
    runExpiryCheck,
    {
      timezone:'Asia/Jakarta'
    }
  );

  console.log(
    '[ExpiryNotifier] Cron aktif — 07:00 WIB'
  );
};

module.exports = {
  runExpiryNotifier,
  runExpiryCheck,
};