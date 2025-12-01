import { useEffect, useState } from "react";
import { getProjects } from "../apiClient";

export default function ProjectsView() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getProjects();
        // Depending on backend, you might get an array or an object.
        const list = Array.isArray(data) ? data : data.values || [];
        setProjects(list);
      } catch (e) {
        console.error(e);
        setError(e.response?.data?.error || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="view">
      <h2>Projects</h2>
      <p className="view-description">
        Projects available for the integration user in Jira Cloud.
      </p>
      {loading && <p>Loading projects...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Name</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id || p.key}>
                <td>{p.key}</td>
                <td>{p.name}</td>
                <td>{p.projectTypeKey || p.projectType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
