import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

type DocumentFile = {
  id: string;
  title: string;
  type: string;
  href: string;
  extension: string;
  sectionTitle: string;
};

type DocumentSection = {
  title: string;
  description: string;
  folder: string;
  documents: DocumentFile[];
};

type SearchParams =
  | Promise<{
      document?: string;
    }>
  | {
      document?: string;
    };

const sections = [
  {
    title: "General Thesis",
    description:
      "High-level investment ideas, industry notes, and research themes.",
    folder: "general-thesis",
  },
  {
    title: "Initial Screenings",
    description:
      "First-pass reviews to decide whether a company is worth deeper research.",
    folder: "initial-screenings",
  },
  {
    title: "Financial Summaries",
    description:
      "Historical financials, key ratios, returns on capital, and balance sheet notes.",
    folder: "financial-summaries",
  },
  {
    title: "Qualitative Assessments",
    description:
      "Business quality reviews focused on durability, competition, management, and risks.",
    folder: "qualitative-assessments",
  },
  {
    title: "Valuation Models",
    description:
      "DCF models, earnings estimates, valuation ranges, and target entry prices.",
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

function createDocumentId(folder: string, fileName: string) {
  return `${folder}__${fileName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getDocumentsFromFolder(
  folder: string,
  sectionTitle: string
): DocumentFile[] {
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
        id: createDocumentId(folder, fileName),
        title: formatTitle(fileName),
        type: formatType(fileName),
        extension,
        href,
        sectionTitle,
      };
    });
}

function getDocumentSections(): DocumentSection[] {
  return sections.map((section) => ({
    ...section,
    documents: getDocumentsFromFolder(section.folder, section.title),
  }));
}

function getAllDocuments(documentSections: DocumentSection[]) {
  return documentSections.flatMap((section) => section.documents);
}

function getSelectedDocument(allDocuments: DocumentFile[], selectedId?: string) {
  if (!selectedId) {
    return null;
  }

  return allDocuments.find((doc) => doc.id === selectedId) ?? null;
}

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
}

function isOfficeFile(doc: DocumentFile) {
  return (
    doc.extension === ".xlsx" ||
    doc.extension === ".xls" ||
    doc.extension === ".docx"
  );
}

function getViewerSrc(doc: DocumentFile) {
  if (doc.extension === ".pdf") {
    return doc.href;
  }

  if (isOfficeFile(doc)) {
    const siteUrl = getSiteUrl();

    if (!siteUrl) {
      return "";
    }

    const absoluteFileUrl = `${siteUrl}${doc.href}`;

    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      absoluteFileUrl
    )}`;
  }

  return doc.href;
}

function getDocumentLabel(doc: DocumentFile) {
  if (doc.type === "Excel") return "View Excel";
  if (doc.type === "Word") return "View Word";
  if (doc.type === "PDF") return "View PDF";
  if (doc.type === "CSV") return "View CSV";

  return `View ${doc.type}`;
}

function getOpenLabel(doc: DocumentFile) {
  if (doc.type === "Excel") return "Open Excel";
  if (doc.type === "Word") return "Open Word";
  if (doc.type === "PDF") return "Open PDF";
  if (doc.type === "CSV") return "Open CSV";

  return "Open File";
}

function getDocumentPageHref(doc: DocumentFile) {
  return `/documents?document=${doc.id}#document-viewer`;
}

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);

  const documentSections = getDocumentSections();
  const allDocuments = getAllDocuments(documentSections);

  const selectedDocument = getSelectedDocument(
    allDocuments,
    resolvedSearchParams?.document
  );

  const viewerSrc = selectedDocument ? getViewerSrc(selectedDocument) : "";
  const selectedIsOfficeFile = selectedDocument
    ? isOfficeFile(selectedDocument)
    : false;

  return (
    <main>
      {!selectedDocument && (
        <section className="documents-hero">
          <div className="section-shell">
            <p className="eyebrow">Research Library</p>

            <h1>Documents</h1>

            <p>
              Research organized from first-pass screens to historical financial analysis, business quality reviews, and valuation models.
            </p>
          </div>
        </section>
      )}

      {selectedDocument && (
        <section
          id="document-viewer"
          style={{
            width: "100%",
            padding: "26px 18px 42px",
            scrollMarginTop: "72px",
            borderBottom: "1px solid #d8e7f1",
          }}
        >
          <div
            style={{
              width: "min(1720px, calc(100vw - 36px))",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "24px",
                alignItems: "flex-end",
                marginBottom: "16px",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#004b78",
                    marginBottom: "8px",
                  }}
                >
                  {selectedDocument.sectionTitle}
                </p>

                <h1
                  style={{
                    fontSize: "34px",
                    lineHeight: "1.12",
                    margin: 0,
                  }}
                >
                  {selectedDocument.title}
                </h1>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  paddingBottom: "2px",
                }}
              >
                <a
                  href="/documents"
                  style={{
                    border: "1px solid #d8e7f1",
                    padding: "10px 15px",
                    fontSize: "13px",
                    color: "#111",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    background: "#ffffff",
                  }}
                >
                  Back to List
                </a>

                <a
                  href={selectedDocument.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    border: "1px solid #111",
                    padding: "10px 15px",
                    fontSize: "13px",
                    color: "#111",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    background: "#ffffff",
                  }}
                >
                  {getOpenLabel(selectedDocument)}
                </a>
              </div>
            </div>

            {viewerSrc ? (
              <div
                style={{
                  width: "100%",
                  height: "calc(100vh - 205px)",
                  minHeight: "660px",
                  border: "1px solid #d8e7f1",
                  background: "#ffffff",
                  overflow: "hidden",
                  boxShadow: "0 16px 42px rgba(0, 33, 55, 0.08)",
                }}
              >
                {selectedIsOfficeFile ? (
                  <iframe
                    title={selectedDocument.title}
                    src={viewerSrc}
                    style={{
                      width: "133.333%",
                      height: "133.333%",
                      border: "none",
                      display: "block",
                      transform: "scale(0.75)",
                      transformOrigin: "top left",
                      background: "#ffffff",
                    }}
                  />
                ) : (
                  <iframe
                    title={selectedDocument.title}
                    src={viewerSrc}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      display: "block",
                      background: "#ffffff",
                    }}
                  />
                )}
              </div>
            ) : (
              <div
                style={{
                  border: "1px solid #d8e7f1",
                  padding: "36px",
                  background: "#ffffff",
                }}
              >
                <h3
                  style={{
                    fontSize: "24px",
                    marginBottom: "12px",
                  }}
                >
                  Excel preview needs the live site URL.
                </h3>

                <p
                  style={{
                    color: "#40566b",
                    lineHeight: "1.6",
                    maxWidth: "760px",
                    marginBottom: "20px",
                  }}
                >
                  Excel files need the deployed website URL to be available to
                  Microsoft’s viewer. In Vercel, set NEXT_PUBLIC_SITE_URL to
                  your live domain, then redeploy.
                </p>

                <a
                  href={selectedDocument.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    border: "1px solid #111",
                    padding: "11px 16px",
                    fontSize: "13px",
                    color: "#111",
                    textDecoration: "none",
                  }}
                >
                  Open File Directly
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      <section
        className="documents-section"
        style={
          selectedDocument
            ? {
                paddingTop: "42px",
              }
            : undefined
        }
      >
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
                    {section.documents.map((doc) => {
                      const isSelected = selectedDocument?.id === doc.id;

                      return (
                        <li key={doc.id}>
                          <a
                            href={getDocumentPageHref(doc)}
                            style={
                              isSelected
                                ? {
                                    background: "#f2f8fc",
                                    borderColor: "#004b78",
                                  }
                                : undefined
                            }
                          >
                            <span>{doc.title}</span>
                            <em>{getDocumentLabel(doc)}</em>
                          </a>
                        </li>
                      );
                    })}
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