'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './admin.module.css';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Ne pas afficher le layout sur la page de login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/events', label: 'Événements', icon: '📅' },
    { href: '/admin/sessions', label: 'Sessions', icon: '🎤' },
    { href: '/admin/speakers', label: 'Intervenants', icon: '👥' },
    { href: '/admin/rooms', label: 'Salles', icon: '🏠' },
    { href: '/admin/settings', label: 'Paramètres', icon: '⚙️' },
  ];

  return (
    <div className={styles.layout}>
      {/* Bouton menu hamburger */}
      <button onClick={toggleSidebar} className={styles.menuButton}>
        ☰
      </button>

      {/* Overlay pour fermer le sidebar en cliquant à côté */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <h2>EventSync</h2>
          <p>Administrateur</p>
        </div>
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={`${styles.navItem} ${
                pathname === item.href ? styles.active : ''
              }`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <span>🔓</span> Déconnexion
        </button>
      </aside>

      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}