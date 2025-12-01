import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // adjust if needed
});

// Jira current user
export async function getCurrentUser() {
  const res = await api.get("/api/misc/me");
  return res.data;
}

// Projects list
export async function getProjects() {
  const res = await api.get("/api/projects");
  return res.data;
}

// Search issues (JQL)
export async function searchIssues({ jql, fields, maxResults }) {
  const params = { jql };
  if (fields) params.fields = fields;
  if (maxResults) params.maxResults = maxResults;

  const res = await api.get("/api/issues/search", { params });
  return res.data; // { issues, isLast, nextPageToken }
}

// Single issue detail
export async function getIssue(key) {
  const res = await api.get(`/api/issues/${encodeURIComponent(key)}`);
  return res.data;
}

// Create issue
export async function createIssue({ projectKey, summary, description, issueType }) {
  const payload = {
    projectKey,
    summary,
    description,
  };
  if (issueType) payload.issueType = issueType;

  const res = await api.post("/api/issues", payload);
  return res.data;
}

// Advanced raw Jira request via backend
export async function rawJiraRequest({ method, path, params, body }) {
  const res = await api.post("/api/misc/raw", {
    method,
    path,
    params,
    body,
  });
  return res.data;
}
