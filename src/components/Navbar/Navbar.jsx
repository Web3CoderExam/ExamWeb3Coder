"use client";

import styles from "./Navbar.module.css";
import { Bell, Search, User, Menu } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
  return (
    <header className={styles.navbar}>

      {/* Left */}
      <div className={styles.left}>
        <Menu className={styles.menuIcon} onClick={toggleSidebar} />
        <h1 className={styles.logo}>EventSync</h1>
      </div>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search events..."
          className={styles.search}
        />
      </div>

      {/* Right */}
      <div className={styles.right}>
        <Bell className={styles.icon} />
        <User className={styles.icon} />
        <div className={styles.avatar}></div>
      </div>

    </header>
  );
}