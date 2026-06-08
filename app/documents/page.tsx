import fs from "fs";
import path from "path";
import Image from "next/image";

export const dynamic = "force-dynamic";

type DocumentFile = {
  id: string;
  title: string;
  type: string;
  href: string;
  extension: string;
  sectionTitle: string;
  folder: string;
  fileName: string;
};

type DocumentSection = {
  title: string;
  description: string;
  folder: string;
  documents: DocumentFile[];
};

type CurrentView = "QA Failed" | "Under Review" | "Watchlist";

type ValuationStatus = "Published Sample" | "Internal Only" | "Not Started";

type ResearchRow = {
  companyName: string;
  key: string;
  summary?: DocumentFile;
  assessment?: DocumentFile;
  valuation?: DocumentFile;
  valuationStatus: ValuationStatus;
  currentView: CurrentView;
};

type SearchParams =
  | Promise<{
      document?: string;
      page?: string;
    }>
  | {
      document?: string;
      page?: string;
    };

const RESEARCH_STATS = {
  initialScreenedCompanies: 541,
};

const PUBLIC_VALUATION_COMPANIES = [
  "Artesian Resources Corporation",
  "Build A Bear Workshop, Inc.",
  "Carriage Services, Inc.",
];

const MANUAL_CURRENT_VIEWS: Record<string, CurrentView> = {
  "Acorn Energy, Inc.": "QA Failed",

  "American Woodmark Corporation": "QA Failed",
  "Bassett Furniture Industries, Incorporated": "QA Failed",
  "BJ'S Restaurants, Inc.": "QA Failed",
  "Cracker Barrel Old Country Store, Inc.": "QA Failed",
  "Cricut, Inc.": "Under Review",
  "Good Times Restaurants Inc.": "QA Failed",
  "Hamilton Beach Brands Holding Company": "Under Review",
  "J. Jill, Inc.": "Under Review",
  "Barrett Business Services, Inc.": "Under Review",

  "Artesian Resources Corporation": "Watchlist",
  "Build A Bear Workshop, Inc.": "Watchlist",
  "Build-A-Bear Workshop, Inc.": "Watchlist",
  "Carriage Services, Inc.": "Watchlist",
  "Helen Of Troy Limited": "Watchlist",
  "Helen of Troy Limited": "Watchlist",
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
      "Selected valuation samples. Active models, strike prices, and buy-zone assumptions are generally maintained privately.",
    folder: "valuation-models",
  },
];

const allowedExtensions = [".pdf", ".xlsx", ".xls", ".xlsm", ".csv", ".docx"];

const ROWS_PER_PAGE = 10;

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

  if (extension === "XLSX" || extension === "XLS" || extension === "XLSM")
    return "Excel";
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
        folder,
        fileName,
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
    doc.extension === ".xlsm" ||
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

