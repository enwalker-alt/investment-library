import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

type ReportFile = {
  id: string;
  title: string;
  type: string;
  href: string;
  extension: string;
  sectionTitle: string;
};

type ReportSection = {
  title: string;
  description: string;
  folder: string;
  reports: ReportFile[];
};

const sections = [
  {
    title: "Quarterly Reports",
    description:
      "Quarterly updates on completed research, watchlist additions, valuation work, portfolio activity, and investment observations.",
    folder: "quarterly",
  },
  {
    title: "Annual Reports",
    description:
      "Full-year reviews of research progress, companies studied, valuation updates, portfolio results, and lessons learned.",
    folder: "annual",
  },
];

const allowedExtensions = [".pdf", ".docx"];

function formatTitle(fileName: string) {
  const extension = path.extname(fileName);
  const nameWithoutExtension = fileName.replace(extension, "");

  return nameWithoutExtension
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatType(fileName: string) {
  const extension = path.extname(fileName).replace(".", "").toUpperCase();

  if (extension === "DOCX") return "Word";
  if (extension === "PDF") return "PDF";

  return extension;
}

function createReportId(folder: string, fileName: string) {
  return `${folder}__${fileName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getReportsFromFolder(
  folder: string,
  sectionTitle: string
): ReportFile[] {
  const folderPath = path.join(process.cwd(), "public", "reports", folder);

  if (!fs.existsSync(folderPath)) {
    return [];
  }

  return fs
    .readdirSync(folderPath)
    .filter((fileName) => {
      const filePath = path.join(folderPath, fileName);
      const extension = path.extname(fileName).toLowerCase();

      return (
        fs.statSync(filePath).isFile() && allowedExtensions.includes(extension)
      );
    })
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => {
      const extension = path.extname(fileName).toLowerCase();
      const href = `/reports/${folder}/${encodeURIComponent(fileName)}`;

      return {
        id: createReportId(folder, fileName),
        title: formatTitle(fileName),
        type: formatType(fileName),
        extension,
        href,
        sectionTitle,
      };
    });
}

function getReportSections(): ReportSection[] {
  return sections.map((section) => ({
    ...section,
    reports: getReportsFromFolder(section.folder, section.title),
  }));
}

function getReportLabel(report: ReportFile) {
  if (report.type === "Word") return "View Word";
  if (report.type === "PDF") return "View PDF";

  return `View ${report.type}`;
}

export default function ReportsPage() {
  const reportSections = getReportSections();

  return (
    <main>
      <section className="documents-hero">
        <div className="section-shell">
          <p className="eyebrow">Reports</p>

          <h1>Periodic Reports</h1>

          <p>
            Periodic updates on my independent investment research process,
            including completed company work, valuation updates, watchlist
            changes, portfolio activity, and broader reflections on markets and
            business.
          </p>
        </div>
      </section>

      <section className="documents-section">
        <div className="documents-panel">
          {reportSections.map((section) => (
            <div key={section.title} className="documents-group">
              <div className="documents-info">
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </div>

              <div className="documents-links">
                {section.reports.length > 0 ? (
                  <ul>
                    {section.reports.map((report) => (
                      <li key={report.id}>
                        <a
                          href={report.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>{report.title}</span>
                          <em>{getReportLabel(report)}</em>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-note">
                    No reports uploaded in this section yet.
                  </p>
                )}
              </div>
            </div>
          ))}
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