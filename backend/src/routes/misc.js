import { Router } from "express";
import { jiraRequest } from "../jiraClient.js";

const router = Router();

/**
 * GET /api/me
 * Calls GET /rest/api/3/myself
 */
router.get("/me", async (_req, res, next) => {
  try {
    const data = await jiraRequest("GET", "/myself");
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/misc/raw
 * Body: { method, path, params, body }
 * Generic Jira playground
 */
router.post("/raw", async (req, res, next) => {
  try {
    let { method = "GET", path, params, body } = req.body;

    if (!path) {
      const err = new Error("path is required, e.g. /myself or /issue/KEY");
      err.status = 400;
      throw err;
    }

    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    const data = await jiraRequest(method.toUpperCase(), path, {
      params,
      body,
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
