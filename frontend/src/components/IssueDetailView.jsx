import { useState } from "react";
import { getIssue, findSimilarIssues } from "../apiClient";

export default function IssueDetailView() {
  const [key, setKey] = useState("");
  const [issue, setIssue] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loadingIssue, setLoadingIssue] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [error, setError] = useState("");

  const handleLoad = async () => {
    const trimmed = key.trim();
    if (!trimmed) return;

    setLoadingIssue(true);
    setError("");
    setSimilar([]);
    setIssue(null);

    try {
      const data = await getIssue(trimmed);
      setIssue(data);
    } catch (e) {
      console.error("Error loading issue", e);
      setError(e?.response?.data?.error || e.message || "Failed to load issue");
    } finally {
      setLoadingIssue(false);
    }
  };

  const handleSimilar = async () => {
    try {
      if (!issue) {
        setError("Please load an issue first.");
        return;
      }

      setError("");
      setLoadingSimilar(true);

      const projectKey = issue?.fields?.project?.key;
      const issueKey = issue.key; // ✅ use the loaded issue key

      const data = await findSimilarIssues({ projectKey, issueKey });
      setSimilar(data.issues || []);
    } catch (e) {
      console.error("Error fetching similar issues", e);
      setError(
        e?.response?.data?.error || e.message || "Failed to fetch similar issues"
      );
    } finally {
      setLoadingSimilar(false);
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
        <button onClick={handleLoad} disabled={loadingIssue}>
          {loadingIssue ? "Loading..." : "Load"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {issue && (
        <div className="issue-detail" style={{ marginTop: 16 }}>
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
            <strong>Created:</strong> {issue.fields?.created?.slice(0, 10)}
          </p>
          <p>
            <strong>Updated:</strong> {issue.fields?.updated?.slice(0, 10)}
          </p>
          <details>
            <summary>Raw JSON</summary>
            <pre className="json-block">
              {JSON.stringify(issue, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {issue && (
        <>
          <button
            onClick={handleSimilar}
            style={{ marginTop: 8 }}
            disabled={loadingSimilar}
          >
            {loadingSimilar ? "Searching..." : "Find Similar Stories"}
          </button>

          {similar.length > 0 && (
            <div className="similar-block" style={{ marginTop: 16 }}>
              <h3>Similar Stories</h3>
              <ul>
                {similar.map((i) => (
                  <li key={i.key}>
                    <strong>{i.key}</strong> – {i.fields.summary}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
