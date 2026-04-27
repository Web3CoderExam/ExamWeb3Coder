import Link from "next/link";
import "./sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <h2>Menu</h2>

      <nav>
        <Link href="/">🗓 Planning</Link>
        <Link href="/events">📅 Events</Link>
        <Link href="/favorites">⭐ Favorites</Link>
        <Link href="/speakers">🎤 Speakers</Link>
      </nav>

    </aside>
  );
}