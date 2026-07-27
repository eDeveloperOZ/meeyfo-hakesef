import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const forbiddenPatterns: { label: string; pattern: RegExp }[] = [
  { label: "טייקון", pattern: /טייקו(?:ן|נים)/g },
  { label: "אוליגרך", pattern: /אוליגר(?:ך|כים)/g },
  { label: "מקורבים", pattern: /מקורב(?:ים|ות)?\s+ל[־-]?/g },
  { label: "שולט ב", pattern: /שולט(?:ת|ים|ות)?\s+ב[־-]?/g },
  { label: "איש של", pattern: /איש\s+של[־-]?/g },
  { label: "בעלי אינטרסים", pattern: /בעל(?:י|ת)?\s+אינטרסים/g },
  { label: "מממן את", pattern: /מממנ(?:ת|ים|ות)?\s+את/g },
  { label: "מממן את הנציגים", pattern: /מממנ\p{L}*\s+את\s+הנציגים/gu },
  { label: "קניית השפעה", pattern: /(?:קונה|קניית|קנייתה)\s+השפעה/g },
  { label: "שחיתות כקביעה", pattern: /(?:מושחת|מושחתת|שחיתות\s+של)/g },
  { label: "דירוג מוסרי", pattern: /(?:המפלגה\s+הנקייה|המפלגה\s+המושחתת)/g },
];

const scannedExtensions = new Set([".ts", ".tsx", ".md", ".mdx", ".csv", ".json"]);
const roots = ["content", "src", "data"];
const ignoredSegments = new Set(["generated"]);

function collectFiles(directory: string): string[] {
  try {
    return readdirSync(directory).flatMap((name) => {
      const path = join(directory, name);
      if (ignoredSegments.has(name)) return [];
      const stats = statSync(path);
      return stats.isDirectory()
        ? collectFiles(path)
        : scannedExtensions.has(extname(path))
          ? [path]
          : [];
    });
  } catch {
    return [];
  }
}

const violations: string[] = [];
for (const file of roots.flatMap(collectFiles)) {
  const content = readFileSync(file, "utf8");
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const item of forbiddenPatterns) {
      item.pattern.lastIndex = 0;
      if (item.pattern.test(line)) {
        violations.push(`${relative(process.cwd(), file)}:${index + 1}: ${item.label}`);
      }
    }
  });
}

if (violations.length > 0) {
  console.error("Neutrality lint failed:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log("Neutrality lint passed.");
