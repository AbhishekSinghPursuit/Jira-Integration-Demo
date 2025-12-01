import { useState } from "react";
import { rawJiraRequest } from "../apiClient";

// 🔹 Common Jira API presets
const PRESETS = [
  {
    id: "myself",
    label: "Get current user (/myself)",
    method: "GET",
    path: "/myself",
    body: "",
  },
  {
    id: "projects",
    label: "List projects (/project)",
    method: "GET",
    path: "/project",
    body: "",
  },
  {
    id: "search_jql",
    label: "Search issues (POST /search/jql)",
    method: "POST",
    path: "/search/jql",
    body: JSON.stringify(
      {
        jql: "project = ESA AND created >= -7d ORDER BY created DESC",
        maxResults: 20,
        fields: ["summary", "status", "assignee", "created"],
      },
      null,
      2
    ),
  },
  {
    id: "issue_by_key",
    label: "Get issue by key (/issue/{KEY})",
    method: "GET",
    path: "/issue/ESA-1", // change ESA-1 to any real key
    body: "",
  },
  {
    id: "create_issue",
    label: "Create issue (POST /issue)",
    method: "POST",
    path: "/issue",
    body: JSON.stringify(
      {
        fields: {
          project: { key: "ESA" },
          summary: "Demo issue created from advanced panel",
          issuetype: { name: "Task" },
          description: "Optional description goes here",
        },
      },
      null,
      2
    ),
  },
];

export default function AdvancedRequestView() {
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/myself");
  const [bodyText, setBodyText] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("myself");

  const applyPreset = (presetId) => {
    setSelectedPreset(presetId);
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setMethod(preset.method);
    setPath(preset.path);
    setBodyText(preset.body || "");
    setResponse(null);
    setError("");
  };

  // apply default preset on first render (basic safeguard if needed)
  // (optional: you can remove if you don't want auto-apply)
  if (!response && !error && !bodyText && path === "/myself" && selectedPreset === "myself") {
    // no-op, just ensures initial state consistent with first preset
  }

  const handleSend = async () => {
    setError("");
    setResponse(null);

    let body = undefined;
    if (bodyText.trim()) {
      try {
        body = JSON.parse(bodyText);
      } catch {
        setError("Body must be valid JSON");
        return;
      }
    }

    try {
      const data = await rawJiraRequest({
        method,
        path,
        body,
      });
      setResponse(data);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.error || "Request failed");
    }
  };

  return (
    <div className="view">
      <h2>Advanced Jira Request</h2>
      <p className="view-description">
        Send arbitrary requests to Jira through the backend. Use a preset for
        common APIs or customize method, path and body.
      </p>

      {/* 🔹 Preset dropdown */}
      <label className="field-label">Presets</label>
      <select
        value={selectedPreset}
        onChange={(e) => applyPreset(e.target.value)}
      >
        {PRESETS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>

      {/* Method + Path */}
      <div className="row">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="/myself, /project, /issue/KEY..."
        />
      </div>

      {/* Body */}
      <label className="field-label">Body (JSON, optional)</label>
      <textarea
        value={bodyText}
        onChange={(e) => setBodyText(e.target.value)}
        rows={8}
      />

      <button onClick={handleSend}>Send</button>

      {error && <p className="error">{error}</p>}
      {response && (
        <pre className="json-block">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
