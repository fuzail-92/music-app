import { Link, Outlet, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();

  const navItem = (to, label) => (
    <Link
      to={to}
      className={`nav-item ${location.pathname === to ? "active" : ""}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="shell">
      <aside className="deck">
        <div className="deck-brand">
          <div className="deck-mark">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <circle cx="12" cy="12" r="2.4" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="deck-title">Music App</div>
            <div className="deck-sub">Your library</div>
          </div>
        </div>

        <nav className="deck-nav">
          {navItem("/", "Browse")}
          {navItem("/playlists", "Playlists")}
          {navItem("/upload", "Upload")}
        </nav>

        <div className="deck-foot">{navItem("/login", "Log in")}</div>
      </aside>

      <main className="stage">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
