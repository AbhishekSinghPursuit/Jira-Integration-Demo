export default function Sidebar({ selected, onSelect }) {
  const items = [
    { id: "projects", label: "Projects" },
    { id: "search", label: "Search Issues" },
    { id: "detail", label: "Issue Detail" },
    { id: "create", label: "Create Issue" },
    { id: "advanced", label: "Advanced Request" },
    { id: "admin", label: "Admin Custom Fields" },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Jira Integration Demo</h2>
      <div className="sidebar-menu">
        {items.map((item) => (
          <button
            key={item.id}
            className={
              "sidebar-item" + (selected === item.id ? " active" : "")
            }
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
