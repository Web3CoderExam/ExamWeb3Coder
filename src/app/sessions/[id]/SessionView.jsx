"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThumbsUp } from "lucide-react";
import useFavorites from "@/hooks/useFavorites";
import styles from "./SessionPage.module.css";

function mergeQuestions(defaultQuestions = [], savedQuestions = []) {
  const merged = [];
  const seen = new Set();

  for (const question of [...defaultQuestions, ...savedQuestions]) {
    if (!seen.has(question.id)) {
      seen.add(question.id);
      merged.push(question);
    }
  }

  return merged;
}

function getSessionSpeakerIds(session) {
  if (Array.isArray(session.speakerIds) && session.speakerIds.length > 0) {
    return session.speakerIds;
  }

  return session.speakerId ? [session.speakerId] : [];
}

function computeEndTime(startTime, duration) {
  if (!startTime || duration == null) return null;

  const [hours, minutes] = startTime.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setMinutes(date.getMinutes() + Math.round(duration * 60));

  return date.toTimeString().slice(0, 5);
}

function getSessionTimeRange(session) {
  const startTime = session.startTime || session.time;
  const endTime = session.endTime || computeEndTime(startTime, session.duration);
  return endTime ? `${startTime} - ${endTime}` : startTime;
}

export default function SessionView({ event, session, speakers, defaultFavorites }) {
  const [questions, setQuestions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [tab, setTab] = useState("popular");
  const [now, setNow] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites(defaultFavorites);
  const sessionDate = session.date || event.startDate || event.date;
  const questionKey = `questions-${session.id}`;

  const sessionSpeakers = speakers.filter((speaker) =>
    getSessionSpeakerIds(session).includes(speaker.id)
  );

  const favorite = isFavorite(session.id);

  useEffect(() => {
    const initialTimer = setTimeout(() => setNow(Date.now()), 0);
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, []);

  const isLive = () => {
    const nowDate = new Date(now);
    const startTime = session.startTime || session.time;
    const endTime = session.endTime || computeEndTime(startTime, session.duration);
    const start = new Date(`${sessionDate}T${startTime}`);
    const end = endTime
      ? new Date(`${sessionDate}T${endTime}`)
      : new Date(start.getTime() + session.duration * 60 * 60 * 1000);

    return nowDate >= start && nowDate <= end;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedQuestions = JSON.parse(localStorage.getItem(questionKey) || "[]");
      setQuestions(mergeQuestions(session.questions || [], savedQuestions));
      setIsLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, [questionKey, session.questions]);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(questionKey, JSON.stringify(questions));
  }, [isLoaded, questions, questionKey]);

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
            <span>{getSessionTimeRange(session)}</span>
            <span>{session.room}</span>
            <span>{session.capacity} places</span>
          </div>
        </div>

        {isLive() && (
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
            <h2>Intervenants</h2>

            {sessionSpeakers.map((speaker) => (
              <Link
                key={speaker.id}
                href={`/speakers/${speaker.id}`}
                className={styles.speaker}
              >
                <Image
                  src={speaker.avatar}
                  alt={speaker.name}
                  width={48}
                  height={48}
                />
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
