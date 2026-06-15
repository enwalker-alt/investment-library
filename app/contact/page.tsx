const resumeHref = "/resume/Ellis-Walker-Resume.pdf";
const headshotSrc = "/images/headshot.jpg";
// Place your headshot at public/images/headshot.jpg.
// If you want a different file name, update headshotSrc above.

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="section-shell">
          <h1>Contact</h1>
        </div>
      </section>

      <section className="content-section">
        <div className="section-shell contact-layout">
          <div className="contact-table">
            <div>
              <span>Email</span>
              <a href="mailto:ellisnelsonwalker@gmail.com">
                ellisnelsonwalker@gmail.com
              </a>
            </div>
            <div>
              <span>LinkedIn</span>
              <a
                href="https://www.linkedin.com/in/elliswalk/"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com/in/elliswalk
              </a>
            </div>
            <div>
              <span>Resume</span>
              <a href={resumeHref} target="_blank" rel="noopener noreferrer">
                View resume
              </a>
            </div>
          </div>

          <aside className="headshot-box" aria-label="Headshot">
            <img src={headshotSrc} alt="Ellis Walker headshot" />
          </aside>
        </div>
      </section>
    </main>
  );
}
