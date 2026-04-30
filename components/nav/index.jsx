import Link from "next/link";

export default function Nav() {
  return (
    <nav>
      <Link href="/feed">Feed</Link>
      <Link href="/preferences">Preferences</Link>
      <Link href="/saved">Saved</Link>
    </nav>
  );
}