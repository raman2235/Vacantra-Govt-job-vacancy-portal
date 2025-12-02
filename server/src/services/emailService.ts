// src/services/emailService.ts - FINAL VERSION USING SENDGRID SDK

// NOTE: This code requires the '@sendgrid/mail' npm package to be installed.
import * as sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
// The 'from' address must be a verified sender in your SendGrid account.
const VERIFIED_SENDER = process.env.ALERT_FROM || "no-reply@vacantra-app.com"; 

if (SENDGRID_API_KEY) {
  // Set the API Key globally for the SendGrid SDK
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log("✅ SendGrid SDK Initialized.");
} else {
  console.warn("⚠ SENDGRID_API_KEY is missing. Email sending will fail.");
}

// Nodemailer transport verification is no longer needed as we use the SDK/API endpoint.

export async function sendMail(to: string, subject: string, html: string) {
  if (!SENDGRID_API_KEY) {
    console.error("❌ SendGrid API key not set. Cannot send email.");
    // We throw an error to prevent the calling route (trigger-one) from assuming success.
    throw new Error("Email service is unavailable: SendGrid API Key missing.");
  }
  
  const from = VERIFIED_SENDER; 

  const msg = {
    to,
    from, 
    subject,
    html,
  };

  try {
    // Send email via SendGrid API
    const [response] = await sgMail.send(msg);

    // SendGrid API returns status codes 200/202 for success.
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log(`📩 Email sent to ${to} → SendGrid Status: ${response.statusCode}`);
      return response;
    } else {
      console.error(`❌ SendGrid failed (${response.statusCode}):`, response.body);
      throw new Error(`SendGrid API error: ${response.statusCode}`);
    }
  } catch (err: any) {
    console.error("❌ SendGrid Email API Error:", err.message || err);
    throw err; 
  }
}