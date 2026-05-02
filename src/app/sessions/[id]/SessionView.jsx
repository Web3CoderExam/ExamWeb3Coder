"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./SessionPage.module.css";
import { ThumbsUp } from "lucide-react";

export default function SessionView({ session, speakers }) {
  const [questions, setQuestions] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [tab, setTab] = useState("popular");
  const [favorite, setFavorite] = useState(false);
  const [now, setNow] = useState(Date.now());

  /* SPEAKERS */
  const sessionSpeakers = speakers.filter(s =>
    session.speakerId === s.id
  );

  /* LIVE TIMER */
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const isLive = useMemo(() => {
    const nowDate = new Date(now);
    const [h, m] = session.time.split(":").map(Number);

    const start = new Date();
    start.setHours(h, m, 0, 0);

    const end = new Date(start);
    end.setHours(end.getHours() + session.duration);

    return nowDate >= start && nowDate <= end;
  }, [now, session]);

  /* LOAD QUESTIONS */
  useEffect(() => {
    const local = JSON.parse(
      localStorage.getItem("questions-" + session.id) || "[]"
    );

    const initial = session.questions || [];

    
    const merged = [...initial, ...local].reduce((acc, q) => {
      if (!acc.find(x => x.id === q.id)) acc.push(q);
      return acc;
    }, []);

    setQuestions(merged);
  }, [session]);

  /* SAVE */
  useEffect(() => {
    localStorage.setItem(
      "questions-" + session.id,
      JSON.stringify(questions)
    );
  }, [questions, session.id]);

  /* FAVORITES */
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favs") || "[]");
    setFavorite(favs.includes(session.id));
  }, [session.id]);

  const toggleFavorite = () => {
    let favs = JSON.parse(localStorage.getItem("favs") || "[]");

    if (favs.includes(session.id)) {
      favs = favs.filter(id => id !== session.id);
      setFavorite(false);
    } else {
      favs.push(session.id);
      setFavorite(true);
    }

    localStorage.setItem("favs", JSON.stringify(favs));
  };

  /*  ADD QUESTION */
  const addQuestion = () => {
    if (!input.trim()) return;

    const newQ = {
      id: Date.now(),
      content: input,
      author: name || "Anonyme",
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };

    setQuestions(prev => [newQ, ...prev]);

    setInput("");
    setName("");
  };

  /*  UPVOTE */
  const upvote = (id) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q
      )
    );
  };

  /* SORT */
  const sortedQuestions = [...questions].sort((a, b) => {
    if (tab === "popular") return b.upvotes - a.upvotes;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className={styles.page}>

      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1>{session.title}</h1>

          <div className={styles.meta}>
            <span>{session.time}</span>
            <span>•</span>
            <span>{session.room}</span>
            <span>•</span>
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

      {/* GRID */}
      <div className={styles.grid}>

        {/* LEFT */}
        <div>

          <div className={styles.card}>
            <p className={styles.description}>
              {session.description}
            </p>
          </div>

          <div className={styles.card}>
            <h3>Intervenant</h3>

            {sessionSpeakers.map(s => (
              <div key={s.id} className={styles.speaker}>
                <img src={s.avatar} />
                <div>
                  <strong>{s.name}</strong>
                  <span>{s.role}</span>
                </div>
              </div>
            ))}
          </div>

          <button className={styles.favorite} onClick={toggleFavorite}>
            {favorite ? "❤️ Retiré des favoris" : "🤍 Ajouter aux favoris"}
          </button>

        </div>

        {/* RIGHT */}
        <div className={styles.card}>

          <h3 style={{ marginBottom: 16 }}>
            💬 Live Q&A ({questions.length})
          </h3>

          {isLive ? (
            <>
              {/* INPUT */}
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

              {/* TABS */}
              <div className={styles.tabs}>
                <button
                  className={tab === "popular" ? styles.active : ""}
                  onClick={() => setTab("popular")}
                >
                  🔥 Populaires
                </button>

                <button
                  className={tab === "recent" ? styles.active : ""}
                  onClick={() => setTab("recent")}
                >
                  🕒 Récentes
                </button>
              </div>

              {/* LIST */}
              <div className={styles.list}>
                {sortedQuestions.length === 0 && (
                  <p className={styles.empty}>
                    Aucune question pour le moment
                  </p>
                )}

                {sortedQuestions.map(q => (
                  <div key={q.id} className={styles.question}>
                    <div>
                      <strong>🔒 {q.author || "Anonyme"}</strong>
                      <p>{q.content}</p>
                    </div>

                    <button
                      className={styles.vote}
                      onClick={() => upvote(q.id)}
                    >
                      <ThumbsUp size={14} />
                      {q.upvotes}
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className={styles.offline}>
              ⏳ Les questions seront disponibles pendant le live
            </p>
          )}

        </div>

      </div>
    </div>
  );
}