"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBanner.module.css";

export default function SearchBanner() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/accueil?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className={styles.banner}>
            <div className={styles.content}>
                <span className={styles.eyebrow}>Découvrez les meilleurs événements</span>
                <h1>Explorez les conférences, workshops et rencontres près de vous.</h1>

                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input
                        type="text"
                        placeholder="Rechercher un événement..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button type="submit" className={styles.searchButton}>
                        Rechercher
                    </button>
                </form>
            </div>
        </div>
    );
}
