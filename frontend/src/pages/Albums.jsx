import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Albums() {
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const [allTracks, setAllTracks] = useState([]);
  const [expanded, setExpanded] = useState(null); // { id, detail }

  async function fetchAlbums() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/music/albums");
      setAlbums(res.data.albums);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load albums");
    } finally {
      setLoading(false);
    }
  }

  async function fetchAllTracks() {
    try {
      const res = await api.get("/music?page=1&limit=50");
      setAllTracks(res.data.musics);
    } catch {
      // silent
    }
  }

  useEffect(() => {
    fetchAlbums();
    fetchAllTracks();
  }, []);

  async function toggleExpand(albumId) {
    if (expanded?.id === albumId) {
      setExpanded(null);
      return;
    }
    try {
      const res = await api.get(`/music/albums/${albumId}`);
      setExpanded({ id: albumId, detail: res.data.album });
    } catch (err) {
      setError(err.response?.data?.message || "Could not load album");
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim() || allTracks.length === 0) return;
    setCreating(true);
    try {
      // naya album kam se kam ek track ke saath banta hai — pehla track use karte hain by default
      await api.post("/music/album", { title, musics: [allTracks[0]._id] });
      setTitle("");
      fetchAlbums();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create album");
    } finally {
      setCreating(false);
    }
  }

  async function handleAddTrack(albumId, musicId) {
    if (!musicId) return;
    try {
      await api.put("/music/album/add-music", { albumId, musicId });
      const res = await api.get(`/music/albums/${albumId}`);
      setExpanded({ id: albumId, detail: res.data.album });
      fetchAlbums();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add track");
    }
  }

  async function handleRemoveTrack(albumId, musicId) {
    try {
      await api.put("/music/album/remove-music", { albumId, musicId });
      const res = await api.get(`/music/albums/${albumId}`);
      setExpanded({ id: albumId, detail: res.data.album });
      fetchAlbums();
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove track");
    }
  }

  async function handleDelete(albumId) {
    try {
      await api.delete(`/music/album/${albumId}`);
      setExpanded(null);
      fetchAlbums();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete album");
    }
  }

  const isArtist = user?.role === "artist";

  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Collections</div>
        <h1 className="page-title">Albums</h1>
      </div>

      {isArtist && (
        <form className="inline-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="New album title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={creating || allTracks.length === 0}
          >
            {creating ? "Creating…" : "Create"}
          </button>
        </form>
      )}
      {isArtist && allTracks.length === 0 && (
        <p className="field-help" style={{ marginTop: 8 }}>
          Upload a track first — albums need at least one track to start.
        </p>
      )}

      {error && (
        <div className="auth-error" style={{ marginTop: 16 }}>
          {error}
        </div>
      )}
      {loading && <div className="state-msg">Loading albums…</div>}

      {!loading && albums.length === 0 && (
        <div className="empty-block" style={{ marginTop: 20 }}>
          <p>No albums yet.</p>
          <span>
            {isArtist
              ? "Create one above."
              : "Check back once an artist publishes one."}
          </span>
        </div>
      )}

      <div className="playlist-list">
        {albums.map((a) => (
          <div className="playlist-card" key={a._id}>
            <div className="playlist-head" onClick={() => toggleExpand(a._id)}>
              <div>
                <div className="playlist-name">{a.title}</div>
                <div className="playlist-meta">
                  by {a.artist?.username || "Unknown"}
                </div>
              </div>
              {isArtist && a.artist?.username === user.username && (
                <button
                  className="icon-btn danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(a._id);
                  }}
                  title="Delete album"
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
              )}
            </div>

            {expanded?.id === a._id && expanded.detail && (
              <div className="playlist-body">
                {expanded.detail.musics?.length > 0 ? (
                  <ul className="playlist-tracks">
                    {expanded.detail.musics.map((m) => (
                      <li key={m._id}>
                        <span>{m.title}</span>
                        {isArtist && a.artist?.username === user.username && (
                          <button
                            className="icon-btn"
                            onClick={() => handleRemoveTrack(a._id, m._id)}
                            title="Remove from album"
                          >
                            ✕
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="track-artist" style={{ marginBottom: 12 }}>
                    No tracks in this album.
                  </p>
                )}

                {isArtist && a.artist?.username === user.username && (
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      handleAddTrack(a._id, e.target.value);
                      e.target.value = "";
                    }}
                  >
                    <option value="" disabled>
                      Add a track…
                    </option>
                    {allTracks
                      .filter(
                        (t) =>
                          !expanded.detail.musics?.some((m) => m._id === t._id),
                      )
                      .map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.title}
                        </option>
                      ))}
                  </select>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Albums;
