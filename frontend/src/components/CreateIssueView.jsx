import { useState } from "react";
import { createIssue } from "../apiClient";

export default function CreateIssueView() {
  const [projectKey, setProjectKey] = useState("");
  const [issueType, setIssueType] = useState("Task");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [created, setCreated] = useState(null);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    setError("");
    setCreated(null);

    if (!projectKey.trim() || !summary.trim()) {
      setError("Project key and summary are required");
      return;
    }

    try {
      const data = await createIssue({
        projectKey: projectKey.trim(),
        summary: summary.trim(),
        description,
        issueType,
      });
      setCreated(data);
      setSummary("");
      setDescription("");
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.error || "Failed to create issue");
    }
  };

  return (
    <div className="view">
      <h2>Create Issue</h2>
      <p className="view-description">
        Create a new issue in Jira via the backend. Uses{" "}
        <code>POST /api/issues</code>.
      </p>

      <label className="field-label">Project Key</label>
      <input
        placeholder="e.g. ESA"
        value={projectKey}
        onChange={(e) => setProjectKey(e.target.value)}
      />

      <label className="field-label">Issue Type</label>
      <input
        value={issueType}
        onChange={(e) => setIssueType(e.target.value)}
        placeholder="Task, Story, Bug..."
      />

      <label className="field-label">Summary</label>
      <input
        placeholder="Short summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      <label className="field-label">Description</label>
      <textarea
        placeholder="Optional description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />

      <button onClick={handleCreate}>Create</button>

      {error && <p className="error">{error}</p>}

      {created && (
        <p className="success">
          Created issue <strong>{created.key}</strong>
        </p>
      )}
    </div>
  );
}
