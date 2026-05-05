"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/speakers", label: "Intervenants" },
    { href: "/planning", label: "Planning" },
    { href: "/favorites", label: "Favoris" },
  ];

  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        EventSync
      </Link>

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

      <div className={styles.right}>
        <Link href="/admin" className={styles.admin}>
          Admin
        </Link>

        <User className={styles.icon} />
      </div>
    </header>
  );
}
