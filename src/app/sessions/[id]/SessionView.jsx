"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ThumbsUp } from "lucide-react";
import useFavorites from "@/hooks/useFavorites";
import styles from "./SessionPage.module.css";

function getSessionTimeRange(session) {
  const start = session.startTime ? new Date(session.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
  const end = session.endTime ? new Date(session.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
  return end ? `${start} - ${end}` : start;
}

function getDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMinutes = Math.round((end - start) / (1000 * 60));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

export default function SessionView({ event, session, defaultFavorites }) {
  const router = useRouter();
  const [questions, setQuestions] = useState(session.questions || []);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [tab, setTab] = useState("popular");
  const [now, setNow] = useState(new Date());
  const { isFavorite, toggleFavorite } = useFavorites(defaultFavorites);
  const favorite = isFavorite(session.id);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isLive = () => {
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    return now >= start && now <= end;
  };

  const addQuestion = async () => {
    if (!input.trim()) return;
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: session.id,
        content: input,
        author: name.trim() || null,
      }),
    });
    const result = await response.json();
    if (result.success) {
      setQuestions((prev) => [result.data, ...prev]);
      setInput("");
      setName("");
      router.refresh();
    }
  };

  const upvote = async (id) => {
    const response = await fetch(`/api/questions/${id}`, { method: "PUT" });
    const result = await response.json();
    if (result.success) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? result.data : q))
      );
      router.refresh();
    }
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    if (tab === "popular") return b.upvotes - a.upvotes;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.badge}>Session</span>
          <h1>{session.title}</h1>
          <div className={styles.meta}>
            <span>{getSessionTimeRange(session)}</span>
            <span>{session.room?.name || session.room}</span>
            <span>{session.capacity} places</span>
          </div>
        </div>
        {isLive() && (
          <div className={styles.live}>
            <span className={styles.dot}></span> LIVE
          </div>
        )}
      </div>

      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <div className={styles.card}>
            <h2>Description</h2>
            <p className={styles.description}>{session.description}</p>
          </div>
          <div className={styles.card}>
            <h2>Intervenants</h2>
            {session.speakers?.map((speaker) => (
              <Link key={speaker.id} href={`/speakers/${speaker.id}`} className={styles.speaker}>
                <Image
                  src={speaker.photo || "/default-avatar.png"}
                  alt={speaker.name}
                  width={48}
                  height={48}
                />
                <div>
                  <strong>{speaker.name}</strong>
                  <span>{speaker.bio || "Intervenant"}</span>
                </div>
              </Link>
            ))}
          </div>
          <button
            type="button"
            className={favorite ? styles.favoriteActive : styles.favorite}
            onClick={() => toggleFavorite(session.id)}
          >
            {favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          </button>
        </div>

        <div className={styles.card}>
          <h2>Live Q&A ({questions.length})</h2>
          {isLive() ? (
            <>
              <div className={styles.inputBox}>
                <input
                  className={styles.input}
                  placeholder="Pose ta question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <input
                  className={styles.input}
                  placeholder="Nom (optionnel)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button className={styles.button} onClick={addQuestion}>
                  Envoyer
                </button>
              </div>
              <div className={styles.tabs}>
                <button className={tab === "popular" ? styles.active : ""} onClick={() => setTab("popular")}>
                  Populaires
                </button>
                <button className={tab === "recent" ? styles.active : ""} onClick={() => setTab("recent")}>
                  Récentes
                </button>
              </div>
              <div className={styles.list}>
                {sortedQuestions.length === 0 && <p className={styles.empty}>Aucune question pour le moment</p>}
                {sortedQuestions.map((question) => (
                  <div key={question.id} className={styles.question}>
                    <div>
                      <strong>{question.author || "Anonyme"}</strong>
                      <p>{question.content}</p>
                    </div>
                    <button className={styles.vote} onClick={() => upvote(question.id)}>
                      <ThumbsUp size={14} /> {question.upvotes}
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className={styles.offline}>Les questions seront disponibles pendant le live.</p>
          )}
        </div>
      </div>
    </div>
  );
}