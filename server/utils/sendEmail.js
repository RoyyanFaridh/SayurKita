const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    await resend.emails.send({
      from: 'SayurKita <onboarding@resend.dev>',
      to,
      subject,
      html,
    });
    console.log(`[Resend] Email berhasil dikirim ke ${to}`);
  } catch (err) {
    console.error('[Resend] Gagal kirim email:', err.message);
  }
};

module.exports = { sendEmail };