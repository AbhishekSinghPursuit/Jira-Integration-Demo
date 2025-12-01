import { Router } from "express";
import { jiraRequest } from "../jiraClient.js";

const router = Router();

// GET /api/debug/me  → calls Jira /myself
router.get("/me", async (_req, res, next) => {
  try {
    const data = await jiraRequest("GET", "/myself");
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
