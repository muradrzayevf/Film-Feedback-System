import React, { useState, useEffect } from "react";
import { Film } from "lucide-react";
import { api } from "./services/api";
import AuthPage from "./components/AuthPage";
import MainApp from "./components/MainApp";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [page, setPage] = useState("search"); // ✅ YENİ: "search" | "dashboard"

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await api.auth.check();
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
    setIsAuthenticated(false);
    setPage("search"); // ✅ logout olanda geri qaytar
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Film className="w-16 h-16 text-purple-400 animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage onAuth={() => { setIsAuthenticated(true); setPage("search"); }} />;
  }

  // ✅ Auth olunubsa, page-ə görə render
  return page === "dashboard" ? (
    <Dashboard onBack={() => setPage("search")} />
  ) : (
    <MainApp onLogout={handleLogout} onOpenDashboard={() => setPage("dashboard")} />
  );
}