function getShortDocumentLabel(doc: DocumentFile) {
  if (doc.type === "Excel") return "Excel";
  if (doc.type === "Word") return "Word";
  if (doc.type === "PDF") return "PDF";
  if (doc.type === "CSV") return "CSV";

  return doc.type;
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

function getResearchPageHref(page: number) {
  return `/documents?page=${page}#research-index`;
}

function normalizeKey(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\bbj's\b/g, "bjs")
    .replace(/\bbj s\b/g, "bjs")
    .replace(/\bincorporated\b/g, "inc")
    .replace(/\bcorporation\b/g, "corp")
    .replace(/\bcompany\b/g, "co")
    .replace(/\blimited\b/g, "ltd")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function cleanCompanyNameFromTitle(title: string) {
  return title
    .replace(/^Financial Summary\s+/i, "")
    .replace(/^Qualitative Assessment\s+/i, "")
    .replace(/^Valuation Model\s+/i, "")
    .replace(/^Valuation\s+/i, "")
    .replace(/\s+Valuation Model$/i, "")
    .replace(/\s+Valuation$/i, "")
    .replace(/\s+\(Old\)$/i, "")
    .replace(/\s+Old$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isCompanyResearchDoc(doc: DocumentFile) {
  return (
    doc.folder === "financial-summaries" ||
    doc.folder === "qualitative-assessments" ||
    doc.folder === "valuation-models"
  );
}

function isValuationTemplate(doc: DocumentFile) {
  const title = doc.title.toLowerCase();
  const fileName = doc.fileName.toLowerCase();

  return (
    title.includes("template") ||
    title.includes("instructions") ||
    title.includes("sample blank") ||
    fileName.includes("template") ||
    fileName.includes("instructions")
  );
}

function isPublishedValuationCompany(companyName: string) {
  const companyKey = normalizeKey(companyName);

  return PUBLIC_VALUATION_COMPANIES.some(
    (publicCompany) => normalizeKey(publicCompany) === companyKey
  );
}

function shouldShowDocumentInSectionList(doc: DocumentFile) {
  if (doc.folder !== "valuation-models") {
    return true;
  }

  if (isValuationTemplate(doc)) {
    return true;
  }

  const companyName = cleanCompanyNameFromTitle(doc.title);

  return isPublishedValuationCompany(companyName);
}

function getManualCurrentView(companyName: string) {
  const key = normalizeKey(companyName);

  const matchingEntry = Object.entries(MANUAL_CURRENT_VIEWS).find(
    ([company]) => normalizeKey(company) === key
  );

  return matchingEntry?.[1] ?? null;
}

function getAutomaticCurrentView(row: {
  companyName: string;
  summary?: DocumentFile;
  assessment?: DocumentFile;
  valuation?: DocumentFile;
}): CurrentView {
  const manualView = getManualCurrentView(row.companyName);

  if (manualView) {
    return manualView;
  }

  if (row.valuation) {
    return "Watchlist";
  }

  return "Under Review";
}

function getResearchRows(allDocuments: DocumentFile[]): ResearchRow[] {
  const companies = new Map<
    string,
    {
      companyName: string;
      summary?: DocumentFile;
      assessment?: DocumentFile;
      valuation?: DocumentFile;
    }
  >();

  allDocuments.filter(isCompanyResearchDoc).forEach((doc) => {
    if (doc.folder === "valuation-models" && isValuationTemplate(doc)) {
      return;
    }

    const companyName = cleanCompanyNameFromTitle(doc.title);
    const key = normalizeKey(companyName);

    if (!companies.has(key)) {
      companies.set(key, {
        companyName,
      });
    }

    const row = companies.get(key);

    if (!row) {
      return;
    }

    if (doc.folder === "financial-summaries") {
      row.summary = doc;
    }

    if (doc.folder === "qualitative-assessments") {
      row.assessment = doc;
    }

    if (doc.folder === "valuation-models") {
      row.valuation = doc;
    }
  });

  return Array.from(companies.entries())
    .map(([key, row]) => {
      let valuationStatus: ValuationStatus = "Not Started";

      if (row.valuation) {
        valuationStatus = isPublishedValuationCompany(row.companyName)
          ? "Published Sample"
          : "Internal Only";
      }

      return {
        key,
        companyName: row.companyName,
        summary: row.summary,
        assessment: row.assessment,
        valuation: row.valuation,
        valuationStatus,
        currentView: getAutomaticCurrentView(row),
      };
    })
    .sort((a, b) => a.companyName.localeCompare(b.companyName));
}

function getVisibleSectionDocuments(section: DocumentSection) {
  return section.documents.filter(shouldShowDocumentInSectionList);
}

function getStatusBadgeStyles(status: ValuationStatus) {
  if (status === "Published Sample") {
    return {
      background: "#edf7f1",
      color: "#1f6f43",
      border: "1px solid #b9dbc6",
    };
  }

  if (status === "Internal Only") {
    return {
      background: "#f4f7fa",
      color: "#40566b",
      border: "1px solid #d8e7f1",
    };
  }

  return {
    background: "#fbfbfb",
    color: "#8a98a6",
    border: "1px solid #e6edf2",
  };
}

function getViewBadgeStyles(view: CurrentView) {
  if (view === "Watchlist") {
    return {
      background: "#eef5ff",
      color: "#004b78",
      border: "1px solid #c9dff0",
    };
  }

  if (view === "QA Failed") {
    return {
      background: "#fff4f1",
      color: "#9b3b21",
      border: "1px solid #edc7bb",
    };
  }

  return {
    background: "#fff9ec",
    color: "#7c5b14",
    border: "1px solid #ead9ac",
  };
}

function DocumentTableLink({ doc }: { doc?: DocumentFile }) {
  if (!doc) {
    return <span style={{ color: "#9aa8b5" }}>—</span>;
  }

  return (
    <a
      href={getDocumentPageHref(doc)}
      style={{
        color: "#111",
        textDecoration: "none",
        fontWeight: 600,
        borderBottom: "1px solid #a8b8c4",
      }}
    >
      {getShortDocumentLabel(doc)}
    </a>
  );
}

function ResearchPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Research index pagination"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        padding: "18px 16px",
        borderTop: "1px solid #edf2f6",
        borderBottom: "1px solid #edf2f6",
        background: "#ffffff",
      }}
    >
      {currentPage > 1 && (
        <a
          href={getResearchPageHref(currentPage - 1)}
          style={{
            marginRight: "10px",
            fontSize: "13px",
            color: "rgba(0, 75, 120, 0.58)",
            textDecoration: "none",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          Previous
        </a>
      )}

      {pages.map((page) => {
        const isActive = page === currentPage;

        return (
          <a
            key={page}
            href={getResearchPageHref(page)}
            aria-current={isActive ? "page" : undefined}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "28px",
              height: "30px",
              padding: "0 8px",
              color: isActive ? "#111" : "#004b78",
              background: isActive ? "#fbfdff" : "transparent",
              border: isActive ? "1px solid #d8e7f1" : "1px solid transparent",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: isActive ? 700 : 500,
            }}
          >
            {page}
          </a>
        );
      })}

      {currentPage < totalPages && (
        <a
          href={getResearchPageHref(currentPage + 1)}
          style={{
            marginLeft: "10px",
            fontSize: "13px",
            color: "rgba(0, 75, 120, 0.58)",
            textDecoration: "none",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          Next
        </a>
      )}
    </nav>
  );
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

  const researchRows = getResearchRows(allDocuments);

  const totalPages = Math.max(1, Math.ceil(researchRows.length / ROWS_PER_PAGE));
  const requestedPage = Number(resolvedSearchParams?.page ?? "1");
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.min(Math.floor(requestedPage), totalPages)
      : 1;

  const pageStart = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedResearchRows = researchRows.slice(
    pageStart,
    pageStart + ROWS_PER_PAGE
  );

  const financialSummaryCount = researchRows.filter((row) => row.summary).length;
  const qualitativeAssessmentCount = researchRows.filter(
    (row) => row.assessment
  ).length;
  const valuationCompletedCount = researchRows.filter(
    (row) => row.valuation
  ).length;
  const publicValuationCount = researchRows.filter(
    (row) => row.valuationStatus === "Published Sample"
  ).length;

  return (
    <main>
      {!selectedDocument && (
        <section
          className="documents-hero"
          style={{
            padding: "72px 0 44px",
          }}
        >
          <div
            className="section-shell"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(340px, 0.9fr) minmax(420px, 0.95fr)",
              gap: "54px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                maxWidth: "620px",
              }}
            >
              <p className="eyebrow">Research Library</p>

              <h1>Documents</h1>

              <p
                style={{
                  maxWidth: "580px",
                }}
              >
                Research organized from first-pass screens to historical
                financial analysis, business quality reviews, and selected
                valuation samples.
              </p>
            </div>

            <div
              style={{
                width: "100%",
                maxWidth: "470px",
                marginLeft: "auto",
                border: "1px solid #d8e2e8",
                borderRadius: "24px",
                padding: "7px",
                background: "#ffffff",
                boxShadow: "0 22px 60px rgba(20, 40, 60, 0.08)",
              }}
            >
              <Image
                src="/images/research-process.png"
                alt="Investment research process diagram"
                width={1200}
                height={1200}
                priority
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  borderRadius: "18px",
                }}
              />
            </div>
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
        id="research-index"
        style={{
          padding: selectedDocument ? "42px 0 38px" : "40px 0 42px",
          borderBottom: "1px solid #d8e7f1",
          background: "#fbfdff",
          scrollMarginTop: "82px",
        }}
      >
        <div className="section-shell">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: "14px",
              marginBottom: "36px",
              alignItems: "stretch",
            }}
          >
            {[
              {
                label: "Initial Screens",
                value: RESEARCH_STATS.initialScreenedCompanies,
              },
              {
                label: "Financial Summaries",
                value: financialSummaryCount,
              },
              {
                label: "Qualitative Assessments",
                value: qualitativeAssessmentCount,
              },
              {
                label: "Valuations Completed",
                value: valuationCompletedCount,
              },
              {
                label: "Public Valuation Samples",
                value: publicValuationCount,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  border: "1px solid #d8e7f1",
                  background: "#ffffff",
                  padding: "20px 18px 18px",
                  minHeight: "112px",
                  boxShadow: "0 10px 30px rgba(20, 40, 60, 0.035)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    minHeight: "34px",
                    fontSize: "11px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#6b7c8f",
                    lineHeight: 1.35,
                  }}
                >
                  {stat.label}
                </p>

                <strong
                  style={{
                    display: "block",
                    fontSize: "34px",
                    lineHeight: 1,
                    marginTop: "14px",
                  }}
                >
                  {stat.value}
                </strong>
              </div>
            ))}
          </div>

          <div
            style={{
              marginBottom: "22px",
            }}
          >
            <div style={{ maxWidth: "760px" }}>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: "12px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#004b78",
                  fontWeight: 700,
                }}
              >
                Company-Level Research Database
              </p>

              <h2
                style={{
                  fontSize: "38px",
                  lineHeight: 1.05,
                  margin: "0 0 14px",
                }}
              >
                Research Index
              </h2>

              <p
                style={{
                  color: "#40566b",
                  lineHeight: "1.65",
                  maxWidth: "720px",
                  margin: 0,
                }}
              >
                A company-level view of the research library. Financial
                summaries and qualitative assessments are public where
                available. Most valuation work, including active models, strike
                prices, and buy-zone assumptions, is maintained privately.
              </p>
            </div>
          </div>

          <div
            style={{
              border: "1px solid #d8e7f1",
              background: "#ffffff",
              boxShadow: "0 18px 48px rgba(20, 40, 60, 0.06)",
            }}
          >
            <ResearchPagination
              currentPage={currentPage}
              totalPages={totalPages}
            />

            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "980px",
                }}
              >
                <thead>
                  <tr>
                    {[
                      "Company",
                      "Financial Summary",
                      "Qualitative Assessment",
                      "Valuation",
                      "Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          textAlign: "left",
                          padding: "15px 18px",
                          borderBottom: "1px solid #d8e7f1",
                          fontSize: "12px",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#40566b",
                          background: "#fbfdff",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginatedResearchRows.map((row) => (
                    <tr key={row.key}>
                      <td
                        style={{
                          padding: "16px 18px",
                          borderBottom: "1px solid #edf2f6",
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "#111",
                          minWidth: "310px",
                        }}
                      >
                        {row.companyName}
                      </td>

                      <td
                        style={{
                          padding: "16px 18px",
                          borderBottom: "1px solid #edf2f6",
                          fontSize: "14px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <DocumentTableLink doc={row.summary} />
                      </td>

                      <td
                        style={{
                          padding: "16px 18px",
                          borderBottom: "1px solid #edf2f6",
                          fontSize: "14px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <DocumentTableLink doc={row.assessment} />
                      </td>

                      <td
                        style={{
                          padding: "16px 18px",
                          borderBottom: "1px solid #edf2f6",
                          fontSize: "14px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.valuationStatus === "Published Sample" &&
                        row.valuation ? (
                          <a
                            href={getDocumentPageHref(row.valuation)}
                            style={{
                              display: "inline-block",
                              padding: "6px 10px",
                              borderRadius: "999px",
                              textDecoration: "none",
                              fontSize: "12px",
                              fontWeight: 700,
                              ...getStatusBadgeStyles(row.valuationStatus),
                            }}
                          >
                            Published Sample
                          </a>
                        ) : (
                          <span
                            style={{
                              display: "inline-block",
                              padding: "6px 10px",
                              borderRadius: "999px",
                              fontSize: "12px",
                              fontWeight: 700,
                              ...getStatusBadgeStyles(row.valuationStatus),
                            }}
                          >
                            {row.valuationStatus}
                          </span>
                        )}
                      </td>

                      <td
                        style={{
                          padding: "16px 18px",
                          borderBottom: "1px solid #edf2f6",
                          fontSize: "14px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "6px 10px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: 700,
                            ...getViewBadgeStyles(row.currentView),
                          }}
                        >
                          {row.currentView}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ResearchPagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "54px 0 70px",
          background: "#ffffff",
        }}
      >
        <div className="section-shell">
          <div
            style={{
              border: "1px solid #d8e7f1",
              borderRadius: "26px",
              background: "#ffffff",
              overflow: "hidden",
              boxShadow: "0 24px 70px rgba(20, 40, 60, 0.07)",
            }}
          >
            <div
              style={{
                padding: "34px 38px 32px",
                borderBottom: "1px solid #d8e7f1",
                background:
                  "linear-gradient(180deg, #fbfdff 0%, #ffffff 100%)",
              }}
            >
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: "12px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#004b78",
                  fontWeight: 700,
                }}
              >
                Full Document Lists
              </p>

              <h2
                style={{
                  fontSize: "34px",
                  lineHeight: 1.08,
                  margin: "0 0 12px",
                }}
              >
                Browse by Document Type
              </h2>

              <p
                style={{
                  color: "#40566b",
                  lineHeight: "1.65",
                  maxWidth: "760px",
                  margin: 0,
                }}
              >
                These sections are collapsed by default so the company-level
                Research Index remains the primary way to navigate the library.
              </p>
            </div>

            <div>
              {documentSections.map((section) => {
                const visibleDocuments = getVisibleSectionDocuments(section);

                return (
                  <details
                    key={section.title}
                    style={{
                      borderBottom: "1px solid #d8e7f1",
                      background: "#ffffff",
                    }}
                  >
                    <summary
                      style={{
                        listStyle: "none",
                        cursor: "pointer",
                        display: "grid",
                        gridTemplateColumns: "minmax(360px, 1fr) auto",
                        gap: "28px",
                        alignItems: "center",
                        padding: "30px 38px",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: "25px",
                            lineHeight: 1.1,
                            margin: "0 0 8px",
                          }}
                        >
                          {section.title}
                        </h3>

                        <p
                          style={{
                            margin: 0,
                            color: "#40566b",
                            lineHeight: "1.55",
                            maxWidth: "620px",
                          }}
                        >
                          {section.description}
                        </p>
                      </div>

                      <span
                        className="details-button"
                        style={{
                          justifySelf: "end",
                          border: "1px solid #111",
                          padding: "10px 15px",
                          minWidth: "108px",
                          textAlign: "center",
                          fontSize: "12px",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          background: "#ffffff",
                          color: "#111",
                        }}
                      >
                        <span className="button-expand">Expand</span>
                        <span className="button-collapse">Collapse</span>
                      </span>
                    </summary>

                    <div
                      style={{
                        padding: "0 38px 34px",
                      }}
                    >
                      <div
                        style={{
                          borderTop: "1px solid #edf2f6",
                          paddingTop: "22px",
                        }}
                      >
                        <div className="documents-links">
                          {visibleDocuments.length > 0 ? (
                            <ul>
                              {visibleDocuments.map((doc) => {
                                const isSelected =
                                  selectedDocument?.id === doc.id;

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
                              No public documents uploaded in this section yet.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>

            <style>{`
              details > summary::-webkit-details-marker {
                display: none;
              }

              .button-collapse {
                display: none;
              }

              details[open] .button-expand {
                display: none;
              }

              details[open] .button-collapse {
                display: inline;
              }

              details[open] .details-button {
                color: #ffffff !important;
                background: #111111 !important;
              }

              details[open] > summary {
                background: #fbfdff;
                box-shadow: inset 0 0 0 1px #d8e7f1;
              }

              details:hover > summary {
                background: #fbfdff;
              }
            `}</style>
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