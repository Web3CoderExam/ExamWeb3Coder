"use client";

import { useEffect, useMemo, useState } from "react";
<<<<<<< HEAD
=======
import Link from "next/link";
>>>>>>> 42f4429e0c79a5cd7bb243449f4fcf600ba2d8e4
import { ThumbsUp } from "lucide-react";
import useFavorites from "@/hooks/useFavorites";
import styles from "./SessionPage.module.css";

<<<<<<< HEAD
export default function SessionView({ event, session, speakers = [] }) {
=======
function mergeQuestions(defaultQuestions, savedQuestions) {
  return [...defaultQuestions, ...savedQuestions].reduce((list, question) => {
    const alreadyExists = list.find((item) => item.id === question.id);
    if (!alreadyExists) list.push(question);
    return list;
  }, []);
}

export default function SessionView({ event, session, speakers, defaultFavorites }) {
>>>>>>> 42f4429e0c79a5cd7bb243449f4fcf600ba2d8e4
  const [questions, setQuestions] = useState([]);
  const [loadedSessionId, setLoadedSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [tab, setTab] = useState("popular");
<<<<<<< HEAD
  const [now, setNow] = useState(Date.now());
  const { isFavorite, toggleFavorite } = useFavorites(event.id);

  const speaker = speakers.find((item) => item.id === session.speakerId);
  const speakerName = speaker?.name || session.speaker || "Intervenant";
  const room = session.room || "Salle principale";
  const capacity = session.capacity || "Non precisee";
  const duration = session.duration || 1;
=======
  const [now, setNow] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites(defaultFavorites);
  const startDate = event.startDate || event.date;

  const sessionSpeakers = speakers.filter((speaker) => {
    return session.speakerId === speaker.id;
  });

>>>>>>> 42f4429e0c79a5cd7bb243449f4fcf600ba2d8e4
  const favorite = isFavorite(session.id);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isLive = useMemo(() => {
    if (!now) return false;

    const nowDate = new Date(now);
<<<<<<< HEAD
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

=======
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

>>>>>>> 42f4429e0c79a5cd7bb243449f4fcf600ba2d8e4
  const addQuestion = () => {
    if (!input.trim()) return;

    const newQuestion = {
      id: Date.now(),
      content: input,
      author: name || "Anonyme",
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };

<<<<<<< HEAD
    setQuestions((currentQuestions) => [newQuestion, ...currentQuestions]);
=======
    setQuestions((previousQuestions) => [newQuestion, ...previousQuestions]);
>>>>>>> 42f4429e0c79a5cd7bb243449f4fcf600ba2d8e4
    setInput("");
    setName("");
  };

  const upvote = (id) => {
<<<<<<< HEAD
    setQuestions((currentQuestions) => {
      return currentQuestions.map((question) => {
=======
    setQuestions((previousQuestions) => {
      return previousQuestions.map((question) => {
>>>>>>> 42f4429e0c79a5cd7bb243449f4fcf600ba2d8e4
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
<<<<<<< HEAD
            <span>-</span>
            <span>{room}</span>
            <span>-</span>
            <span>{capacity} places</span>
=======
            <span>{session.room}</span>
            <span>{session.capacity} places</span>
>>>>>>> 42f4429e0c79a5cd7bb243449f4fcf600ba2d8e4
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 42f4429e0c79a5cd7bb243449f4fcf600ba2d8e4
          </div>

          <button
            type="button"
<<<<<<< HEAD
            className={styles.favorite}
=======
            className={favorite ? styles.favoriteActive : styles.favorite}
>>>>>>> 42f4429e0c79a5cd7bb243449f4fcf600ba2d8e4
            onClick={() => toggleFavorite(session.id)}
          >
            {favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          </button>
        </div>

        <div className={styles.card}>
<<<<<<< HEAD
          <h3 style={{ marginBottom: 16 }}>Live Q&A ({questions.length})</h3>
=======
          <h2>Live Q&A ({questions.length})</h2>
>>>>>>> 42f4429e0c79a5cd7bb243449f4fcf600ba2d8e4

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
<<<<<<< HEAD
                  Recentes
=======
                  Récentes
>>>>>>> 42f4429e0c79a5cd7bb243449f4fcf600ba2d8e4
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
<<<<<<< HEAD
              Les questions seront disponibles pendant le live
=======
              Les questions seront disponibles pendant le live.
>>>>>>> 42f4429e0c79a5cd7bb243449f4fcf600ba2d8e4
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
