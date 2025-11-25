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
app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL || ""
  ],
  credentials: true,
}));

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// ✅ Route setup
app.use("/api/auth", authRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/alerts", alertRoutes);
// ✅ Route setup
app.use("/api/admin", adminRoutes);   // ⬅️ yeh naya





// ✅ Root route
app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

// ✅ Start server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});

// ✅ Scheduled job: auto-fetch new data every 6 hours
cron.schedule("0 */6 * * *", async () => {
  try {
    console.log("🚀 Scheduled fetch: starting");
    await fetch(
      `${process.env.SERVER_URL || "http://localhost:4000"}/api/jobs/fetch`,
      { method: "POST" }
    );
    console.log("✅ Scheduled fetch: done");
  } catch (err) {
    console.error("Scheduled fetch failed:", err);
  }
});
