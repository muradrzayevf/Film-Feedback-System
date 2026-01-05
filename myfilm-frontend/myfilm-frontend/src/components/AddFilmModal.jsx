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
        media_type: film.media_type,
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
    background: "rgba(2,6,23,.75)",
    backdropFilter: "blur(6px)",
  },

  modal: {
    width: "100%",
    maxWidth: 520,
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,.18)",
    background: "#0b1220",
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
    borderBottom: "1px solid rgba(148,163,184,.16)",
    marginBottom: 14,
  },

  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: ".2px",
    color: "#f1f5f9",
  },

  subtitle: {
    margin: "6px 0 0",
    fontSize: 13,
    color: "#94a3b8",
  },

  stack: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  // CHECKBOX
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
    color: "#e5e7eb",
    userSelect: "none",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(2,6,23,.55)",
    transition: "background .15s ease, border-color .15s ease",
  },

  checkLabelHover: {
    background: "rgba(2,6,23,.75)",
    borderColor: "rgba(148,163,184,.30)",
  },

  checkbox: {
    width: 18,
    height: 18,
    accentColor: "#60a5fa",
    cursor: "pointer",
  },

  // LABELS
  fieldLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 700,
    color: "#cbd5f5",
  },

  fieldLabelPlain: {
    display: "block",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 700,
    color: "#cbd5f5",
  },

  // INPUT
  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(2,6,23,.55)",
    color: "#e5e7eb",
    outline: "none",
    fontSize: 14,
    transition: "border-color .15s ease, box-shadow .15s ease, background .15s ease",
  },

  inputHover: {
    background: "rgba(2,6,23,.70)",
    borderColor: "rgba(148,163,184,.30)",
  },

  inputFocus: {
    background: "rgba(2,6,23,.75)",
    borderColor: "#60a5fa",
    boxShadow: "0 0 0 2px rgba(96,165,250,.25)",
  },

  textarea: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,.18)",
    background: "rgba(2,6,23,.55)",
    color: "#e5e7eb",
    outline: "none",
    fontSize: 14,
    resize: "none",
    transition: "border-color .15s ease, box-shadow .15s ease, background .15s ease",
  },

  textareaFocus: {
    background: "rgba(2,6,23,.75)",
    borderColor: "#60a5fa",
    boxShadow: "0 0 0 2px rgba(96,165,250,.25)",
  },

  actions: {
    display: "flex",
    gap: 10,
    marginTop: 6,
  },

  // BUTTONS
  btnSecondary: {
    flex: 1,
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,.22)",
    background: "#111827",
    color: "#f8fafc",
    cursor: "pointer",
    fontWeight: 700,
    transition: "background .15s ease, border-color .15s ease, transform .08s ease",
  },

  btnSecondaryHover: {
    background: "#0b1220",
    borderColor: "rgba(148,163,184,.35)",
  },

  btnPrimary: {
    flex: 1,
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,.22)",
    background: "#1f2937",
    color: "#f9fafb",
    cursor: "pointer",
    fontWeight: 800,
    transition: "background .15s ease, border-color .15s ease, transform .08s ease",
  },

  btnPrimaryHover: {
    background: "#0b1220",
    borderColor: "rgba(148,163,184,.35)",
  },

  btnPrimaryActive: {
    transform: "scale(0.98)",
  },

  btnPrimaryDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  errorBox: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(239,68,68,.35)",
    background: "rgba(239,68,68,.12)",
    color: "#fecaca",
    fontSize: 13,
  },

  hint: {
    marginTop: 4,
    fontSize: 12,
    color: "#94a3b8",
  },

  icon16: { width: 16, height: 16 },
  icon20: { width: 20, height: 20 },
};
