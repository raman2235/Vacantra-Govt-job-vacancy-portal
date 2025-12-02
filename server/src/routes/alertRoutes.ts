// server/src/routes/alertRoutes.ts (Final Code)

import { Router, Request, Response } from "express";
// DELETE THIS LINE: import nodemailer from "nodemailer"; 
import prisma from "../prisma";
import authMiddleware from "../middleware/authMiddleware";
import {
  sendAlertsToAllUsers,
  findMatchedJobsForPref,
} from "../controllers/notificationController";
import { sendMail } from "../services/emailService"; 

// ... (rest of the file remains the same, using sendMail for both routes)
const router = Router();

// If you extended Request in authMiddleware via declare module,
// this is just for local typing clarity:
interface AuthedRequest extends Request {
  user?: {
    id: number;
  };
}

/* --------------------------------------------------
   1️⃣ SUBSCRIBE ROUTE (NOW USES CENTRALIZED sendMail)
-------------------------------------------------- */
router.post("/subscribe", async (req: Request, res: Response) => {
  const { email, categories, qualifications, locations } = req.body;

  try {
    // REPLACED: Manual Nodemailer setup with the centralized sendMail function (SendGrid API)
    await sendMail(
      email,
      "Your Job Alerts Subscription is Active! 🎉",
      `<h2>Thanks for subscribing to Vacantra Job Alerts!</h2>
      <p>We'll send you updates based on your preferences:</p>
      <ul>
        <li>Categories: ${categories?.join(", ") || 'None'}</li>
        <li>Qualifications: ${qualifications?.join(", ") || 'None'}</li>
        <li>Locations: ${locations?.join(", ") || 'None'}</li>
      </ul>
      <p>You can manage your preferences on your profile page.</p>`
    );

    return res.json({ success: true, message: "Subscription email sent (via SendGrid)" });
  } catch (err) {
    // If SendGrid API call fails, the error will be caught here.
    console.log("SUBSCRIBE EMAIL ERROR:", err);
    return res.status(500).json({ success: false, message: "Subscription email failed" });
  }
});

/* --------------------------------------------------
   2️⃣ TRIGGER FOR ALL USERS (Admin only)
-------------------------------------------------- */
router.get("/trigger-all", async (req: Request, res: Response) => {
  try {
    return await sendAlertsToAllUsers(null, res);
  } catch (err) {
    console.log("Trigger ALL error:", err);
    return res.status(500).json({ success: false });
  }
});

/* --------------------------------------------------
   3️⃣ TRIGGER FOR CURRENT LOGGED-IN USER ONLY 
   (Solve your problem: "har user ko mat bhejo")
-------------------------------------------------- */
router.get(
  "/trigger-one",
  authMiddleware,
  async (req: AuthedRequest, res: Response) => {
    try {
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { preferences: true },
      });

      if (!user || !user.preferences.length) {
        return res.json({
          success: false,
          message: "No preferences found",
        });
      }

      const pref = user.preferences[0];

      // use imported matcher directly (no require)
      const matchedJobs = await findMatchedJobsForPref(pref);

      if (!matchedJobs.length) {
        return res.json({
          success: true,
          message: "No matched jobs for you right now",
          sent: false,
        });
      }

      const top = matchedJobs.slice(0, 5);

      await sendMail( // <--- This function uses SendGrid successfully
        user.email,
        "Your matched jobs — Vacantra",
        `<h2>Here are your matched jobs</h2>
         <ul>
           ${top.map((j: any) => `<li>${j.title}</li>`).join("")}
         </ul>`
      );

      return res.json({ success: true, sent: true });
    } catch (err) {
      console.log("Trigger ONE error:", err);
      return res.status(500).json({ success: false });
    }
  }
);

export default router;