const nodemailer = require('nodemailer');

async function createTransport() {
  // Use SMTP provider credentials in .env
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendVerificationEmail(toEmail, token) {
  const transport = await createTransport();
  const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: toEmail,
    subject: 'Verify your email',
    html: `<p>Please verify your email by clicking <a href="${link}">this link</a></p>`
  });
}

module.exports = { sendVerificationEmail };
