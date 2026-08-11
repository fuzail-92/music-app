import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Browse() {
  const { user } = useAuth();
  const [musics, setMusics] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likedIds, setLikedIds] = useState(new Set());

  useEffect(() => {
    let cancelled = false;

    async function fetchMusics() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/music?page=${page}&limit=6`);
        if (!cancelled) {
          setMusics(res.data.musics);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Could not load tracks");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMusics();
    return () => {
      cancelled = true;
    };
  }, [page]);

  useEffect(() => {
    if (!user) return;
    async function fetchLikes() {
      try {
        const res = await api.get("/music/likes");
        setLikedIds(new Set(res.data.musics.map((m) => m._id)));
      } catch {
        // silent — likes are a nice-to-have, not critical
      }
    }
    fetchLikes();
  }, [user]);

  async function toggleLike(musicId) {
    if (!user) return;
    const isLiked = likedIds.has(musicId);
    // optimistic update — UI turant badal deti hai, backend ke jawab ka wait nahi karti
    setLikedIds((prev) => {
      const next = new Set(prev);
      isLiked ? next.delete(musicId) : next.add(musicId);
      return next;
    });
    try {
      if (isLiked) {
        await api.delete("/music/like", { data: { musicId } });
      } else {
        await api.post("/music/like", { musicId });
      }
    } catch {
      // fail ho to wapas purani state mein le aayein
      setLikedIds((prev) => {
        const next = new Set(prev);
        isLiked ? next.add(musicId) : next.delete(musicId);
        return next;
      });
    }
  }

  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Library</div>
        <h1 className="page-title">Browse tracks</h1>
      </div>

      {loading && <div className="state-msg">Loading tracks…</div>}
      {error && <div className="state-msg error">{error}</div>}

      {!loading && !error && musics.length === 0 && (
        <div className="empty-block">
          <p>No tracks yet.</p>
          <span>Artists can upload the first one.</span>
        </div>
      )}

      {!loading && musics.length > 0 && (
        <>
          <div className="track-grid">
            {musics.map((m) => (
              <div className="track-card" key={m._id}>
                <div className="track-art">
                  <div className="vinyl" />
                  <svg
                    viewBox="0 0 24 24"
                    width="26"
                    height="26"
                    fill="none"
                    className="track-art-icon"
                  >
                    <path
                      d="M9 18V5l12-2v13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="6"
                      cy="18"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="18"
                      cy="16"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  {user && (
                    <button
                      className={`like-btn ${likedIds.has(m._id) ? "liked" : ""}`}
                      onClick={() => toggleLike(m._id)}
                      title={likedIds.has(m._id) ? "Unlike" : "Like"}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill={likedIds.has(m._id) ? "currentColor" : "none"}
                      >
                        <path
                          d="M12 21s-7.5-4.6-10-9.3C.5 8.4 2 5 5.5 5c2 0 3.5 1.2 4.5 2.7C11 6.2 12.5 5 14.5 5 18 5 19.5 8.4 22 11.7 19.5 16.4 12 21 12 21z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="track-info">
                  <div className="track-title">{m.title}</div>
                  <div className="track-artist">
                    {m.artist?.username || "Unknown artist"}
                  </div>
                  <audio controls src={m.uri} className="track-audio" />
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="pager">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.pages, p + 1))
                }
                disabled={page === pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Browse;
