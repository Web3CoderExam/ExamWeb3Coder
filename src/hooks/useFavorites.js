"use client";

import { useEffect, useState } from "react";

function normalizeFavorites(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item && typeof item === "object") return item.sessionId;
        return item;
      })
      .filter(Boolean);
  }

  if (value && typeof value === "object") {
    return Object.values(value)
      .flat()
      .map((item) => {
        if (item && typeof item === "object") return item.sessionId;
        return item;
      })
      .filter(Boolean);
  }

  return [];
}

function readSavedFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favs") || "null");
  } catch {
    return null;
  }
}

export default function useFavorites(defaultFavorites = []) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedFavorites = readSavedFavorites();

      if (savedFavorites) {
        const cleanFavorites = normalizeFavorites(savedFavorites);
        localStorage.setItem("favs", JSON.stringify(cleanFavorites));
        setFavorites(cleanFavorites);
        return;
      }

      localStorage.setItem("favs", JSON.stringify(defaultFavorites));
      setFavorites(defaultFavorites);
    }, 0);

    return () => clearTimeout(timer);
  }, [defaultFavorites]);

  const saveFavorites = (newFavorites) => {
    const cleanFavorites = [...new Set(newFavorites)];

    localStorage.setItem("favs", JSON.stringify(cleanFavorites));
    setFavorites(cleanFavorites);
  };

  const isFavorite = (sessionId) => {
    return favorites.includes(sessionId);
  };

  const toggleFavorite = (sessionId) => {
    if (isFavorite(sessionId)) {
      saveFavorites(favorites.filter((id) => id !== sessionId));
    } else {
      saveFavorites([...favorites, sessionId]);
    }
  };

  return { favorites, isFavorite, toggleFavorite };
}
