// backend/src/routes/issues.js
import { Router } from "express";
import { jiraRequest } from "../jiraClient.js";

const router = Router();

function getAuthHeaders() {
  const basic = Buffer.from(
    `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
  ).toString("base64");

  return {
    "Authorization": "Basic " + Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString("base64"),
    "Accept": "application/json",
    "Content-Type": "application/json",
  };
}


/**
 * GET /api/issues/search?jql=...
 *
 * Internally uses POST /rest/api/3/search/jql
 * with a JSON body, as required by the new Jira API.
 */
router.get("/search", async (req, res, next) => {
  try {
    // If user doesn't provide jql, use a bounded default (last 30 days)
    const jql =
      req.query.jql || "ESA created >= -30d ORDER BY created DESC";

    const body = {
      jql,
      maxResults: 50,
      fields: ["summary", "status", "assignee", "project"],
    };

    const data = await jiraRequest("POST", "/search/jql", { body });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/issues/:key  → get issue details from Jira
router.get("/:key", async (req, res) => {
  const issueKey = req.params.key;

  try {
    const url = `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${encodeURIComponent(
      issueKey
    )}?fields=summary,status,assignee,priority,created,updated,description,project`;

    console.log("Calling Jira issue detail:", url);

    const jiraRes = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const text = await jiraRes.text();

    if (!jiraRes.ok) {
      let errJson;
      try {
        errJson = JSON.parse(text);
      } catch {
        errJson = { errorMessages: [text] };
      }

      console.error("Jira /issue error:", jiraRes.status, errJson);

      return res.status(jiraRes.status).json({
        error:
          errJson.errorMessages?.[0] ||
          `Jira returned status ${jiraRes.status}`,
        details: errJson,
      });
    }

    const data = JSON.parse(text);
    return res.json(data);
  } catch (err) {
    console.error("Backend /api/issues/:key error:", err);
    return res.status(500).json({
      error: "Failed to fetch issue detail",
      details: err.message || String(err),
    });
  }
});

// POST /api/issues  → create issue in Jira
// Body: { projectKey, summary, description, issueType? }
router.post("/", async (req, res) => {
  const { projectKey, summary, description, issueType } = req.body;

  if (!projectKey || !summary) {
    return res.status(400).json({
      error: "projectKey and summary are required",
    });
  }

  // Standard Jira create payload for v3
  const payload = {
    fields: {
      project: { key: projectKey },
      summary,
      issuetype: { name: issueType || "Task" },
    },
  };

  if (description) {
    payload.fields.description = description;
  }

  try {
    const url = `${process.env.JIRA_BASE_URL}/rest/api/3/issue`;
    console.log("Calling Jira create issue:", url, payload);

    const jiraRes = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const text = await jiraRes.text();

    if (!jiraRes.ok) {
      let errJson;
      try {
        errJson = JSON.parse(text);
      } catch {
        errJson = { errorMessages: [text] };
      }

      console.error("Jira create issue error:", jiraRes.status, errJson);

      return res.status(jiraRes.status).json({
        error:
          errJson.errorMessages?.[0] ||
          `Jira returned status ${jiraRes.status}`,
        details: errJson,
      });
    }

    const data = JSON.parse(text);
    return res.status(201).json(data);
  } catch (err) {
    console.error("Backend /api/issues (create) error:", err);
    return res.status(500).json({
      error: "Failed to create issue",
      details: err.message || String(err),
    });
  }
});

export default router;