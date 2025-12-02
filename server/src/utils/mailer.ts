// server/src/utils/mailer.ts (Final Code)

/*
This file previously contained the Nodemailer SMTP configuration.
It is now deprecated to remove the direct dependency on 'nodemailer' and fix the build error.
The project uses the SendGrid SDK via server/src/services/emailService.ts for all email operations.
*/

// Export placeholders to satisfy the compiler if other files rely on these exports.
export const mailer = {};

export const sendMail = async (to: string, subject: string, html: string) => {
    console.error("The sendMail function in mailer.ts is deprecated and non-functional.");
};