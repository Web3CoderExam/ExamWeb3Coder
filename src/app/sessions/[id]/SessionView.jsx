"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ThumbsUp } from "lucide-react";
import useFavorites from "@/hooks/useFavorites";
import styles from "./SessionPage.module.css";

function mergeQuestions(defaultQuestions, savedQuestions) {
  return [...defaultQuestions, ...savedQuestions].reduce((list, question) => {
    const alreadyExists = list.find((item) => item.id === question.id);
    if (!alreadyExists) list.push(question);
    return list;
  }, []);
}

export default function SessionView({ event, session, speakers, defaultFavorites }) {
  const [questions, setQuestions] = useState([]);
  const [loadedSessionId, setLoadedSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [tab, setTab] = useState("popular");
  const [now, setNow] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites(defaultFavorites);
  const startDate = event.startDate || event.date;

  const sessionSpeakers = speakers.filter((speaker) => {
    return session.speakerId === speaker.id;
  });

  const favorite = isFavorite(session.id);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isLive = useMemo(() => {
    if (!now) return false;

    const nowDate = new Date(now);
    const start = new Date(`${startDate}T${session.time}`);
    const end = new Date(start.getTime() + session.duration * 60 * 60 * 1000);

    return nowDate >= start && nowDate <= end;
  }, [now, session, startDate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const savedQuestions = JSON.parse(
        localStorage.getItem("questions-" + session.id) || "[]"
      );

      const defaultQuestions = session.questions || [];
      const mergedQuestions = mergeQuestions(defaultQuestions, savedQuestions);

      setQuestions(mergedQuestions);
      setLoadedSessionId(session.id);
    }, 0);

    return () => clearTimeout(timeout);
  }, [session]);

  useEffect(() => {
    if (loadedSessionId !== session.id) return;

    localStorage.setItem("questions-" + session.id, JSON.stringify(questions));
  }, [loadedSessionId, questions, session.id]);

  const addQuestion = () => {
    if (!input.trim()) return;

    const newQuestion = {
      id: Date.now(),
      content: input,
      author: name || "Anonyme",
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };

    setQuestions((previousQuestions) => [newQuestion, ...previousQuestions]);
    setInput("");
    setName("");
  };

  const upvote = (id) => {
    setQuestions((previousQuestions) => {
      return previousQuestions.map((question) => {
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
            <span>{session.room}</span>
            <span>{session.capacity} places</span>
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
        <div className={styles.leftColumn}>
          <div className={styles.card}>
            <h2>Description</h2>
            <p className={styles.description}>{session.description}</p>
          </div>

          <div className={styles.card}>
            <h2>Intervenant</h2>

            {sessionSpeakers.map((speaker) => (
              <Link
                key={speaker.id}
                href={`/speakers/${speaker.id}`}
                className={styles.speaker}
              >
                <img src={speaker.avatar} alt={speaker.name} />
                <div>
                  <strong>{speaker.name}</strong>
                  <span>{speaker.role}</span>
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

          {isLive ? (
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
                <button
                  className={tab === "popular" ? styles.active : ""}
                  onClick={() => setTab("popular")}
                >
                  Populaires
                </button>

                <button
                  className={tab === "recent" ? styles.active : ""}
                  onClick={() => setTab("recent")}
                >
                  Récentes
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
              Les questions seront disponibles pendant le live.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
