"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import Image from "next/image";
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
        <Image src="/logo-eventsync.svg" alt="EventSync" width={160} height={40} priority />
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
        <Link href="/login" className={styles.admin}>
          Admin
        </Link>

        <User className={styles.icon} />
      </div>
    </header>
  );
}
