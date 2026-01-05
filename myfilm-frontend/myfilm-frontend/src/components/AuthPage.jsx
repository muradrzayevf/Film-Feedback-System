import React, { useState } from "react";
import { api } from "../services/api";

export default function AuthPage({ onAuthed }) {
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await api.auth.login({ username: form.username, password: form.password });
      } else {
        await api.auth.register(form);
      }
      
      
    } catch (err) {
      setError(err.message || "Auth error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={ui.container}>
      <div style={ui.card}>
        <h1 style={ui.h1}>MyFilm</h1>
        <p style={ui.sub}>{mode === "login" ? "Login" : "Register"}</p>

        <form onSubmit={handleSubmit} style={ui.form}>
          <label style={ui.label}>Username</label>
          <input
            style={ui.input}
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />

          {mode === "register" && (
            <>
              <label style={ui.label}>Email</label>
              <input
                style={ui.input}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </>
          )}

          <label style={ui.label}>Password</label>
          <input
            style={ui.input}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />

          {error && <div style={ui.error}>{error}</div>}

          <button style={ui.btn} disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <button
          type="button"
          style={ui.linkBtn}
          onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}
        >
          {mode === "login" ? "No account? Register" : "Have account? Login"}
        </button>
      </div>
    </div>
  );
}

const ui = {
  container: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 16,
    background: "#0f172a",
  },

  card: {
    width: "100%",
    maxWidth: 420,
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: 14,
    padding: 20,
    color: "#e5e7eb",
    boxShadow: "0 10px 30px rgba(0,0,0,.35)",
  },

  h1: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: "-0.3px",
  },

  sub: {
    margin: "6px 0 18px",
    fontSize: 14,
    color: "#9ca3af",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  label: {
    fontSize: 13,
    color: "#cbd5f5",
  },

  input: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },

  inputFocus: {
    borderColor: "#60a5fa",
    boxShadow: "0 0 0 2px rgba(96,165,250,.25)",
  },

  btn: {
    marginTop: 10,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#1f2937",
    color: "#f9fafb",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  btnHover: {
    background: "#334155",
    borderColor: "#475569",
  },

  btnActive: {
    background: "#020617",
    transform: "scale(0.98)",
  },

  linkBtn: {
    marginTop: 14,
    width: "100%",
    background: "transparent",
    border: 0,
    color: "#93c5fd",
    cursor: "pointer",
    fontSize: 14,
    textDecoration: "underline",
    transition: "color 0.2s ease",
  },

  linkBtnHover: {
    color: "#bfdbfe",
  },
};
