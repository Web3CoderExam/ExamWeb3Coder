"use client";
import { useEffect, useState } from "react";

export default function useFavorites(eventId) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favs") || "{}");
    setFavorites(favs[eventId] || []);
  }, [eventId]);

  const save = (data) => {
    const favs = JSON.parse(localStorage.getItem("favs") || "{}");
    favs[eventId] = data;
    localStorage.setItem("favs", JSON.stringify(favs));
    setFavorites(data);
  };

  const isFavorite = (sessionId) => {
    return favorites.some(f => f.sessionId === sessionId);
  };

  const toggleFavorite = (sessionId) => {
    if (isFavorite(sessionId)) {
      save(favorites.filter(f => f.sessionId !== sessionId));
    } else {
      save([
        ...favorites,
        {
          sessionId,
          addedAt: new Date().toISOString(),
        },
      ]);
    }
  };

  return { favorites, isFavorite, toggleFavorite };
}