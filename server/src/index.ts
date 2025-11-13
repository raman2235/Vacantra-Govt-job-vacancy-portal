import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import jobRoutes from "./routes/jobRoutes";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
import preferenceRoutes from "./routes/preferenceRoutes";
app.use("/api/preferences", preferenceRoutes);
app.use("/api/jobs", jobRoutes);


app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
import cron from "node-cron";
import fetch from "node-fetch";

cron.schedule("0 */6 * * *", async () => { // every 6 hours
  try {
    console.log("🚀 Scheduled fetch: starting");
    await fetch(`${process.env.SERVER_URL || "http://localhost:4000"}/api/jobs/fetch`, { method: "POST" });
    console.log("✅ Scheduled fetch: done");
  } catch (err) {
    console.error("Scheduled fetch failed:", err);
  }
});

