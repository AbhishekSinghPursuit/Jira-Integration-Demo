import { Router } from "express";
import { jiraRequest } from "../jiraClient.js";

const router = Router();

// GET /api/projects  → list Jira projects
router.get("/", async (_req, res, next) => {
  try {
    // You can use /project or /project/search.
    // /project is simpler and returns all projects visible to the user.
    const data = await jiraRequest("GET", "/project", {
      params: { expand: "issueTypes" },
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
