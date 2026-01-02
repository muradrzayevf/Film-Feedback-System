import React, { useEffect, useState } from "react";
import { Film, ArrowLeft, Star, Eye } from "lucide-react";
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
                {film.releaseDate || "N/A"}
              </p>

              <div style={styles.meta}>
                {film.watched && (
                  <span style={styles.badge}>
                    <Eye size={14} /> Watched
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
    background: "#0b1020",
    color: "#fff",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 900,
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,.2)",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 14,
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.15)",
  },
  year: {
    fontSize: 13,
    color: "rgba(216,180,254,.8)",
  },
  meta: {
    display: "flex",
    gap: 8,
    marginTop: 8,
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 8,
    background: "rgba(168,85,247,.25)",
  },
  notes: {
    marginTop: 10,
    fontSize: 13,
    color: "rgba(255,255,255,.8)",
  },
  empty: {
    textAlign: "center",
    marginTop: 80,
    color: "rgba(216,180,254,.8)",
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
    background: "rgba(239,68,68,.2)",
    borderRadius: 10,
  },
};
