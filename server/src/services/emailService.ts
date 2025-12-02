// src/services/emailService.ts

// NOTE: Nodemailer natively supports many services like 'SendGrid' 
// if the corresponding API key is provided via environment variables.

import nodemailer from "nodemailer";

// Using explicit service configuration for SendGrid/Mailgun/etc.
// For SendGrid, Nodemailer uses 'apikey' as the user and the API key as the password.
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net", // Explicit host for SendGrid
  port: 587, // Standard port (though it uses API key, this is the official setting)
  secure: false, 
  auth: {
    user: "apikey", // Standard SendGrid username for API key authentication
    pass: process.env.SENDGRID_API_KEY, // The new API Key from Render ENV
  },
});

// Optional: verify SMTP connection (Now connects to SendGrid)
transporter
  .verify()
  .then(() => {
    console.log("✅ SendGrid transporter verified (via API key).");
  })
  .catch((err) => {
    // If this fails, the SENDGRID_API_KEY is likely incorrect.
    console.warn("❌ SendGrid verify failed (Check API Key):", err?.message || err);
  });

export async function sendMail(to: string, subject: string, html: string) {
  // IMPORTANT: The 'from' address must be a verified sender in your SendGrid account.
  const from =
    process.env.ALERT_FROM || "no-reply@vacantra-app.com"; // Change to a domain you control, or your SendGrid verified sender.

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log(`📩 Email sent to ${to} → Message ID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error("❌ sendMail error:", err);
    throw err;
  }
}