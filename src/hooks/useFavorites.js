"use client";

import { useEffect, useState } from "react";

function normalizeFavorites(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "object") return item.sessionId;
        return item;
      })
      .filter(Boolean);
  }

  if (value && typeof value === "object") {
    return Object.values(value)
      .flat()
      .map((item) => {
        if (typeof item === "object") return item.sessionId;
        return item;
      })
      .filter(Boolean);
  }

  return [];
}

export default function useFavorites(defaultFavorites = []) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const savedFavorites = localStorage.getItem("favs");

      if (savedFavorites) {
        const cleanFavorites = normalizeFavorites(JSON.parse(savedFavorites));
        localStorage.setItem("favs", JSON.stringify(cleanFavorites));
        setFavorites(cleanFavorites);
        return;
      }

      localStorage.setItem("favs", JSON.stringify(defaultFavorites));
      setFavorites(defaultFavorites);
    }, 0);

    return () => clearTimeout(timeout);
  }, [defaultFavorites]);

  const saveFavorites = (newFavorites) => {
    localStorage.setItem("favs", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
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
