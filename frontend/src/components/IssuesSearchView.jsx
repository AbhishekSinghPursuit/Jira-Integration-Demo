import { useState } from "react";
import { searchIssues } from "../apiClient";

export default function IssuesSearchView() {
  const [jql, setJql] = useState(
    'project = ESA AND created >= -30d ORDER BY created DESC'
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!jql.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await searchIssues({
        jql,
        maxResults: 50,
        fields: "summary,status,assignee,priority,created",
      });
      setResult(data);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.error || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view">
      <h2>Search Issues (JQL)</h2>
      <p className="view-description">
        Run bounded JQL queries against Jira via the backend. This uses the
        new <code>/rest/api/3/search/jql</code> endpoint.
      </p>

      <label className="field-label">JQL</label>
      <textarea
        value={jql}
        onChange={(e) => setJql(e.target.value)}
        rows={3}
      />

      <button onClick={handleSearch}>Search</button>

      {loading && <p>Searching issues...</p>}
      {error && <p className="error">{error}</p>}

      {result && (
        <>
          <p className="view-meta">
            Issues: {result.issues?.length ?? 0}{" "}
            {result.isLast ? "(last page)" : ""}
          </p>
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Summary</th>
                <th>Status</th>
                <th>Assignee</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {(result.issues || []).map((issue) => (
                <tr key={issue.id}>
                  <td>{issue.key}</td>
                  <td>{issue.fields?.summary}</td>
                  <td>{issue.fields?.status?.name}</td>
                  <td>
                    {issue.fields?.assignee?.displayName || (
                      <span className="muted">Unassigned</span>
                    )}
                  </td>
                  <td>{issue.fields?.created?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
