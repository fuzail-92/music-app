import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
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
      const res = await api.post("/auth/login", form);
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
        <div className="auth-eyebrow">Welcome back</div>
        <h1 className="auth-title">Log in</h1>
        <p className="auth-sub">Pick up where you left off.</p>

        <div className="field">
          <label>Username or email</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => updateField("username", e.target.value)}
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
          />
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
