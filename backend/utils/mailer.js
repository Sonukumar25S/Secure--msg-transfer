// backend/utils/mailer.js
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendVerificationEmail(toEmail, token) {
  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const msg = {
    to: toEmail,
    from: process.env.SMTP_FROM, // verified sender in SendGrid
    subject: "Verify your Secure Transfer account",
    text: `Please verify your email: ${link}`,
    html: `<p>Please verify your email by clicking <a href="${link}">this link</a>.</p>
           <p>If the link doesn't work, copy and paste this URL into your browser:</p>
           <p>${link}</p>`
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Verification email sent to", toEmail);
  } catch (err) {
    // Log SendGrid response for debugging (do NOT expose to clients)
    console.error("SendGrid error:", err?.response?.body || err);
    throw err; // rethrow so caller (signup route) can handle/log it
  }
}

module.exports = { sendVerificationEmail };
