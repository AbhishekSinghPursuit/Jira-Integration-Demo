import { useEffect, useState } from "react";
import { getCurrentUser } from "../apiClient";

export default function Header() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load Jira user");
      }
    })();
  }, []);

  return (
    <div className="header">
      <div className="header-left">
        <h1>Jira Cloud Integration</h1>
        <p className="header-subtitle">
          Reusable demo module for your SDLC platform
        </p>
      </div>
      <div className="header-right">
        {user && (
          <div className="user-chip">
            <div className="avatar-circle">
              {user.displayName?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <div className="user-name">{user.displayName}</div>
              <div className="user-email">{user.emailAddress}</div>
            </div>
          </div>
        )}
        {error && <span className="error">{error}</span>}
      </div>
    </div>
  );
}
