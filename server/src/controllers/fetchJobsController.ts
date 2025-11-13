import { Request, Response } from "express";
import prisma from "../prisma";
import crypto from "crypto";

// ✅ No need to import node-fetch in Node 18+ (fetch is global)

export const fetchJobsFromApi = async (req: Request, res: Response) => {
  try {
    console.log("🚀 Fetching jobs from API...");

    // 1️⃣ API URL (set this in your .env)
    const API_URL = process.env.JOBS_API_URL || "https://api.publicapis.org/entries"; // example test URL

    // 2️⃣ Optional: API Key (if any)
    const API_KEY = process.env.JOBS_API_KEY;
    const headers: any = {};
    if (API_KEY) headers["Authorization"] = `Bearer ${API_KEY}`;

    // 3️⃣ Add timeout manually (since fetch doesn't support it by default)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20 sec
    const response = await fetch(API_URL, { headers, signal: controller.signal });
    clearTimeout(timeout);

    // 4️⃣ Handle non-OK responses
    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: "Upstream API error", details: text });
    }

    // 5️⃣ Parse data
    const data = await response.json();
    const jobsArray = Array.isArray(data.jobs) ? data.jobs : data.entries || [];

    console.log(`📦 ${jobsArray.length} jobs fetched`);

    // 6️⃣ Save / update in DB
    let saved = 0;
    for (const raw of jobsArray) {
      const title = raw.title || raw.API || "Untitled Job";
      const organization = raw.organization || raw.Description || "Unknown";
      const location = raw.location || null;
      const deadline = raw.deadline || null;
      const qualificationRequired = raw.qualification || null;
      const description = raw.description || raw.Description || null;
      const syllabus = raw.syllabus || null;
      const applyLink = raw.applyLink || raw.Link || null;
      const age = raw.age ? Number(raw.age) : null;

      const hashSource = `${title}-${organization}-${deadline}-${applyLink}`;
      const jobHash = crypto.createHash("sha256").update(hashSource).digest("hex");

      await prisma.job.upsert({
        where: { jobHash },
        update: {
          title,
          organization,
          location,
          deadline,
          qualificationRequired,
          description,
          syllabus,
          applyLink,
          age,
        },
        create: {
          jobHash,
          title,
          organization,
          location,
          deadline,
          qualificationRequired,
          description,
          syllabus,
          applyLink,
          age,
        },
      });
      saved++;
    }

    console.log(`✅ ${saved} jobs saved/updated`);
    return res.json({ success: true, total: jobsArray.length, saved });

  } catch (error: any) {
    console.error("❌ FETCH JOBS ERROR:", error);
    return res.status(500).json({
      error: "Fetch failed",
      details: error.name === "AbortError" ? "Request timed out" : String(error),
    });
  }
};
