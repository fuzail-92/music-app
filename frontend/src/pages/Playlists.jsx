import { useEffect, useState } from "react";
import api from "../api/axios";

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [creating, setCreating] = useState(false);

  const [allTracks, setAllTracks] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  async function fetchPlaylists() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/music/playlists");
      setPlaylists(res.data.playlists);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load playlists");
    } finally {
      setLoading(false);
    }
  }

  async function fetchAllTracks() {
    try {
      const res = await api.get("/music?page=1&limit=50");
      setAllTracks(res.data.musics);
    } catch {
      // silent — track picker just stays empty
    }
  }

  useEffect(() => {
    fetchPlaylists();
    fetchAllTracks();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      await api.post("/music/playlist", { name, isPublic });
      setName("");
      setIsPublic(false);
      fetchPlaylists();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create playlist");
    } finally {
      setCreating(false);
    }
  }

  async function handleAddTrack(playlistId, musicId) {
    if (!musicId) return;
    try {
      await api.post("/music/playlist/add", { playlistId, musicId });
      fetchPlaylists();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add track");
    }
  }

  async function handleRemoveTrack(playlistId, musicId) {
    try {
      await api.post("/music/playlist/remove", { playlistId, musicId });
      fetchPlaylists();
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove track");
    }
  }

  async function handleDelete(playlistId) {
    try {
      await api.delete(`/music/playlist/${playlistId}`);
      fetchPlaylists();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete playlist");
    }
  }

  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Your library</div>
        <h1 className="page-title">Playlists</h1>
      </div>

      <form className="inline-form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="New playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="checkbox-inline">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Public
        </label>
        <button type="submit" className="btn-primary" disabled={creating}>
          {creating ? "Creating…" : "Create"}
        </button>
      </form>

      {error && (
        <div className="auth-error" style={{ marginTop: 16 }}>
          {error}
        </div>
      )}
      {loading && <div className="state-msg">Loading playlists…</div>}

      {!loading && playlists.length === 0 && (
        <div className="empty-block" style={{ marginTop: 20 }}>
          <p>No playlists yet.</p>
          <span>Create one above to start adding tracks.</span>
        </div>
      )}

      <div className="playlist-list">
        {playlists.map((p) => (
          <div className="playlist-card" key={p._id}>
            <div
              className="playlist-head"
              onClick={() => setExpandedId(expandedId === p._id ? null : p._id)}
            >
              <div>
                <div className="playlist-name">{p.name}</div>
                <div className="playlist-meta">
                  {p.musics?.length || 0} tracks ·{" "}
                  {p.isPublic ? "Public" : "Private"}
                </div>
              </div>
              <button
                className="icon-btn danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(p._id);
                }}
                title="Delete playlist"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                  <path
                    d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {expandedId === p._id && (
              <div className="playlist-body">
                {p.musics?.length > 0 ? (
                  <ul className="playlist-tracks">
                    {p.musics.map((m) => (
                      <li key={m._id}>
                        <span>{m.title}</span>
                        <button
                          className="icon-btn"
                          onClick={() => handleRemoveTrack(p._id, m._id)}
                          title="Remove from playlist"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="track-artist" style={{ marginBottom: 12 }}>
                    No tracks added yet.
                  </p>
                )}

                <select
                  defaultValue=""
                  onChange={(e) => {
                    handleAddTrack(p._id, e.target.value);
                    e.target.value = "";
                  }}
                >
                  <option value="" disabled>
                    Add a track…
                  </option>
                  {allTracks
                    .filter((t) => !p.musics?.some((m) => m._id === t._id))
                    .map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.title}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlists;
