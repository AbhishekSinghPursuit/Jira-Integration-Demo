import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const { JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN } = process.env;

if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
  console.error("Missing Jira env vars. Check .env");
  process.exit(1);
}

// This exactly matches what worked for you in the snippet
const authHeader =
  "Basic " +
  Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");

/**
 * Generic Jira API request helper using node-fetch
 * @param {"GET"|"POST"|"PUT"|"DELETE"} method
 * @param {string} path - e.g. "/project", "/search", "/issue/KEY"
 * @param {object} options - { params?: object, body?: object }
 */
export async function jiraRequest(method, path, options = {}) {
  const { params, body } = options;

  // Build URL: {JIRA_BASE_URL}/rest/api/3{path}?params...
  const url = new URL(`${JIRA_BASE_URL}/rest/api/3${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  console.log("[JiraRequest]", method, url.toString());

  const res = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: authHeader,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();

  // Try to parse JSON, but keep plain text (like CloudFront HTML) if needed
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    console.error("Jira error status:", res.status);
    console.error(
      "Jira error data (first 400 chars):",
      typeof data === "string" ? data.slice(0, 400) : data
    );
    const msg =
      (data && data.errorMessages && data.errorMessages.join(", ")) ||
      data?.message ||
      res.statusText;

    const err = new Error(msg);
    err.status = res.status;
    err.details = data;
    throw err;
  }

  return data;
}
