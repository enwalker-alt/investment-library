import Image from "next/image";
import Link from "next/link";

const resumeHref = "/resume/Ellis-Walker-Resume.pdf";

const timelineItems = [
  {
    year: "2018",
    title: "Fintech Bank Startup (IFEB) - Intern",
    bullets: [
      "First exposure to finance, banking, and entrepreneurship through work connected to a fintech banking environment.",
      "Observed how financial products, business operations, and entrepreneurial decision-making interact in practice.",
    ],
  },
  {
    year: "2020–2024",
    title: "University of Mississippi — B.B.A. Economics",
    bullets: [
      "Studied economics with coursework across markets, statistics, financial institutions, and applied analysis.",
      "In an econometrics course, wrote a research paper on the correlation between interest rates and the stock market prices of financial institutions.",
    ],
  },
  {
    year: "2023",
    title: "Fiserv — Corporate Accounting Intern",
    bullets: [
      "Assisted the corporate accounting team of a Fortune 200 financial services company.",
      "Selected as one of four interns from a global intern class of 250+ to present to senior leaders and employees.",
    ],
  },
  {
    year: "2024",
    title: "Strategic Financial Partners — Wealth Management Intern",
    bullets: [
      "Assisted with financial advising work for a firm with approximately $4B in assets under management.",
      "Gained experience in client service, financial planning workflows, and professional communication.",
    ],
  },
  {
    year: "2025–Present",
    title: "S&P Global — Private Markets Analyst",
    bullets: [
      "Analyze financial statements, capitalization tables, ownership structures, and other investment-related documents for leading global private equity and venture capital firms.",
      "Building this research library to move closer to public equity research and long-term investment management.",
    ],
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="home-hero section-shell">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Personal Equity Research</p>

            <h1>Ellis Walker</h1>

            <p className="hero-subtitle">
              Private markets analyst building a public record of independent investment research.
            </p>

            <div className="button-row">
              <Link href="/documents" className="button button-dark">
                Research Library
              </Link>

              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-light"
              >
                Resume
              </a>
            </div>
          </div>

          <div className="headshot-wrap">
            <Image
              src="/images/headshot.jpg"
              alt="Ellis Walker headshot"
              width={720}
              height={900}
              priority
              className="headshot"
            />
          </div>
        </div>
      </section>

      <section id="timeline" className="timeline-section">
        <div className="section-shell">
          <div className="section-heading">
            <p className="eyebrow">Background</p>
            <h2>Education & Professional Timeline</h2>
          </div>

          <div className="timeline-list">
            {timelineItems.map((item) => (
              <div key={item.year} className="timeline-item">
                <div className="timeline-year">{item.year}</div>

                <div>
                  <h3>{item.title}</h3>

                  <ul>
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="section-shell">
          <div className="section-heading compact">
            <p className="eyebrow">Contact</p>
            <h2>Get in touch</h2>
          </div>

          <div className="contact-card">
            <div className="contact-row">
              <span>Email</span>
              <a href="mailto:ellisnelsonwalker@gmail.com">
                ellisnelsonwalker@gmail.com
              </a>
            </div>

            <div className="contact-row">
              <span>LinkedIn</span>
              <a
                href="https://www.linkedin.com/in/elliswalk/"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com/in/elliswalk
              </a>
            </div>

            <div className="contact-row">
              <span>Resume</span>
              <a href={resumeHref} target="_blank" rel="noopener noreferrer">
                View Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <p>© {new Date().getFullYear()} Ellis Walker</p>
          <p>Personal research. Not investment advice.</p>
        </div>
      </footer>
    </main>
  );
}