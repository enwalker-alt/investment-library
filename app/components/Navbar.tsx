import Link from "next/link";

const resumeHref = "/resume/Ellis-Walker-Resume.pdf";

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link href="/" className="brand">
          Ellis Nelson Walker
        </Link>

        <nav className="nav-links">
          <Link href="/documents">Research Library</Link>
          <Link href="/reports">Reports</Link>
          <a href={resumeHref} target="_blank" rel="noopener noreferrer">
            Resume
          </a>
          <Link href="/#contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}