import React, { useEffect, useState } from "react";
import { Film, ArrowLeft, Star, Eye, Timer } from "lucide-react";
import { api } from "../services/api";

export default function Dashboard({ onBack }) {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFilms();
  }, []);

  const loadFilms = async () => {
    try {
      const data = await api.films.myFilms(); // GET /myfilms
      setFilms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <Film size={48} />
        <p>Loading your films...</p>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>
          <ArrowLeft size={18} />
          Back
        </button>
        <h1 style={styles.title}>My Library</h1>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      {films.length === 0 ? (
        <div style={styles.empty}>
          <Film size={80} />
          <p>You haven't added any films yet</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {films.map((film) => (
            <div key={film._id} style={styles.card}>
              <h3>{film.title}</h3>

              <p style={styles.year}>
                {film.watchedAt ? new Date(film.watchedAt).toLocaleDateString("en-GB") : "You haven't watched this yet"}
              </p>

              <div style={styles.meta}>
                {film.watched && (
                  <span style={styles.badge}>
                    <Eye size={14} /> Watched
                  </span>
                )}
                {film.runtime !== undefined && (
                  <span style={styles.badge}>
                    <Timer size={14} /> {film.runtime} min
                  </span>
                )}
                {film.rating !== undefined && (
                  <span style={styles.badge}>
                    <Star size={14} /> {film.rating}
                  </span>
                )}
              </div>

              {film.notes && (
                <p style={styles.notes}>{film.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    padding: 20,
    background: "#0b1220",
    color: "#e5e7eb",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 22,
  },

  title: {
    fontSize: 24,
    fontWeight: 800,
    color: "#f1f5f9",
    letterSpacing: "-0.2px",
  },

  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 12px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,.22)",
    background: "rgba(2,6,23,.35)",
    color: "#e5e7eb",
    cursor: "pointer",
    transition: "background .15s ease, border-color .15s ease, transform .08s ease",
    userSelect: "none",
  },
  backBtnHover: {
    background: "rgba(2,6,23,.55)",
    borderColor: "rgba(148,163,184,.35)",
  },
  backBtnActive: { transform: "scale(0.98)" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 14,
  },

  card: {
    padding: 16,
    borderRadius: 14,
    background: "rgba(2,6,23,.45)",
    border: "1px solid rgba(148,163,184,.16)",
    boxShadow: "0 10px 22px rgba(0,0,0,.22)",
    transition: "transform .10s ease, border-color .15s ease, background .15s ease",
  },
  cardHover: {
    transform: "translateY(-2px)",
    background: "rgba(2,6,23,.60)",
    borderColor: "rgba(148,163,184,.28)",
  },

  year: {
    fontSize: 13,
    color: "#94a3b8",
  },

  meta: {
    display: "flex",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    padding: "5px 8px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(2,6,23,.55)",
    color: "#e5e7eb",
  },

  notes: {
    marginTop: 10,
    fontSize: 13,
    color: "rgba(229,231,235,.85)",
    lineHeight: 1.35,
  },

  empty: {
    textAlign: "center",
    marginTop: 80,
    color: "#94a3b8",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  error: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    border: "1px solid rgba(239,68,68,.35)",
    background: "rgba(239,68,68,.12)",
    color: "#fecaca",
    fontSize: 13,
  },
};
