import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";
import { loadDataset } from "./lib/load-data";
import { isApprovedFinancingDomain } from "./lib/validate-dataset";

type CsvRow = Record<string, string>;
type Change = {
  id: string;
  fields?: Record<string, { before: string; after: string }>;
};

function parseRows(raw: string): CsvRow[] {
  return parse(raw.replace(/^\uFEFF/, ""), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];
}

function previousFile(path: string): string | null {
  try {
    return execFileSync("git", ["show", `HEAD:${path}`], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

function diffRows(current: CsvRow[], previous: CsvRow[], idField: string) {
  const currentById = new Map(current.map((row) => [row[idField]!, row]));
  const previousById = new Map(previous.map((row) => [row[idField]!, row]));
  const added: Change[] = [];
  const removed: Change[] = [];
  const modified: Change[] = [];

  for (const [id, row] of currentById) {
    const before = previousById.get(id);
    if (!before) {
      added.push({ id });
      continue;
    }
    const fields: Change["fields"] = {};
    for (const key of new Set([...Object.keys(row), ...Object.keys(before)])) {
      if ((row[key] ?? "") !== (before[key] ?? "")) {
        fields[key] = { before: before[key] ?? "", after: row[key] ?? "" };
      }
    }
    if (Object.keys(fields).length > 0) modified.push({ id, fields });
  }
  for (const id of previousById.keys()) {
    if (!currentById.has(id)) removed.push({ id });
  }
  return { added, removed, modified };
}

const dataset = loadDataset();
const currentRecordsRaw = readFileSync("data/financing_records.csv", "utf8");
const previousRecordsRaw = previousFile("data/financing_records.csv");
const recordChanges = diffRows(
  parseRows(currentRecordsRaw),
  previousRecordsRaw ? parseRows(previousRecordsRaw) : [],
  "record_id",
);
const currentSourcesRaw = readFileSync("data/sources.csv", "utf8");
const previousSourcesRaw = previousFile("data/sources.csv");
const sourceChanges = diffRows(
  parseRows(currentSourcesRaw),
  previousSourcesRaw ? parseRows(previousSourcesRaw) : [],
  "source_id",
);

const ambiguousRecords = dataset.financingRecords
  .filter((record) => {
    const source = dataset.sources.find((item) => item.source_id === record.source_id);
    return source?.verification_status !== "verified";
  })
  .map((record) => record.record_id);

const rejectedUnofficial = dataset.sources
  .filter(
    (source) => source.authority === "reference_only" || !isApprovedFinancingDomain(source.url),
  )
  .map((source) => ({
    sourceId: source.source_id,
    reasonHe:
      source.authority === "reference_only"
        ? "מקור עזר שאינו מורשה לרשומת מימון"
        : "הדומיין אינו ברשימת ההרשאה למימון",
  }));

let brokenLinks: string[] = [];
try {
  const linkReport = JSON.parse(readFileSync(join("reports", "link-check.json"), "utf8")) as {
    results: { sourceId: string; state: string }[];
  };
  brokenLinks = linkReport.results
    .filter(
      (result) => !["available", "redirected", "manual_check_required"].includes(result.state),
    )
    .map((result) => result.sourceId);
} catch {
  brokenLinks = [];
}

const now = new Date().toISOString();
const report = {
  generatedAt: now,
  datasetVersion: dataset.release.version,
  records: recordChanges,
  sources: sourceChanges,
  changedAmounts: recordChanges.modified
    .filter((change) => change.fields?.amount_agorot)
    .map((change) => ({ id: change.id, ...change.fields!.amount_agorot })),
  changedSourceUrls: sourceChanges.modified
    .filter((change) => change.fields?.url)
    .map((change) => ({ id: change.id, ...change.fields!.url })),
  brokenLinks,
  ambiguousRecords,
  rejectedUnofficial,
};

const date = now.slice(0, 10);
const reportsDir = join("docs", "reports");
mkdirSync(reportsDir, { recursive: true });
writeFileSync(
  join(reportsDir, `data-refresh-${date}.json`),
  `${JSON.stringify(report, null, 2)}\n`,
);

const hebrew = [
  `# דוח ריענון נתונים — ${date}`,
  "",
  `נוצר: ${now}`,
  "",
  `גרסת נתונים: ${dataset.release.version}`,
  "",
  "## סיכום",
  "",
  `- רשומות חדשות: ${recordChanges.added.length}`,
  `- רשומות ששונו: ${recordChanges.modified.length}`,
  `- רשומות שהוסרו או הוחלפו: ${recordChanges.removed.length}`,
  `- סכומים ששונו: ${report.changedAmounts.length}`,
  `- כתובות מקור ששונו: ${report.changedSourceUrls.length}`,
  `- קישורים הדורשים בדיקה: ${brokenLinks.length}`,
  `- רשומות עמומות לבדיקת בעלים: ${ambiguousRecords.length}`,
  `- מקורות שנדחו כמקורות מימון: ${rejectedUnofficial.length}`,
  "",
  "אין לפרסם רשומה עמומה או מקור לא־רשמי לפני בדיקת בעל הפרויקט.",
  "",
];
writeFileSync(join(reportsDir, `data-refresh-${date}.he.md`), hebrew.join("\n"));

console.log(`Refresh report written for ${date}.`);
