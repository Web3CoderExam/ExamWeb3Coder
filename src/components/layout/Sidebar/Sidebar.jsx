"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./Sidebar.module.css";
import {
  Home,
  Calendar,
  LayoutGrid,
  Mic,
  Star
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>

      <h2 className={styles.title}>MENU</h2>

      <nav className={styles.menu}>

        <Link
          href="/"
          className={`${styles.item} ${pathname === "/" ? styles.active : ""}`}
        >
          <Home className={styles.icon} />
          <span>Home</span>
        </Link>

        <Link
          href="/events"
          className={`${styles.item} ${pathname === "/events" ? styles.active : ""}`}
        >
          <Calendar className={styles.icon} />
          <span>Events</span>
        </Link>

        <Link
          href="/planning"
          className={`${styles.item} ${pathname === "/planning" ? styles.active : ""}`}
        >
          <LayoutGrid className={styles.icon} />
          <span>Planning</span>
        </Link>

        <Link
          href="/speakers"
          className={`${styles.item} ${pathname === "/speakers" ? styles.active : ""}`}
        >
          <Mic className={styles.icon} />
          <span>Speakers</span>
        </Link>

        <Link
          href="/favorites"
          className={`${styles.item} ${pathname === "/favorites" ? styles.active : ""}`}
        >
          <Star className={styles.icon} />
          <span>Favorites</span>
        </Link>

      </nav>
    </div>
  );
}