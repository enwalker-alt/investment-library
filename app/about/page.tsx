const timelineItems = [
  {
    year: "2018",
    title: "IFEB — Fintech Bank Startup Intern",
    description:
      "Early exposure to finance, banking, and entrepreneurship through work connected to a fintech banking environment.",
  },
  {
    year: "2020–2024",
    title: "University of Mississippi — B.B.A. Economics",
    description:
      "Studied economics with coursework across markets, statistics, financial institutions, and applied analysis.",
  },
  {
    year: "2023",
    title: "Fiserv — Corporate Accounting Intern",
    description:
      "Assisted the corporate accounting team of a Fortune 200 financial services company and was selected as one of four interns from a global intern class of 250+ to present to senior leaders and employees.",
  },
  {
    year: "2024",
    title: "Strategic Financial Partners — Wealth Management Intern",
    description:
      "Assisted with financial advising work for a firm with approximately $4B in assets under management.",
  },
  {
    year: "2025–Present",
    title: "S&P Global — Private Markets Analyst",
    description:
      "Analyze financial statements, capitalization tables, ownership structures, and other investment-related documents for leading global private equity and venture capital firms.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="section-shell">
          <h1>About</h1>
        </div>
      </section>

      <section className="content-section">
        <div className="section-shell readable-shell">
          <h2>Background</h2>
          <p>
            I began formally building my public equity research process in
            February 2026. The work is focused on studying businesses, building a
            private library of company research, writing periodic letters, and
            developing a long-term record of investment judgment.
          </p>
          <p>
            The long-term goal is to build the kind of process that could support
            a concentrated investment firm. For now, the emphasis is on research,
            discipline, documentation, and improvement rather than activity for
            its own sake.
          </p>
        </div>
      </section>

      <section className="content-section compact-section">
        <div className="section-shell">
          <h2>Professional and educational timeline</h2>
          <div className="timeline-list">
            {timelineItems.map((item) => (
              <article key={item.year} className="timeline-item">
                <div className="timeline-year">{item.year}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
