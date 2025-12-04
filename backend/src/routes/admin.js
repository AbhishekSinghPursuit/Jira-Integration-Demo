import { Router } from "express";
import { jiraRequest } from "../jiraClient.js";

const router = Router();

/**
 * ⚠ ADMIN-ONLY ENDPOINTS
 *
 * These routes call Jira's admin APIs to manage custom fields.
 * Only Jira admins (or internal tooling) should use them.
 *
 * Jira permission required: "Administer Jira" for the user / API token
 * configured in jiraClient.js.
 */

// Internal mapping: simple "kind" → Jira field type + searcher
const JIRA_FIELD_TYPES = {
  number: {
    type: "com.atlassian.jira.plugin.system.customfieldtypes:float",
    searcherKey:
      "com.atlassian.jira.plugin.system.customfieldtypes:exactnumber",
  },
  text: {
    type: "com.atlassian.jira.plugin.system.customfieldtypes:textfield",
    searcherKey:
      "com.atlassian.jira.plugin.system.customfieldtypes:textsearcher",
  },
  textarea: {
    type: "com.atlassian.jira.plugin.system.customfieldtypes:textarea",
    searcherKey:
      "com.atlassian.jira.plugin.system.customfieldtypes:textsearcher",
  },
};

/**
 * Helper to ensure a field exists (idempotent-ish).
 * - If a field with given name exists → return it.
 * - Else → create it via POST /rest/api/3/field.
 */
async function ensureCustomField({ name, description, kind }) {
  const mapping = JIRA_FIELD_TYPES[kind];
  if (!mapping) {
    const err = new Error(
      `Unsupported kind "${kind}". Use one of: ${Object.keys(
        JIRA_FIELD_TYPES
      ).join(", ")}`
    );
    err.status = 400;
    throw err;
  }

  // 1) Get all fields and see if this name already exists
  const allFields = await jiraRequest("GET", "/field");
  const existing = allFields.find((f) => f.name === name);
  if (existing) {
    return { created: false, field: existing };
  }

  // 2) Create a new field
  const body = {
    name,
    description: description || "",
    type: mapping.type,
    searcherKey: mapping.searcherKey,
  };

  const created = await jiraRequest("POST", "/field", { body });
  return { created: true, field: created };
}

/**
 * POST /api/admin/jira/custom-fields
 *
 * Generic admin endpoint to create a custom field.
 * BODY:
 *  {
 *    "name": "AI_estimated_story_points",
 *    "description": "Estimated story points predicted by AI",
 *    "kind": "number" | "text" | "textarea"
 *  }
 *
 * ⚠️ Admin-only in real systems. Here it's just a clearly labelled route.
 */
router.post("/jira/custom-fields", async (req, res, next) => {
  try {
    const { name, description, kind } = req.body || {};
    if (!name || !kind) {
      const err = new Error("Both 'name' and 'kind' are required.");
      err.status = 400;
      throw err;
    }

    const result = await ensureCustomField({ name, description, kind });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/jira/bootstrap-sdlc-fields
 *
 * Convenience endpoint: creates the two SDLC helper fields used by your integration:
 *  - AI_estimated_story_points (textarea)
 *  - Similar_stories_summary (textarea)
 *
 * ⚠️ Intended for one-time admin use when onboarding a Jira instance.
 */
router.post("/jira/bootstrap-sdlc-fields", async (req, res, next) => {
  try {
    const aiField = await ensureCustomField({
      name: "AI_estimated_story_points",
      description:
        "Estimated story points suggested by the AI RequirementGen agent.",
      kind: "textarea",
    });

    const similarField = await ensureCustomField({
      name: "Similar_stories_summary",
      description:
        "Short summary of historically similar Jira stories, used by AI for impact analysis.",
      kind: "textarea",
    });

    res.json({
      note:
        "Admin-only. Run once per Jira site. Fields are created globally if they don't exist.",
      aiField,
      similarField,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/jira/fields
 *
 * Admin helper: list all fields configured in this Jira site.
 * This hits GET /rest/api/3/field and returns the raw array.
 *
 * ⚠ Jira permission: requires a user/API token with permission
 *    to access admin APIs (typically Jira admin).
 */
router.get("/jira/fields", async (req, res, next) => {
  try {
    const fields = await jiraRequest("GET", "/field");
    res.json(fields);
  } catch (err) {
    next(err);
  }
});

export default router;
