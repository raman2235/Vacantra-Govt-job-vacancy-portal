import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "@/lib/api";

export function useJobAlerts() {
  const [newJobs, setNewJobs] = useState<any[]>([]);
  const lastCount = useRef(0);

  async function checkJobs() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/alerts/matched`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.error("Job alert fetch failed:", res.status);
        return;
      }

      const data = await res.json();

      const jobs = data.jobs || [];
      const count = jobs.length;

      // Notify only if new jobs arrived
      if (count > lastCount.current) {
        const difference = count - lastCount.current;
        setNewJobs(jobs.slice(0, difference));
      }

      lastCount.current = count;

    } catch (err) {
      console.log("Job alert error:", err);
    }
  }

  useEffect(() => {
    checkJobs(); // First load
    const interval = setInterval(checkJobs, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return newJobs;
}
