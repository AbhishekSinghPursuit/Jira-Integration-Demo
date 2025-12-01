import { useState } from "react";
import { getIssue } from "../apiClient";

export default function IssueDetailView() {
  const [key, setKey] = useState("");
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoad = async () => {
    if (!key.trim()) return;
    setLoading(true);
    setError("");
    setIssue(null);
    try {
      const data = await getIssue(key.trim());
      setIssue(data);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.error || "Failed to load issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view">
      <h2>Issue Detail</h2>
      <p className="view-description">
        Fetch a specific issue from Jira by its key (e.g. <code>ESA-1</code>).
      </p>
      <div className="row">
        <input
          placeholder="Issue key (e.g. ESA-1)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button onClick={handleLoad}>Load</button>
      </div>

      {loading && <p>Loading issue...</p>}
      {error && <p className="error">{error}</p>}

      {issue && (
        <div className="issue-detail">
          <h3>
            {issue.key} — {issue.fields?.summary}
          </h3>
          <p>
            <strong>Status:</strong> {issue.fields?.status?.name}
          </p>
          <p>
            <strong>Assignee:</strong>{" "}
            {issue.fields?.assignee?.displayName || "Unassigned"}
          </p>
          <p>
            <strong>Priority:</strong>{" "}
            {issue.fields?.priority?.name || "N/A"}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {issue.fields?.created?.slice(0, 10)}
          </p>
          <p>
            <strong>Updated:</strong>{" "}
            {issue.fields?.updated?.slice(0, 10)}
          </p>
          <details>
            <summary>Raw JSON</summary>
            <pre className="json-block">
              {JSON.stringify(issue, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
