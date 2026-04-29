"use client";

import styles from "./Navbar.module.css";
import { Bell, Search, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className={styles.navbar}>

      {/* LEFT */}
      <div className={styles.left}>
        <h1 className={styles.logo}>EventSync</h1>
      </div>

      {/* SEARCH */}
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search events..."
          className={styles.search}
        />
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        <Bell className={styles.icon} />
        <User className={styles.icon} />
        <div className={styles.avatar}></div>
      </div>

    </header>
  );
}