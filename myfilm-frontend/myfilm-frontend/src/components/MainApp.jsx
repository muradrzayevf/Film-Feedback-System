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
                <p>{film.rating ? `Rating: ${film.rating}` : "No rating"}</p>
                <p>{film.overview ? `Overview: ${film.overview}` : "N/A"}</p>
          

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
    background: "#0b1220", // solid dark
    color: "#e5e7eb",
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: "rgba(11,18,32,.85)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(148,163,184,.16)",
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
    width: 30,
    height: 30,
    color: "#93c5fd",
    flex: "0 0 auto",
  },

  brandTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: ".2px",
    whiteSpace: "nowrap",
    color: "#f1f5f9",
  },

  // LOGOUT
  logoutBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,.22)",
    background: "rgba(2,6,23,.35)",
    color: "#e5e7eb",
    cursor: "pointer",
    userSelect: "none",
    transition: "transform .08s ease, background .15s ease, border-color .15s ease",
  },
  logoutBtnHover: {
    background: "rgba(2,6,23,.55)",
    borderColor: "rgba(148,163,184,.32)",
  },
  logoutBtnActive: { transform: "scale(0.98)" },
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
    color: "rgba(148,163,184,.9)",
    pointerEvents: "none",
  },

  searchInput: {
    width: "100%",
    padding: "14px 14px 14px 44px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(2,6,23,.55)",
    color: "#e5e7eb",
    outline: "none",
    fontSize: 15,
    transition: "border-color .15s ease, box-shadow .15s ease, background .15s ease",
  },
  searchInputHover: {
    borderColor: "rgba(148,163,184,.30)",
    background: "rgba(2,6,23,.70)",
  },
  searchInputFocus: {
    borderColor: "#60a5fa",
    boxShadow: "0 0 0 2px rgba(96,165,250,.25)",
    background: "rgba(2,6,23,.75)",
  },

  // SEARCH BUTTON (no gradient)
  searchBtn: {
    flex: "0 0 auto",
    padding: "14px 18px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.22)",
    background: "#111827",
    color: "#f8fafc",
    fontWeight: 800,
    cursor: "pointer",
    transition: "transform .08s ease, background .15s ease, border-color .15s ease",
    minWidth: 140,
  },
  searchBtnHover: {
    background: "#0b1220",
    borderColor: "rgba(148,163,184,.35)",
  },
  searchBtnActive: { transform: "scale(0.98)" },
  searchBtnDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  errorBox: {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(239,68,68,.35)",
    background: "rgba(239,68,68,.12)",
    color: "#fecaca",
    fontSize: 13,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    gap: 14,
  },

  card: {
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,.16)",
    background: "rgba(2,6,23,.45)",
    padding: 16,
    boxShadow: "0 10px 22px rgba(0,0,0,.25)",
    transition: "transform .10s ease, border-color .15s ease, background .15s ease",
  },
  cardHover: {
    transform: "translateY(-2px)",
    borderColor: "rgba(148,163,184,.28)",
    background: "rgba(2,6,23,.60)",
  },

  cardTitle: {
    margin: "0 0 6px",
    fontSize: 18,
    fontWeight: 800,
    color: "#f1f5f9",
  },

  cardSub: {
    margin: 0,
    color: "rgba(148,163,184,.95)",
    fontSize: 13,
  },

  // ADD BUTTON (no gradient)
  addBtn: {
    marginTop: 14,
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,.22)",
    background: "#111827",
    color: "#f8fafc",
    cursor: "pointer",
    transition: "transform .08s ease, background .15s ease, border-color .15s ease",
    fontWeight: 800,
  },
  addBtnHover: {
    background: "#0b1220",
    borderColor: "rgba(148,163,184,.35)",
  },
  addBtnActive: { transform: "scale(0.98)" },

  addIcon: { width: 16, height: 16 },

  empty: {
    textAlign: "center",
    padding: "70px 10px",
    color: "rgba(148,163,184,.95)",
  },

  emptyIcon: {
    width: 84,
    height: 84,
    margin: "0 auto 10px",
    display: "block",
    color: "rgba(148,163,184,.35)",
  },

  emptyText: { margin: 0, fontSize: 16 },
};
