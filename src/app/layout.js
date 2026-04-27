"use client";

import { useState } from "react";
import styles from "./layout.module.css";
import Navbar from "../components/layout/Navbar/Navbar";
import Sidebar from "../components/layout/Sidebar/Sidebar";

export default function RootLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <html>
      <body className={styles.body}>

        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />

        <div className={styles.container}>

          <Sidebar isOpen={isOpen} />

          {isOpen && (
            <div
              className={styles.overlay}
              onClick={() => setIsOpen(false)}
            />
          )}

          <main className={styles.main}>
            {children}
          </main>

        </div>

      </body>
    </html>
  );
}