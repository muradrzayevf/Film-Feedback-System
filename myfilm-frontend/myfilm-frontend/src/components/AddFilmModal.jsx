import React, { useState } from "react";
import { Star, Calendar, Eye } from "lucide-react";
import { api } from "../services/api";

export default function AddFilmModal({ film, onClose, onSuccess }) {
  const [form, setForm] = useState({
    rating: "",
    notes: "",
    watched: false,
    watchedAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      await api.films.add({
        tmdbID: film.tmdbID,
        rating: form.rating ? parseFloat(form.rating) : undefined,
        notes: form.notes,
        watched: form.watched,
        watchedAt: form.watchedAt || undefined,
      });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onMouseDown={onClose}>
      <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div style={styles.inner}>
          <div style={styles.header}>
            <div>
              <h2 style={styles.title}>{film.title}</h2>
              <p style={styles.subtitle}>
                {film.release_date ? new Date(film.release_date).getFullYear() : "N/A"}
              </p>
            </div>
          </div>

          <div style={styles.stack}>
            <label style={styles.checkLabel}>
              <input
                type="checkbox"
                checked={form.watched}
                onChange={(e) => setForm({ ...form, watched: e.target.checked })}
                style={styles.checkbox}
              />
              <Eye style={styles.icon20} />
              I've watched this
            </label>

            {form.watched && (
              <div>
                <label style={styles.fieldLabel}>
                  <Calendar style={styles.icon16} />
                  When did you watch it?
                </label>
                <input
                  type="date"
                  value={form.watchedAt}
                  onChange={(e) => setForm({ ...form, watchedAt: e.target.value })}
                  style={styles.input}
                />
              </div>
            )}

            <div>
              <label style={styles.fieldLabel}>
                <Star style={styles.icon16} />
                Rating (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                style={styles.input}
                placeholder="Optional"
              />
            </div>

            <div>
              <label style={styles.fieldLabelPlain}>Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={4}
                style={styles.textarea}
                placeholder="Your thoughts about this film..."
              />
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.actions}>
              <button type="button" onClick={onClose} style={styles.btnSecondary}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  ...styles.btnPrimary,
                  ...(loading ? styles.btnPrimaryDisabled : null),
                }}
              >
                {loading ? "Adding..." : "Add Film"}
              </button>
            </div>

            <div style={styles.hint}>
              Tip: Modal-ı bağlamaq üçün çöl hissəyə click edə bilərsən.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,.70)",
    backdropFilter: "blur(6px)",
  },

  modal: {
    width: "100%",
    maxWidth: 520,
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,.16)",
    background:
      "radial-gradient(900px 420px at 20% 20%, rgba(168,85,247,.22), rgba(15,23,42,0) 55%), rgba(7,12,24,.92)",
    boxShadow: "0 30px 70px rgba(0,0,0,.45)",
  },

  inner: {
    padding: 18,
  },

  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    padding: "4px 4px 14px",
    borderBottom: "1px solid rgba(255,255,255,.10)",
    marginBottom: 14,
  },

  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: ".2px",
    color: "#fff",
  },

  subtitle: {
    margin: "6px 0 0",
    fontSize: 13,
    color: "rgba(216,180,254,.9)",
  },

  stack: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
    color: "rgba(216,180,254,.95)",
    userSelect: "none",
    padding: "10px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.06)",
  },

  checkbox: {
    width: 18,
    height: 18,
    accentColor: "#a855f7",
    cursor: "pointer",
  },

  fieldLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(216,180,254,.95)",
  },

  fieldLabelPlain: {
    display: "block",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(216,180,254,.95)",
  },

  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.16)",
    background: "rgba(255,255,255,.08)",
    color: "#fff",
    outline: "none",
    fontSize: 14,
  },

  textarea: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.16)",
    background: "rgba(255,255,255,.08)",
    color: "#fff",
    outline: "none",
    fontSize: 14,
    resize: "none",
  },

  actions: {
    display: "flex",
    gap: 10,
    marginTop: 6,
  },

  btnSecondary: {
    flex: 1,
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.16)",
    background: "rgba(255,255,255,.08)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },

  btnPrimary: {
    flex: 1,
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(168,85,247,.35)",
    background: "linear-gradient(135deg, rgba(168,85,247,.95), rgba(99,102,241,.85))",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 900,
  },

  btnPrimaryDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
    filter: "saturate(.7)",
  },

  errorBox: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(239,68,68,.45)",
    background: "rgba(239,68,68,.14)",
    color: "rgba(254,202,202,.95)",
    fontSize: 13,
  },

  hint: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255,255,255,.55)",
  },

  icon16: { width: 16, height: 16 },
  icon20: { width: 20, height: 20 },
};
