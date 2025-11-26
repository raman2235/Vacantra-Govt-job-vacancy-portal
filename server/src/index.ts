import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/authRoutes";
import jobRoutes from "./routes/jobRoutes";
import preferenceRoutes from "./routes/preferenceRoutes";
import cron from "node-cron";
import fetch from "node-fetch";
import alertRoutes from "./routes/alertRoutes";
import { sendAlertsToAllUsers } from "./controllers/notificationController";
import adminRoutes from "./routes/adminRoutes";

const app = express();

// ----------------------------------------------------
// CORS SETUP
// ----------------------------------------------------
const FRONTEND_URL = process.env.FRONTEND_URL || "";

app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev frontend
      FRONTEND_URL,            // deployed frontend (Render / Vercel)
    ].filter(Boolean),         // empty strings hata dega
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// ----------------------------------------------------
// ROUTES
// ----------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/admin", adminRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

// ----------------------------------------------------
// SERVER START
// ----------------------------------------------------
const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});

// ----------------------------------------------------
// CRON JOB – auto fetch new jobs every 6 hours
// ----------------------------------------------------
const INTERNAL_BASE_URL =
  process.env.SERVER_URL || `http://localhost:${PORT}`;

cron.schedule("0 */6 * * *", async () => {
  try {
    console.log("🚀 Scheduled fetch: starting");
    await fetch(`${INTERNAL_BASE_URL}/api/jobs/fetch`, {
      method: "POST",
    });
    console.log("✅ Scheduled fetch: done");
  } catch (err) {
    console.error("Scheduled fetch failed:", err);
  }
});
