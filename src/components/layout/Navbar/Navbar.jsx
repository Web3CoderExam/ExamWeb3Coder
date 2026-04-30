"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import { User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/events", label: "Événements" },
    { href: "/speakers", label: "Intervenants" },
    { href: "/planning", label: "Planning" },
    { href: "/favorites", label: "Favoris" },
  ];

  return (
    <header className={styles.navbar}>
      
      {/* LOGO */}
      <Link href="/" className={styles.logo}>
        EventSync
      </Link>

      {/* NAV */}
      <nav className={styles.nav}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? styles.active : ""}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* RIGHT */}
      <div className={styles.right}>
        <User className={styles.icon} />
      </div>

    </header>
  );
}