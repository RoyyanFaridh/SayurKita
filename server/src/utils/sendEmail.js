const { Resend } = require('resend');

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const sendEmail = async ({
  to,
  subject,
  html
}) => {

  try {

    const result =
      await resend.emails.send({
        from:
          'SayurKita <onboarding@resend.dev>',
        to,
        subject,
        html,
      });

    console.log(
      `[Resend] SUCCESS → ${to}`
    );

    return result;

  } catch(err) {

    console.error(
      `[Resend] FAILED → ${to}`,
      err
    );

    throw err;  
  }
};

module.exports = { sendEmail };