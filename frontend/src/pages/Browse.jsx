import { useEffect, useState } from "react";
import api from "../api/axios";

function Browse() {
  const [musics, setMusics] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
