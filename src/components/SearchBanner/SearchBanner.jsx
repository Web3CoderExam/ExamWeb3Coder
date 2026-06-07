"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./SearchBanner.module.css";

export default function SearchBanner() {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const router = useRouter();

    useEffect(() => {
        const delay = setTimeout(() => {
            if (searchQuery.trim()) {
                router.push(`/accueil?search=${encodeURIComponent(searchQuery.trim())}`);
            } else {
                router.push("/accueil");
            }
        }, 300); 

        return () => clearTimeout(delay);
    }, [searchQuery, router]);

    const handleSearch = (e) => {
        e.preventDefault();
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