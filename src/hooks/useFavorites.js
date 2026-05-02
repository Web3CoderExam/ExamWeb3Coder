"use client";

import { useEffect, useState } from "react";

export default function useFavorites(defaultFavorites = []) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const savedFavorites = localStorage.getItem("favs");

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
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
