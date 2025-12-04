import { useState } from "react";
import {
  createCustomFieldApi,
  bootstrapSdlcFieldsApi,
  listJiraFieldsApi,
} from "../apiClient";

export default function AdminCustomFieldsView() {
  const [name, setName] = useState("AI_estimated_story_points");
  const [description, setDescription] = useState(
    "Estimated story points suggested by the AI RequirementGen agent."
  );
  const [kind, setKind] = useState("number");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await createCustomFieldApi({ name, description, kind });
      setResult(data);
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.data?.error ||
          e.message ||
          "Failed to create custom field"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBootstrap = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await bootstrapSdlcFieldsApi();
      setResult(data);
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.data?.error ||
          e.message ||
          "Failed to bootstrap SDLC fields"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleListFields = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await listJiraFieldsApi();
      setFields(data);
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.data?.error ||
          e.message ||
          "Failed to fetch Jira fields"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="view">
      <h2>Admin – Jira Custom Fields</h2>
      <p className="view-description" style={{ color: "#b45309" }}>
        ⚠ Admin-only: these operations call Jira&apos;s global custom field API.
        Use only if your Jira token has <strong>Administer Jira</strong>{" "}
        permission. Run once per Jira site.
      </p>

      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <h3>Inspect Jira fields (Admin)</h3>
        <p style={{ fontSize: 14 }}>
          Fetches all Jira fields from <code>/rest/api/3/field</code>.
          Use this to verify that AI fields exist and to find their IDs.
        </p>
        <button onClick={handleListFields} disabled={loading}>
          {loading ? "Working..." : "List Jira Fields"}
        </button>

        {fields.length > 0 && (
          <div style={{ marginTop: 12, maxHeight: 300, overflow: "auto" }}>
            <table className="simple-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((f) => (
                  <tr key={f.id}>
                    <td>{f.id}</td>
                    <td>{f.name}</td>
                    <td>{f.schema?.type || f.schema?.custom || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>


      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <h3>Create a single custom field</h3>
        <div className="row">
          <label style={{ minWidth: 120 }}>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Custom field name"
          />
        </div>

        <div className="row" style={{ marginTop: 8 }}>
          <label style={{ minWidth: 120 }}>Kind</label>
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="number">Number (float)</option>
            <option value="text">Short text</option>
            <option value="textarea">Long text</option>
          </select>
        </div>

        <div className="row" style={{ marginTop: 8 }}>
          <label style={{ minWidth: 120 }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: "100%" }}
          />
        </div>

        <button
          style={{ marginTop: 12 }}
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? "Working..." : "Create Custom Field (Admin)"}
        </button>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <h3>Bootstrap SDLC helper fields</h3>
        <p style={{ fontSize: 14 }}>
          This will ensure the following Jira custom fields exist:
        </p>
        <ul style={{ fontSize: 14, marginLeft: 20 }}>
          <li>
            <code>AI_estimated_story_points</code> – numeric field for AI
            story-point estimation.
          </li>
          <li>
            <code>Similar_stories_summary</code> – long text field for showing
            summaries of similar Jira stories.
          </li>
        </ul>
        <button onClick={handleBootstrap} disabled={loading}>
          {loading ? "Working..." : "Create / Ensure SDLC Fields (Admin)"}
        </button>
      </div>

      {error && <p className="error" style={{ marginTop: 12 }}>{error}</p>}

      {result && (
        <details style={{ marginTop: 12 }}>
          <summary>API result</summary>
          <pre className="json-block">{JSON.stringify(result, null, 2)}</pre>
        </details>
      )}
    </div>
  );
}
