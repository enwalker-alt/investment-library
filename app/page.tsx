import Link from "next/link";

const homeImageSrc: string = "/images/home-image.jpg";
// To add an image to the homepage, place the image in public/images and set this value.
// Example: const homeImageSrc = "/images/home-image.jpg";
// You can also paste a full image URL, but saving the image locally is cleaner.

const statusItems = [
  ["Research began", "February 2026"],
  ["Current portfolio", "100% short-term U.S. Treasuries / 0% equities"],
  [
    "Focus",
    "Fundamentals-based public equity research, with an emphasis on understandable small companies, conservative valuation, and margin of safety.",
  ],
];

export default function HomePage() {
  return (
    <main>
      <section className="page-hero home-hero">
        <div className="section-shell">
          <h1>Investment Letters and Research Record</h1>
          <p className="lead">Letters, philosophy, background, and contact information.</p>

          {homeImageSrc ? (
            <figure className="home-image-frame">
              <img src={homeImageSrc} alt="Homepage image" />
            </figure>
          ) : null}
        </div>
      </section>

      <section className="content-section">
        <div className="section-shell narrow-shell">
          <h2>Contents</h2>
          <ul className="plain-list">
            <li>
              <Link href="/letters">Letters</Link> — quarterly and annual
              investment writing.
            </li>
            <li>
              <Link href="/philosophy">Philosophy</Link> — investment approach
              and process.
            </li>
            <li>
              <Link href="/about">About</Link> — background and timeline.
            </li>
            <li>
              <Link href="/contact">Contact</Link> — email, LinkedIn, and
              resume.
            </li>
          </ul>
        </div>
      </section>

      <section className="content-section compact-section">
        <div className="section-shell narrow-shell">
          <h2>Current status</h2>
          <table className="record-table">
            <tbody>
              {statusItems.map(([label, value]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
