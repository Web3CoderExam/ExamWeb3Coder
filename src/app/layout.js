import "./globals.css";
import styles from "./layout.module.css";
import Navbar from "../components/layout/Navbar/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={styles.body}>

        <div className={styles.app}>

          <Navbar />

          <main className={styles.main}>
            {children}
          </main>

        </div>

      </body>
    </html>
  );
}