const otpTemplate = (otp, expireMinutes = 5) => `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px;">
  <h2 style="color:#0D1F15;margin-bottom:8px;">Verifikasi Akun SayurKita</h2>
  <p style="color:#4b5563;margin-bottom:24px;">Gunakan kode OTP berikut untuk verifikasi akunmu:</p>
  <div style="background:#0D1F15;color:#ffffff;font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;padding:20px;border-radius:8px;">
    ${otp}
  </div>
  <p style="color:#6b7280;font-size:13px;margin-top:16px;">Berlaku selama <strong>${expireMinutes} menit</strong>. Jangan bagikan ke siapapun.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
  <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">Jangan Buang, Jadikan Berkah. — SayurKita</p>
</div>
`;

const claimTemplate = (posterName, itemTitle) => `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px;">
  <h2 style="color:#0D1F15;margin-bottom:8px;">Ada yang mengklaim surplusmu!</h2>
  <p style="color:#4b5563;">Hei <strong>${posterName}</strong>, seseorang telah mengklaim:</p>
  <div style="background:#E6F2EC;padding:16px;border-radius:8px;margin:16px 0;">
    <p style="color:#0D1F15;font-weight:600;margin:0;">${itemTitle}</p>
  </div>
  <p style="color:#4b5563;">Buka aplikasi untuk mengkonfirmasi atau menolak klaim ini.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
  <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">Jangan Buang, Jadikan Berkah. — SayurKita</p>
</div>
`;

const confirmTemplate = (claimerName, itemTitle) => `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px;">
  <h2 style="color:#0D1F15;margin-bottom:8px;">Klaimmu dikonfirmasi! 🎉</h2>
  <p style="color:#4b5563;">Hei <strong>${claimerName}</strong>, donatur telah mengkonfirmasi klaimmu untuk:</p>
  <div style="background:#E6F2EC;padding:16px;border-radius:8px;margin:16px 0;">
    <p style="color:#0D1F15;font-weight:600;margin:0;">${itemTitle}</p>
  </div>
  <p style="color:#4b5563;">Segera hubungi donatur untuk mengambil makananmu.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
  <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">Jangan Buang, Jadikan Berkah. — SayurKita</p>
</div>
`;

const weeklyTemplate = (name, stats) => `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px;">
  <h2 style="color:#0D1F15;margin-bottom:8px;">Ringkasan Mingguanmu 🌿</h2>
  <p style="color:#4b5563;">Hei <strong>${name}</strong>, ini aktivitasmu minggu ini:</p>
  <div style="background:#E6F2EC;padding:16px;border-radius:8px;margin:16px 0;display:flex;flex-direction:column;gap:8px;">
    <p style="margin:0;color:#0D1F15;">🥗 Surplus didonasikan: <strong>${stats.donated}</strong></p>
    <p style="margin:0;color:#0D1F15;">🎁 Surplus diterima: <strong>${stats.received}</strong></p>
    <p style="margin:0;color:#0D1F15;">🌱 Karbon diselamatkan: <strong>${stats.karbon} kg CO₂</strong></p>
    <p style="margin:0;color:#0D1F15;">⭐ Poin terkumpul: <strong>${stats.poin}</strong></p>
  </div>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
  <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">Jangan Buang, Jadikan Berkah. — SayurKita</p>
</div>
`;

module.exports = { otpTemplate, claimTemplate, confirmTemplate, weeklyTemplate };