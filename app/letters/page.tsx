import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

type LetterFile = {
  id: string;
  title: string;
  type: string;
  href: string;
  extension: string;
};

type LetterSection = {
  title: string;
  folder: string;
  letters: LetterFile[];
};

const sections = [
  {
    title: "Quarterly letters",
    folder: "quarterly",
  },
  {
    title: "Annual letters",
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
    .trim();
}

function formatType(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();

  if (extension === ".pdf") return "PDF";
  if (extension === ".docx") return "Word";

  return extension.replace(".", "").toUpperCase();
}

function createLetterId(folder: string, fileName: string) {
  return `${folder}-${fileName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function getLettersFromFolder(folder: string): LetterFile[] {
  const folderPath = path.join(process.cwd(), "public", "reports", folder);

  if (!fs.existsSync(folderPath)) return [];

  return fs
    .readdirSync(folderPath)
    .filter((fileName) => {
      const filePath = path.join(folderPath, fileName);
      const extension = path.extname(fileName).toLowerCase();

      return (
        fs.statSync(filePath).isFile() && allowedExtensions.includes(extension)
      );
    })
    .sort((a, b) => b.localeCompare(a))
    .map((fileName) => {
      const extension = path.extname(fileName).toLowerCase();
      const href = `/reports/${folder}/${encodeURIComponent(fileName)}`;

      return {
        id: createLetterId(folder, fileName),
        title: formatTitle(fileName),
        type: formatType(fileName),
        extension,
        href,
      };
    });
}

function getLetterSections(): LetterSection[] {
  return sections.map((section) => ({
    ...section,
    letters: getLettersFromFolder(section.folder),
  }));
}

function getLetterLabel(letter: LetterFile) {
  if (letter.type === "Word") return "View Word";
  if (letter.type === "PDF") return "View PDF";

  return `View ${letter.type}`;
}

export default function LettersPage() {
  const letterSections = getLetterSections();

  return (
    <main>
      <section className="page-hero">
        <div className="section-shell">
          <h1>Letters</h1>
        </div>
      </section>

      <section className="content-section">
        <div className="section-shell">
          <div className="letter-sections">
            {letterSections.map((section) => (
              <section key={section.title} className="letter-section">
                <h2>{section.title}</h2>

                {section.letters.length > 0 ? (
                  <table className="letter-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Format</th>
                        <th>File</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.letters.map((letter) => (
                        <tr key={letter.id}>
                          <td>{letter.title}</td>
                          <td>{letter.type}</td>
                          <td>
                            <a
                              href={letter.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {getLetterLabel(letter)}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No letters uploaded in this section yet.</p>
                )}
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
