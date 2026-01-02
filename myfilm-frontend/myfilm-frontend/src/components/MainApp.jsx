import React, { useState } from "react";
import { Search, Film, LogOut, Plus } from "lucide-react";
import { api } from "../services/api";
import AddFilmModal from "./AddFilmModal";

export default function MainApp({ onLogout, onOpenDashboard }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (searchQuery.trim().length < 3) {
      setError("Search query must be at least 3 characters");
      return;
    }

    setError("");
    setSearching(true);
    try {
      const results = await api.films.search(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleAddFilm = (film) => {
    setSelectedFilm(film);
    setShowAddModal(true);
  };

  return (
    <div className="appRoot" style={styles.appRoot}>
      <header className="header" style={styles.header}>
        <div className="headerInner" style={styles.headerInner}>
          <div className="brand" style={styles.brand}>
            <Film className="brandIcon" style={styles.brandIcon} />
            <h1 className="brandTitle" style={styles.brandTitle}>
              MyFilm
            </h1>
          </div>
            <button onClick={onOpenDashboard} style={styles.logoutBtn}>
                My Films
            </button>

          <button onClick={onLogout} className="logoutBtn" style={styles.logoutBtn}>
            <LogOut className="logoutIcon" style={styles.logoutIcon} />
            Logout
          </button>
        </div>
      </header>

      <main className="main" style={styles.main}>
        <div className="searchBlock" style={styles.searchBlock}>
          <div className="searchRow" style={styles.searchRow}>
            <div className="searchInputWrap" style={styles.searchInputWrap}>
              <Search className="searchIcon" style={styles.searchIcon} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search for movies..."
                className="searchInput"
                style={styles.searchInput}
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={searching}
              className="searchBtn"
              style={{
                ...styles.searchBtn,
                ...(searching ? styles.searchBtnDisabled : null),
              }}
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </div>

          {error && (
            <div className="errorBox" style={styles.errorBox}>
              {error}
            </div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="grid" style={styles.grid}>
            {searchResults.map((film) => (
              <div key={film.tmdbID} className="card" style={styles.card}>
                <h3 className="cardTitle" style={styles.cardTitle}>
                  {film.title}
                </h3>

                <p className="cardSub" style={styles.cardSub}>
                  {film.release_date ? new Date(film.release_date).getFullYear() : "N/A"}
                </p>

                <button
                  onClick={() => handleAddFilm(film)}
                  className="addBtn"
                  style={styles.addBtn}
                >
                  <Plus className="addIcon" style={styles.addIcon} />
                  Add to Library
                </button>
              </div>
            ))}
          </div>
        )}

        {searchResults.length === 0 && !searching && (
          <div className="empty" style={styles.empty}>
            <Film className="emptyIcon" style={styles.emptyIcon} />
            <p className="emptyText" style={styles.emptyText}>
              Search for movies to add to your library
            </p>
          </div>
        )}
      </main>

      {showAddModal && (
        <AddFilmModal
          film={selectedFilm}
          onClose={() => {
            setShowAddModal(false);
            setSelectedFilm(null);
          }}
          onSuccess={() => {
            setShowAddModal(false);
            setSelectedFilm(null);
            setSearchResults([]);
            setSearchQuery("");
          }}
        />
      )}
    </div>
  );
}

const styles = {
  appRoot: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 20% 20%, rgba(168,85,247,.25), rgba(15,23,42,0) 60%), radial-gradient(900px 500px at 80% 30%, rgba(99,102,241,.22), rgba(15,23,42,0) 55%), linear-gradient(135deg, #0b1020, #1b0f2d 45%, #0b1020)",
    color: "#fff",
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: "rgba(0,0,0,.28)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,.10)",
  },

  headerInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  },

  brandIcon: {
    width: 32,
    height: 32,
    color: "rgba(192,132,252,.95)",
    flex: "0 0 auto",
  },

  brandTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: ".2px",
    whiteSpace: "nowrap",
  },

  logoutBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(239,68,68,.35)",
    background: "rgba(239,68,68,.12)",
    color: "rgba(254,202,202,.95)",
    cursor: "pointer",
    userSelect: "none",
    transition: "transform .06s ease, background .15s ease, border-color .15s ease",
  },

  logoutIcon: { width: 16, height: 16 },

  main: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "26px 16px 40px",
  },

  searchBlock: { marginBottom: 22 },

  searchRow: {
    display: "flex",
    gap: 12,
    alignItems: "stretch",
    flexWrap: "wrap",
  },

  searchInputWrap: {
    flex: "1 1 320px",
    position: "relative",
    minWidth: 240,
  },

  searchIcon: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    width: 20,
    height: 20,
    color: "rgba(216,180,254,.85)",
    pointerEvents: "none",
  },

  searchInput: {
    width: "100%",
    padding: "14px 14px 14px 44px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.18)",
    background: "rgba(255,255,255,.10)",
    color: "#fff",
    outline: "none",
    fontSize: 15,
    boxShadow: "0 10px 24px rgba(0,0,0,.18)",
  },

  searchBtn: {
    flex: "0 0 auto",
    padding: "14px 18px",
    borderRadius: 14,
    border: "1px solid rgba(168,85,247,.35)",
    background: "linear-gradient(135deg, rgba(168,85,247,.95), rgba(99,102,241,.85))",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
    transition: "transform .06s ease, filter .15s ease",
    minWidth: 140,
  },

  searchBtnDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
    filter: "saturate(.7)",
  },

  errorBox: {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(239,68,68,.45)",
    background: "rgba(239,68,68,.14)",
    color: "rgba(254,202,202,.95)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    gap: 14,
  },

  card: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,.16)",
    background: "rgba(255,255,255,.10)",
    backdropFilter: "blur(10px)",
    padding: 16,
    boxShadow: "0 18px 36px rgba(0,0,0,.22)",
    transition: "transform .10s ease, background .15s ease",
  },

  cardTitle: { margin: "0 0 6px", fontSize: 18, fontWeight: 900 },

  cardSub: { margin: 0, color: "rgba(216,180,254,.9)", fontSize: 13 },

  addBtn: {
    marginTop: 14,
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(168,85,247,.35)",
    background: "rgba(168,85,247,.22)",
    color: "#fff",
    cursor: "pointer",
    transition: "transform .06s ease, background .15s ease",
    fontWeight: 800,
  },

  addIcon: { width: 16, height: 16 },

  empty: {
    textAlign: "center",
    padding: "70px 10px",
    color: "rgba(216,180,254,.92)",
  },

  emptyIcon: {
    width: 84,
    height: 84,
    margin: "0 auto 10px",
    display: "block",
    color: "rgba(192,132,252,.42)",
  },

  emptyText: { margin: 0, fontSize: 16 },
  

  // responsive via JS: apply on window width with CSS media normally,
  // but keeping it simple (no logic change): use CSS grid change below in CSS suggestion.
};
