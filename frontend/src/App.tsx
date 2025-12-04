import { useState } from "react";
// @ts-ignore: no declaration file for Sidebar.jsx
import Sidebar from "./components/Sidebar";
// @ts-ignore: no declaration file for Header.jsx
import Header from "./components/Header";
// @ts-ignore: no declaration file for ProjectsView.jsx
import ProjectsView from "./components/ProjectsView";

// @ts-ignore: no declaration file for IssuesSearchView.jsx
import IssuesSearchView from "./components/IssuesSearchView";
// @ts-ignore: no declaration file for IssueDetailView.jsx
import IssueDetailView from "./components/IssueDetailView";
// @ts-ignore: no declaration file for CreateIssueView.jsx
import CreateIssueView from "./components/CreateIssueView";
// @ts-ignore: no declaration file for AdvancedRequestView.jsx
import AdvancedRequestView from "./components/AdvancedRequestView";
import AdminCustomFieldsView from "./components/AdminCustomFieldsView";
import "./App.css";

function App() {
  const [selected, setSelected] = useState("projects");

  let content = null;
  switch (selected) {
    case "projects":
      content = <ProjectsView />;
      break;
    case "search":
      content = <IssuesSearchView />;
      break;
    case "detail":
      content = <IssueDetailView />;
      break;
    case "create":
      content = <CreateIssueView />;
      break;
    case "advanced":
      content = <AdvancedRequestView />;
      break;
    case "admin":
      content = <AdminCustomFieldsView />;
      break;
    default:
      content = <ProjectsView />;
  }

  return (
    <div className="app">
      <Sidebar selected={selected} onSelect={setSelected} />
      <div className="main">
        <Header />
        <div className="content">{content}</div>
      </div>
    </div>
  );
}

export default App;
