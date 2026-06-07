"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAdminClick = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (res.ok) {
      window.location.href = "http://localhost:5173";
    } else {
      window.location.href = "/login";
    }
  };

  const links = [
    { href: "/accueil", label: "Accueil" },
    { href: "/speakers", label: "Intervenants" },
    { href: "/planning", label: "Planning" },
    { href: "/favorites", label: "Favoris" },
  ];

  return (
    <header className={styles.navbar}>
      <Link href="/accueil" className={styles.logo}>
        <Image src="/logo-eventsync.svg" alt="EventSync" width={160} height={40} priority />
      </Link>

      <nav className={styles.nav}>
        {links.map((link) => {
          const className = isClient && pathname === link.href
            ? `${styles.navLink} ${styles.active}`
            : styles.navLink;
          return (
            <Link key={link.href} href={link.href} className={className}>
              {link.label}
            </Link>
          );
        })}
        <a href="#" onClick={handleAdminClick} className={styles.adminLink}>
          Admin
        </a>
      </nav>
    </header>
  );
}