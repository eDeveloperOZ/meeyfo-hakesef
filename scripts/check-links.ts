import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadDataset } from "./lib/load-data";

type LinkState =
  | "available"
  | "redirected"
  | "unreachable"
  | "robots_disallowed"
  | "robots_unknown"
  | "manual_check_required"
  | "hash_mismatch";

type LinkResult = {
  sourceId: string;
  url: string;
  state: LinkState;
  status?: number;
  redirectTarget?: string;
  contentType?: string;
  contentSha256?: string;
  noteHe: string;
};

const dataset = loadDataset();
const timeoutMs = 15_000;
const userAgent = "MeEyfoHaKesefLinkChecker/1.0 (+https://github.com/eDeveloperOZ/meeyfo-hakesef)";
const manualOnlyHosts = new Set([
  "mevaker.gov.il",
  "www.mevaker.gov.il",
  "statements-p.mevaker.gov.il",
  "mayafiles.tase.co.il",
]);

function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function robotsAllows(robots: string, path: string): boolean {
  const lines = robots
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*$/, "").trim())
    .filter(Boolean);
  let applies = false;
  const disallowed: string[] = [];
  for (const line of lines) {
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey?.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") {
      applies = value === "*";
    } else if (applies && key === "disallow" && value) {
      disallowed.push(value);
    }
  }
  return !disallowed.some((rule) => path.startsWith(rule));
}

async function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": userAgent,
        accept: "text/html,application/pdf,application/json;q=0.9,*/*;q=0.5",
        ...init.headers,
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function checkSource(source: (typeof dataset.sources)[number]): Promise<LinkResult> {
  const url = new URL(source.url);
  if (manualOnlyHosts.has(url.hostname.toLowerCase())) {
    return {
      sourceId: source.source_id,
      url: source.url,
      state: "manual_check_required",
      noteHe:
        "המקור נבדק ידנית דרך הממשק הציבורי; לפי רישום התאימות של המארח לא בוצעה בקשת מסמך אוטומטית.",
    };
  }
  let robotsText: string;
  try {
    const robotsResponse = await fetchWithTimeout(`${url.origin}/robots.txt`);
    if (robotsResponse.status === 404) {
      robotsText = "";
    } else if (!robotsResponse.ok) {
      return {
        sourceId: source.source_id,
        url: source.url,
        state: "robots_unknown",
        status: robotsResponse.status,
        noteHe: "לא ניתן לאשר את כללי הגישה האוטומטית; המקור לא נבדק.",
      };
    } else {
      robotsText = await robotsResponse.text();
    }
  } catch {
    return {
      sourceId: source.source_id,
      url: source.url,
      state: "robots_unknown",
      noteHe: "קובץ robots.txt לא היה זמין; המקור לא נבדק.",
    };
  }

  if (!robotsAllows(robotsText, url.pathname)) {
    return {
      sourceId: source.source_id,
      url: source.url,
      state: "robots_disallowed",
      noteHe: "כללי robots.txt אינם מאפשרים בדיקה אוטומטית של הנתיב.",
    };
  }

  try {
    const response = await fetchWithTimeout(source.url);
    const bytes = Buffer.from(await response.arrayBuffer());
    const finalUrl = response.url || source.url;
    const hash = createHash("sha256").update(bytes).digest("hex");
    const redirected = finalUrl !== source.url;
    const hashMismatch = Boolean(source.content_sha256 && source.content_sha256 !== hash);
    return {
      sourceId: source.source_id,
      url: source.url,
      state: hashMismatch ? "hash_mismatch" : redirected ? "redirected" : "available",
      status: response.status,
      redirectTarget: redirected ? finalUrl : undefined,
      contentType: response.headers.get("content-type") ?? undefined,
      contentSha256: hash,
      noteHe: response.ok
        ? "הכתובת והמסמך זמינים. הבדיקה אינה מוכיחה תמיכה סמנטית בטענה."
        : "השרת החזיר שגיאה.",
    };
  } catch (error) {
    return {
      sourceId: source.source_id,
      url: source.url,
      state: "unreachable",
      noteHe: error instanceof Error ? `הבדיקה נכשלה: ${error.name}` : "הבדיקה נכשלה.",
    };
  }
}

async function main(): Promise<void> {
  const results: LinkResult[] = [];
  for (const source of dataset.sources) {
    results.push(await checkSource(source));
    await sleep(250);
  }

  const reportsDir = join(process.cwd(), "reports");
  mkdirSync(reportsDir, { recursive: true });
  const report = {
    checkedAt: new Date().toISOString(),
    semanticVerificationPerformed: false,
    results,
  };
  writeFileSync(join(reportsDir, "link-check.json"), `${JSON.stringify(report, null, 2)}\n`);
  const lines = [
    "# דוח בדיקת קישורים",
    "",
    `נבדק: ${report.checkedAt}`,
    "",
    "הבדיקה מכסה זמינות כתובת ואחזור מסמך בלבד. היא אינה אימות סמנטי.",
    "",
    ...results.map(
      (result) =>
        `- **${result.sourceId}** — ${result.state}${result.status ? ` (${result.status})` : ""}: ${result.noteHe}`,
    ),
    "",
  ];
  writeFileSync(join(reportsDir, "link-check.he.md"), lines.join("\n"));

  const failures = results.filter((result) => {
    const source = dataset.sources.find((item) => item.source_id === result.sourceId)!;
    return (
      source.verification_status === "verified" &&
      !["available", "redirected", "manual_check_required"].includes(result.state)
    );
  });

  console.log(
    `Checked ${results.length} sources: ${results.length - failures.length} usable, ${failures.length} requiring review.`,
  );
  if (failures.length > 0) process.exit(1);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
