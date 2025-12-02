// src/services/emailService.ts
import nodemailer from "nodemailer";

// Use explicit configuration with STARTTLS on port 587 for maximum compatibility 
// in cloud environments like Render.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // <-- Standard port for STARTTLS
  secure: false, // <-- Set to false for STARTTLS (port 587)
  requireTLS: true, // <-- Ensures connection upgrade to TLS
  auth: {
    user: process.env.EMAIL_USER, // Gmail ID
    pass: process.env.EMAIL_PASS, // App password (NOT Gmail login password)
  },
});

// Optional: verify SMTP connection
transporter
  .verify()
  .then(() => {
    console.log("✅ SMTP transporter verified");
  })
  .catch((err) => {
    console.warn("⚠ SMTP verify failed:", err?.message || err);
  });

export async function sendMail(to: string, subject: string, html: string) {
  const from =
    process.env.ALERT_FROM || process.env.EMAIL_USER || "no-reply@gmail.com";

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