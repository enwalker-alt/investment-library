import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

type DocumentFile = {
  title: string;
  type: string;
  href: string;
  extension: string;
};

type DocumentSection = {
  title: string;
  description: string;
  folder: string;
  documents: DocumentFile[];
};

const sections = [
  {
    title: "General Thesis",
    description:
      "Broad investment memos, market observations, portfolio principles, and high-level research views.",
    folder: "general-thesis",
  },
  {
    title: "Initial Screenings",
    description:
      "First-pass company screens focused on business simplicity, valuation, financial strength, and research priority.",
    folder: "initial-screenings",
  },
  {
    title: "Financial Summaries",
    description:
      "Company-level financial notes, ratio summaries, ROIC work, capital allocation history, and balance sheet review.",
    folder: "financial-summaries",
  },
  {
    title: "Qualitative Assessments",
    description:
      "Deeper business reviews covering durability, competitive position, management, reinvestment, and long-term risks.",
    folder: "qualitative-assessments",
  },
  {
    title: "Valuation Models",
    description:
      "Valuation workbooks, DCFs, normalized earnings models, scenario analysis, and margin-of-safety estimates.",
    folder: "valuation-models",
  },
];

const allowedExtensions = [".pdf", ".xlsx", ".xls", ".csv", ".docx"];

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

  if (extension === "XLSX" || extension === "XLS") return "Excel";
  if (extension === "DOCX") return "Word";
  if (extension === "CSV") return "CSV";
  if (extension === "PDF") return "PDF";

  return extension;
}

function getDocumentsFromFolder(folder: string): DocumentFile[] {
  const folderPath = path.join(process.cwd(), "public", "research", folder);

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
      const href = `/research/${folder}/${encodeURIComponent(fileName)}`;

      return {
        title: formatTitle(fileName),
        type: formatType(fileName),
        extension,
        href,
      };
    });
}

function getDocumentSections(): DocumentSection[] {
  return sections.map((section) => ({
    ...section,
    documents: getDocumentsFromFolder(section.folder),
  }));
}

function getDocumentHref(doc: DocumentFile) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

  const isOfficeFile =
    doc.extension === ".xlsx" ||
    doc.extension === ".xls" ||
    doc.extension === ".docx";

  if (isOfficeFile && siteUrl) {
    const absoluteFileUrl = `${siteUrl}${doc.href}`;

    return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
      absoluteFileUrl
    )}`;
  }

  return doc.href;
}

function getDocumentLabel(doc: DocumentFile) {
  if (doc.type === "Excel") return "Open Excel";
  if (doc.type === "Word") return "Open Word";

  return doc.type;
}

export default function DocumentsPage() {
  const documentSections = getDocumentSections();

  return (
    <main>
      <section className="documents-hero">
        <div className="section-shell">
          <p className="eyebrow">Research Library</p>

          <h1>Documents</h1>

          <p>
            Company research, investment screens, financial summaries,
            qualitative assessments, and valuation work.
          </p>
        </div>
      </section>

      <section className="documents-section">
        <div className="documents-panel">
          {documentSections.map((section) => (
            <div key={section.title} className="documents-group">
              <div className="documents-info">
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </div>

              <div className="documents-links">
                {section.documents.length > 0 ? (
                  <ul>
                    {section.documents.map((doc) => (
                      <li key={doc.href}>
                        <a
                          href={getDocumentHref(doc)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>{doc.title}</span>
                          <em>{getDocumentLabel(doc)}</em>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-note">
                    No documents uploaded in this section yet.
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