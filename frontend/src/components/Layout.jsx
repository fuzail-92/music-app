import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItem = (to, label) => (
    <Link
      to={to}
      className={`nav-item ${location.pathname === to ? "active" : ""}`}
    >
      {label}
    </Link>
  );

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // agar backend call fail bhi ho, local session clear kar dete hain
      console.error("Logout error:", err);
    } finally {
      logout();
      navigate("/login");
    }
  }

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
          {user && navItem("/playlists", "Playlists")}
          {user?.role === "artist" && navItem("/upload", "Upload")}
          {user?.role === "artist" && navItem("/albums/new", "New album")}
        </nav>

        <div className="deck-foot">
          {user ? (
            <div className="account-block">
              <div className="account-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="account-info">
                <div className="account-name">{user.username}</div>
                <div className="account-role">{user.role}</div>
              </div>
              <button
                className="logout-btn"
                onClick={handleLogout}
                title="Log out"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <path
                    d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ) : (
            navItem("/login", "Log in")
          )}
        </div>
      </aside>

      <main className="stage">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
