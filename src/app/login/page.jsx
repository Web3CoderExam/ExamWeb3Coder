"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Identifiants incorrects.");
        return;
      }

      router.push("/admin");
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-bg" aria-hidden="true">
        <div className="login-bg-grid" />
        <div className="login-bg-accent" />
      </div>

      <main className="login-main">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#6366f1" />
              <path
                d="M8 16h10M14 10l6 6-6 6"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="login-brand-name">EventSync</span>
        </div>

        {/* Card */}
        <div className="login-card">
          <div className="login-card-header">
            <h1 className="login-title">Espace organisateur</h1>
            <p className="login-subtitle">
              Connectez-vous pour gérer vos événements
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Email */}
            <div className="login-field">
              <label htmlFor="email" className="login-label">
                Adresse e-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="login-input"
                placeholder="vous@exemple.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="login-field">
              <label htmlFor="password" className="login-label">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="login-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="login-error" role="alert">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="login-submit"
              disabled={loading || !formData.email || !formData.password}
            >
              {loading ? (
                <span className="login-spinner" aria-label="Chargement…" />
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>

        <p className="login-footer">
          Accès réservé aux organisateurs.{" "}
          <a href="/" className="login-footer-link">
            Retour à l'accueil
          </a>
        </p>
      </main>

      <style>{`
        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Geist', 'Inter', system-ui, sans-serif;
          position: relative;
          overflow: hidden;
          background: #0a0a0f;
        }
        .login-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .login-bg-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .login-bg-accent {
          position: absolute; top: -200px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
        }
        .login-main {
          position: relative; z-index: 1;
          width: 100%; max-width: 400px; padding: 2rem 1rem;
          display: flex; flex-direction: column; align-items: center; gap: 2rem;
        }
        .login-brand { display: flex; align-items: center; gap: 10px; }
        .login-brand-name { font-size: 1.25rem; font-weight: 600; color: #fff; letter-spacing: -0.02em; }
        .login-card {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 2rem;
          backdrop-filter: blur(12px);
        }
        .login-card-header { margin-bottom: 1.75rem; }
        .login-title { font-size: 1.375rem; font-weight: 600; color: #fff; letter-spacing: -0.02em; margin: 0 0 6px; }
        .login-subtitle { font-size: 0.875rem; color: rgba(255,255,255,0.45); margin: 0; }
        .login-form { display: flex; flex-direction: column; gap: 1.125rem; }
        .login-field { display: flex; flex-direction: column; gap: 6px; }
        .login-label { font-size: 0.8125rem; font-weight: 500; color: rgba(255,255,255,0.6); }
        .login-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; padding: 0 12px; height: 42px;
          font-size: 0.9375rem; color: #fff; width: 100%; box-sizing: border-box;
          transition: border-color 0.15s, background 0.15s; outline: none; font-family: inherit;
        }
        .login-input::placeholder { color: rgba(255,255,255,0.2); }
        .login-input:focus { border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.06); }
        .login-input:disabled { opacity: 0.5; cursor: not-allowed; }
        .login-error {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.8125rem; color: #f87171;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 8px; padding: 10px 12px;
        }
        .login-submit {
          margin-top: 4px; height: 44px; background: #6366f1;
          color: white; border: none; border-radius: 8px;
          font-size: 0.9375rem; font-weight: 500; cursor: pointer;
          width: 100%; font-family: inherit; letter-spacing: -0.01em;
          transition: background 0.15s, transform 0.1s, opacity 0.15s;
          display: flex; align-items: center; justify-content: center;
        }
        .login-submit:hover:not(:disabled) { background: #4f46e5; }
        .login-submit:active:not(:disabled) { transform: scale(0.99); }
        .login-submit:disabled { opacity: 0.45; cursor: not-allowed; }
        .login-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-footer { font-size: 0.8125rem; color: rgba(255,255,255,0.3); text-align: center; margin: 0; }
        .login-footer-link { color: rgba(99,102,241,0.8); text-decoration: none; }
        .login-footer-link:hover { color: #6366f1; }
        @media (max-width: 480px) { .login-card { padding: 1.5rem; } }
      `}</style>
    </div>
  );
}