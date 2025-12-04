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

export async function findSimilarIssues({ projectKey, issueKey, summary }) {
  const params = {};
  if (projectKey) params.projectKey = projectKey;
  if (issueKey) params.issueKey = issueKey;
  if (summary) params.summary = summary;

  const res = await api.get("/api/issues/similar", { params });
  return res.data;
}

// --- Admin: Jira custom fields ---

export async function createCustomFieldApi({ name, description, kind }) {
  const res = await api.post("/api/admin/jira/custom-fields", {
    name,
    description,
    kind,
  });
  return res.data;
}

export async function bootstrapSdlcFieldsApi() {
  const res = await api.post("/api/admin/jira/bootstrap-sdlc-fields");
  return res.data;
}

export async function listJiraFieldsApi() {
  const res = await api.get("/api/admin/jira/fields");
  return res.data;
}


