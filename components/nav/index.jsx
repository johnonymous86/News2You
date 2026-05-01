import Link from "next/link";
import styles from "./style.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/feed">Feed</Link>
      <Link href="/preferences">Preferences</Link>
      <Link href="/saved">Saved</Link>
    </nav>
  );
}