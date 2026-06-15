import Link from "next/link";

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link href="/" className="brand">
          Ellis Walker
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/letters">Letters</Link>
          <Link href="/philosophy">Philosophy</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
