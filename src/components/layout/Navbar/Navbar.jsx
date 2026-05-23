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

  const links = [
    { href: "/accueil", label: "Accueil" },
    { href: "/speakers", label: "Intervenants" },
    { href: "/planning", label: "Planning" },
    { href: "/favorites", label: "Favoris" },
    { href: "http://localhost:3000/admin/login", label: "Admin", admin: true },
  ];

  return (
    <header className={styles.navbar}>
      <Link href="/accueil" className={styles.logo}>
        <Image src="/logo-eventsync.svg" alt="EventSync" width={160} height={40} priority />
      </Link>

      <nav className={styles.nav}>
        {links.map((link) => {
          let className = "";
          if (link.admin) {
            className = styles.adminLink;
          } else if (isClient && pathname === link.href) {
            className = `${styles.navLink} ${styles.active}`;
          } else {
            className = styles.navLink;
          }
          return (
            <Link key={link.href} href={link.href} className={className}>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}