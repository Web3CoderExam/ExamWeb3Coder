"use client";
import { useState, useEffect } from "react";
import "./Styles.css";
import mockData from "@/data/mockData.json";

function Page() {
    const [visibleCount, setVisibleCount] = useState(3);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const loadMore = () => {
        setVisibleCount((prev) => prev + 3);
    };

    // 🔍 FILTRE
    const filteredEvents = mockData.events.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleEvents = filteredEvents.slice(0, visibleCount);

    // 🔁 RESET quand on recherche
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisibleCount(3);
    }, [searchTerm]);

    return (
        <main className="main-container">
            {/* HERO */}
            <section className="hero">
                <div className="overlay">
                    <div className="hero-content">
                        <h1>Découvrez les meilleurs événements</h1>
                        <p>Explorez les conférences, workshops et rencontres près de vous.</p>

                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Rechercher un événement..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button>🔍</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* EVENTS */}
            <section className="events">
                <h2>Événements à venir</h2>

                <div className="cards">
                    {visibleEvents.map((event) => (
                        <div className="card" key={event.id}>
                            <h3>{event.title}</h3>
                            <p>{event.date}</p>
                            <span>📍 {event.location}</span>

                            <button onClick={() => setSelectedEvent(event)}>
                                Voir détails
                            </button>
                        </div>
                    ))}
                </div>

                {/* ❌ Aucun résultat */}
                {visibleEvents.length === 0 && (
                    <p className="no-result">Aucun événement trouvé 😢</p>
                )}

                {/* Voir plus */}
                {visibleCount < filteredEvents.length && (
                    <div className="see-all">
                        <button className="outline" onClick={loadMore}>
                            Voir plus advancements
                        </button>
                    </div>
                )}
            </section>

            {/* MODAL */}
            {selectedEvent && (
                <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>

                        <h2>{selectedEvent.title}</h2>
                        <p className="desc">{selectedEvent.description}</p>

                        <div className="info">
                            <span>📅 {selectedEvent.date}</span>
                            <span>📍 {selectedEvent.location}</span>
                        </div>

                        <h4>Sessions</h4>

                        {selectedEvent.sessions?.map((session) => (
                            <div className="session" key={session.id}>
                                <strong>{session.title}</strong>
                                <p>🕒 {session.time}</p>
                                <p>👤 {session.speaker}</p>
                                {session.description && <p>{session.description}</p>}
                            </div>
                        ))}

                        <button className="close-btn" onClick={() => setSelectedEvent(null)}>
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Page