export type ElectionStatus = "scheduled" | "rescheduled" | "completed" | "cancelled";

export const election = {
  id: "knesset-26",
  knessetNumber: 26,
  displayNameHe: "הבחירות לכנסת ה-26",
  electionDate: "2026-10-27",
  electionDateTime: "2026-10-27T00:00:00+02:00",
  electionDateDisplayHe: "27.10.2026, ט״ז בחשוון תשפ״ז",
  timeZone: "Asia/Jerusalem",
  scopeStartDate: "2022-11-02",
  cycleStartDate: "2026-07-18",
  status: "scheduled" as ElectionStatus,
  source: {
    url: "https://www.gov.il/he/departments/dynamiccollectors/election-timeline26",
    title: "ציר הזמן לפעולות ועדת הבחירות המרכזית",
    authority: "ועדת הבחירות המרכזית לכנסת",
    lastVerified: "2026-07-27",
  },
  cycleSource: {
    url: "https://www.gov.il/apps/elections/elections-knesset-16/heb/laws/party_money.html",
    title: "חוק מימון מפלגות — הגדרת היום הקובע",
    authority: "מדינת ישראל",
    lastVerified: "2026-07-27",
    noteHe: "בבחירות במועדן היום הקובע הוא היום ה־101 שלפני יום הבחירות.",
  },
  scopeSource: {
    url: "https://statements-p.mevaker.gov.il/publisher?electionType=Parties",
    title: "מערכת פרסום תרומות, ערבויות והלוואות של מפלגות",
    authority: "מבקר המדינה",
    lastVerified: "2026-07-27",
    noteHe: "טווח התצוגה מתחיל ביום שלאחר הבחירות לכנסת ה־25.",
  },
} as const;

export type ElectionConfig = typeof election;
