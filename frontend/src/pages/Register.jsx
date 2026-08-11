import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-eyebrow">Create account</div>
        <h1 className="auth-title">Join the library</h1>
        <p className="auth-sub">
          Upload tracks, build playlists, and share albums.
        </p>

        <div className="field">
          <label>Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => updateField("username", e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="field">
          <label>Account type</label>
          <div className="role-toggle">
            <button
              type="button"
              className={form.role === "user" ? "active" : ""}
              onClick={() => updateField("role", "user")}
            >
              Listener
            </button>
            <button
              type="button"
              className={form.role === "artist" ? "active" : ""}
              onClick={() => updateField("role", "artist")}
            >
              Artist
            </button>
          </div>
          <span className="field-help">
            Artists can upload tracks and manage albums.
          </span>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
