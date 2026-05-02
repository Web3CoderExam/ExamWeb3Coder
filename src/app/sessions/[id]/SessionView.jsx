"use client";

import { useEffect, useMemo, useState } from "react";
import { ThumbsUp } from "lucide-react";
import styles from "./SessionPage.module.css";

export default function SessionView({ session, speakers }) {
  const [questions, setQuestions] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [tab, setTab] = useState("popular");
  const [favorite, setFavorite] = useState(false);
  const [now, setNow] = useState(0);

  const sessionSpeakers = speakers.filter((speaker) => {
    return session.speakerId === speaker.id;
  });

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isLive = useMemo(() => {
    if (!now) return false;

    const nowDate = new Date(now);
    const [hour, minute] = session.time.split(":").map(Number);

    const start = new Date();
    start.setHours(hour, minute, 0, 0);

    const end = new Date(start);
    end.setHours(end.getHours() + session.duration);

    return nowDate >= start && nowDate <= end;
  }, [now, session]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const savedQuestions = JSON.parse(
        localStorage.getItem("questions-" + session.id) || "[]"
      );

      const defaultQuestions = session.questions || [];

      const mergedQuestions = [...defaultQuestions, ...savedQuestions].reduce(
        (list, question) => {
          const alreadyExists = list.find((item) => item.id === question.id);
          if (!alreadyExists) list.push(question);
          return list;
        },
        []
      );

      setQuestions(mergedQuestions);
    }, 0);

    return () => clearTimeout(timeout);
  }, [session]);

  useEffect(() => {
    localStorage.setItem("questions-" + session.id, JSON.stringify(questions));
  }, [questions, session.id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const favorites = JSON.parse(localStorage.getItem("favs") || "[]");
      setFavorite(favorites.includes(session.id));
    }, 0);

    return () => clearTimeout(timeout);
  }, [session.id]);

  const toggleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem("favs") || "[]");

    if (favorites.includes(session.id)) {
      favorites = favorites.filter((id) => id !== session.id);
      setFavorite(false);
    } else {
      favorites.push(session.id);
      setFavorite(true);
    }

    localStorage.setItem("favs", JSON.stringify(favorites));
  };

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
              <div key={speaker.id} className={styles.speaker}>
                <img src={speaker.avatar} alt={speaker.name} />
                <div>
                  <strong>{speaker.name}</strong>
                  <span>{speaker.role}</span>
                </div>
              </div>
            ))}
          </div>

          <button className={styles.favorite} onClick={toggleFavorite}>
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
