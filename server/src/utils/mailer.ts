// server/src/utils/mailer.ts

/*
This file previously contained the Nodemailer SMTP configuration (mailer and sendMail exports).
It has been deprecated to fix the Render deployment issue (Connection Timeout) and remove the direct dependency on 'nodemailer'.

The project now uses the SendGrid SDK via server/src/services/emailService.ts for all email operations.
*/

// Export placeholders to satisfy the TypeScript compiler if other files are still importing from here.
export const mailer = {};

export const sendMail = async (to: string, subject: string, html: string) => {
    console.error("The sendMail function in mailer.ts is deprecated and non-functional.");
    // The actual email should be sent using the sendMail function imported from services/emailService.ts
};