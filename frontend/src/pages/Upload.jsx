import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Upload() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Choose an audio file first");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("music", file);

    try {
      const res = await api.post("/music/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(`"${res.data.music.title}" uploaded.`);
      setTitle("");
      setFile(null);
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Artist tools</div>
        <h1 className="page-title">Upload a track</h1>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="field">
          <label>Track title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Late Night Drive"
            required
          />
        </div>

        <div className="field">
          <label>Audio file</label>
          <label className={`file-drop ${file ? "has-file" : ""}`}>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files[0] || null)}
            />
            <span>
              {file ? `🎵 ${file.name}` : "Click to choose an audio file"}
            </span>
          </label>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Uploading…" : "Upload track"}
        </button>
      </form>
    </div>
  );
}

export default Upload;
