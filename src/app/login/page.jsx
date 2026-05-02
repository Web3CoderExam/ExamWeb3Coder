"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

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
    <div className={styles.loginRoot}>
      <div className={styles.loginBg} aria-hidden="true">
        <div className={styles.loginBgGrid} />
        <div className={styles.loginBgAccent} />
      </div>

      <main className={styles.loginMain}>
        {/* Brand */}
        <div className={styles.loginBrand}>
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
          <span className={styles.loginBrandName}>EventSync</span>
        </div>

        {/* Card */}
        <div className={styles.loginCard}>
          <div className={styles.loginCardHeader}>
            <h1 className={styles.loginTitle}>Espace organisateur</h1>
            <p className={styles.loginSubtitle}>
              Connectez-vous pour gérer vos événements
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm} noValidate>
            <div className={styles.loginField}>
              <label htmlFor="email" className={styles.loginLabel}>
                Adresse e-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={styles.loginInput}
                placeholder="vous@exemple.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className={styles.loginField}>
              <label htmlFor="password" className={styles.loginLabel}>
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={styles.loginInput}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {error && (
              <div className={styles.loginError} role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className={styles.loginSubmit}
              disabled={loading || !formData.email || !formData.password}
            >
              {loading ? (
                <span className={styles.loginSpinner} aria-label="Chargement…" />
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>

        <p className={styles.loginFooter}>
          Accès réservé aux organisateurs.{" "}
          <a href="/" className={styles.loginFooterLink}>
            Retour à l'accueil
          </a>
        </p>
      </main>
    </div>
  );
}