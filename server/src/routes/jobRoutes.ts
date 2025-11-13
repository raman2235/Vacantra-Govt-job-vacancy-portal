import express from "express";
import { fetchJobsFromApi } from "../controllers/fetchJobsFromApi";
const router = express.Router();

router.post("/fetch", fetchJobsFromApi); // call POST /api/jobs/fetch
router.get("/fetch", fetchJobsFromApi);  // allow GET with query params (education_level etc)

export default router;

