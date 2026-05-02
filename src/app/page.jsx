"use client"; // Obligatoire pour utiliser le state
import { useState } from "react";
import "./Styles.css";
import mockData from "@/data/mockData.json";

export default function Page() {
    // On commence par afficher 3 éléments
    const [visibleCount, setVisibleCount] = useState(3);

    // Fonction pour charger 3 éléments de plus
    const loadMore = () => {
        setVisibleCount((prevCount) => prevCount + 3);
    };

    // On coupe le tableau pour n'afficher que le nombre voulu
    const visibleEvents = mockData.events.slice(0, visibleCount);

    return (
        <main>
            {/* HERO */}
            <section className="hero">
                <div className="overlay">
                    <div className="hero-content">
                        <h1>Découvrez les meilleurs événements</h1>
                        <p>Explorez les conférences, workshops et rencontres près de vous.</p>

                        <div className="search-bar">
                            <input type="text" placeholder="Rechercher un événement..." />
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
                            <button className="details-btn">Voir détails</button>
                        </div>
                    ))}
                </div>

                {/* On n'affiche le bouton que s'il reste des événements à charger */}
                {visibleCount < mockData.events.length && (
                    <div className="see-all">
                        <button className="outline" onClick={loadMore}>
                            Voir plus d'événements
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}