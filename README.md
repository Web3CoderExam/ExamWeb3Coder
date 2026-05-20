#  Projet EventSync - Plateforme de Gestion d'Événements

## 👥 Organisation de l'Équipe & Rôles
* **Charaffaine Issa Ben Said (Chef de Projet & Backend) :** Architecture des API, sécurisation des données (Bcrypt/JWT) et gestion de la base de données PostgreSQL.
* **Alpha (Structure & Layout) :** Architecture globale (`layout.js`), Navbar et Footer.
* **Narindra (Lead Design & UI) :** Charte graphique, styles globaux et design des composants.
* **Fitiavana (Front-end Logic) :** Page d'accueil et logique d'affichage des événements.
* **Aina Tsiory (Authentification & Sécurité) :** Interface Login et gestion des sessions utilisateur.

## 🛠️ Stack Technique
### Frontend
* **Framework :** Next.js 16 (App Router).
* **UI & Style :** React 19, CSS 4 (Modern CSS), CSS Modules.
* **Icônes :** Lucide React.
* **Gestion d'état :** React Hooks personnalisés.

### Backend & Sécurité
* **Serveur :** Next.js API Routes (Node.js).
* **Base de données :** PostgreSQL avec driver `pg`.
* **Authentification :** JSON Web Tokens (JWT) via `jose` et `jsonwebtoken`.
* **Cryptographie :** Hachage des mots de passe avec `bcryptjs`.

## 📂 Architecture du Projet
*   **`database/`** : Scripts SQL (`schema.sql`) pour l'initialisation des tables.
*   **`src/app/`** : Pages et routes API.
*   **`src/components/`** : Composants UI structurés de manière modulaire :
    *   `EventCard/`, `EventPage/`, `Favorites/`, `features/`, `Footer/`, `layout/`, `Navbar/`, `Planning/`, `SessionList/`, `Speakers/`.
*   **`src/lib/`** : Logique serveur (`db.js`, `auth.js`, `auth-utils.js`).
*   **`src/hooks/`** : Logique React partagée.
*   **`src/data/`** : Données statiques (`mockData.json`).
*   **`middleware.js`** : Protection des routes.

##  Installation & Lancement

### 1. Cloner le projet et installer les dépendances
```bash
git clone <url-du-repo>
cd eventsync
npm install

### 2. Variables d'env : Créer un .env avec DATABASE_URL et JWT_SECRET.
### 3. Database : Exécuter database/schema.sql dans PostgreSQL.
### 4. Dev : npm run dev.