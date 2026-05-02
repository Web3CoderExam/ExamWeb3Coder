import "./Styles.css";

export default function page() {
  return (
      <main>
        {/* HERO */}
        <section className="hero">
          <div className="overlay">
            <div className="hero-content">
              <h1>Découvrez les meilleurs événements</h1>
              <p>
                Explorez les conférences, workshops et rencontres près de vous.
              </p>

              <div className="search-bar">
                <input
                    type="text"
                    placeholder="Rechercher un événement..."
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
            {/* CARD 1 */}
            <div className="card">
              <h3>Dev Conference 2026</h3>
              <p>12 - 14 Juin 2026</p>
              <span>📍 Antananarivo, Madagascar</span>
              <button>Voir détails</button>
            </div>

            {/* CARD 2 */}
            <div className="card">
              <h3>AI Summit 2026</h3>
              <p>20 - 21 Août 2026</p>
              <span>📍 Paris</span>
              <button>Voir détails</button>
            </div>

            {/* CARD 3 */}
            <div className="card">
              <h3>Design Week 2026</h3>
              <p>05 - 07 Septembre 2026</p>
              <span>📍 Lyon</span>
              <button>Voir détails</button>
            </div>
          </div>

          <div className="see-all">
            <button className="outline">Voir tous les événements</button>
          </div>
        </section>
      </main>
  );
}