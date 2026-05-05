"use client";

import { useEffect, useMemo, useState } from "react";
import { ThumbsUp } from "lucide-react";
import useFavorites from "@/hooks/useFavorites";
import styles from "./SessionPage.module.css";

export default function SessionView({ event, session, speakers = [] }) {
  const [questions, setQuestions] = useState([]);
  const [loadedSessionId, setLoadedSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [tab, setTab] = useState("popular");
  const [now, setNow] = useState(Date.now());
  const { isFavorite, toggleFavorite } = useFavorites(event.id);

  const speaker = speakers.find((item) => item.id === session.speakerId);
  const speakerName = speaker?.name || session.speaker || "Intervenant";
  const room = session.room || "Salle principale";
  const capacity = session.capacity || "Non precisee";
  const duration = session.duration || 1;
  const favorite = isFavorite(session.id);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isLive = useMemo(() => {
    if (!now) return false;

    const nowDate = new Date(now);
    const start = new Date(`${event.date}T${session.time}`);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    return nowDate >= start && nowDate <= end;
  }, [duration, event.date, now, session.time]);

  useEffect(() => {
    const savedQuestions = JSON.parse(
      localStorage.getItem("questions-" + session.id) || "[]"
    );

    setQuestions([...(session.questions || []), ...savedQuestions]);
  }, [session]);

  useEffect(() => {
    localStorage.setItem("questions-" + session.id, JSON.stringify(questions));
  }, [questions, session.id]);

  const addQuestion = () => {
    if (!input.trim()) return;

    const newQuestion = {
      id: Date.now(),
      content: input,
      author: name || "Anonyme",
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };

    setQuestions((currentQuestions) => [newQuestion, ...currentQuestions]);
    setInput("");
    setName("");
  };

  const upvote = (id) => {
    setQuestions((currentQuestions) => {
      return currentQuestions.map((question) => {
        if (question.id === id) {
          return { ...question, upvotes: question.upvotes + 1 };
        }

        return question;
      });
    });
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
            <span>{session.time}</span>
            <span>-</span>
            <span>{room}</span>
            <span>-</span>
            <span>{capacity} places</span>
          </div>
        </div>

        {isLive && (
          <div className={styles.live}>
            <span className={styles.dot}></span>
            LIVE
          </div>
        )}
      </div>

      <div className={styles.grid}>
        <div>
          <div className={styles.card}>
            <p className={styles.description}>
              {session.description || event.description}
            </p>
          </div>

          <div className={styles.card}>
            <h3>Intervenant</h3>
            <div className={styles.speaker}>
              {speaker?.avatar && <img src={speaker.avatar} alt={speakerName} />}
              <div>
                <strong>{speakerName}</strong>
                <span>{speaker?.role || "Intervenant"}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className={styles.favorite}
            onClick={() => toggleFavorite(session.id)}
          >
            {favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          </button>
        </div>

        <div className={styles.card}>
          <h3 style={{ marginBottom: 16 }}>Live Q&A ({questions.length})</h3>

          {isLive ? (
            <>
              <div className={styles.inputBox}>
                <input
                  className={styles.input}
                  placeholder="Pose ta question..."
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                />

                <input
                  className={styles.input}
                  placeholder="Nom (optionnel)"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />

                <button type="button" className={styles.button} onClick={addQuestion}>
                  Envoyer
                </button>
              </div>

              <div className={styles.tabs}>
                <button
                  type="button"
                  className={tab === "popular" ? styles.active : ""}
                  onClick={() => setTab("popular")}
                >
                  Populaires
                </button>

                <button
                  type="button"
                  className={tab === "recent" ? styles.active : ""}
                  onClick={() => setTab("recent")}
                >
                  Recentes
                </button>
              </div>

              <div className={styles.list}>
                {sortedQuestions.length === 0 && (
                  <p className={styles.empty}>Aucune question pour le moment</p>
                )}

                {sortedQuestions.map((question) => (
                  <div key={question.id} className={styles.question}>
                    <div>
                      <strong>{question.author || "Anonyme"}</strong>
                      <p>{question.content}</p>
                    </div>

                    <button
                      type="button"
                      className={styles.vote}
                      onClick={() => upvote(question.id)}
                    >
                      <ThumbsUp size={14} />
                      {question.upvotes}
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className={styles.offline}>
              Les questions seront disponibles pendant le live
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
