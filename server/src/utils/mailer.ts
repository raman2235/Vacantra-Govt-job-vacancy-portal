// server/src/utils/mailer.ts (Final Code Fix)

/*
This file is deprecated. The project uses the SendGrid SDK via server/src/services/emailService.ts.
*/
export const mailer = {};
export const sendMail = async (to: string, subject: string, html: string) => {
    console.error("The sendMail function in mailer.ts is deprecated and non-functional.");
};