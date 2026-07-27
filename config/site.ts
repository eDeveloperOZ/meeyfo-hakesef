const analyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";

export const siteConfig = {
  nameHe: "מאיפה הכסף",
  taglineHe: "לפני שבוחרים, בודקים מאיפה מגיע הכסף.",
  descriptionHe:
    "מידע רשמי ונגיש על מקורות המימון המדווחים של מפלגות בישראל לקראת הבחירות לכנסת ה־26.",
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/eDeveloperOZ/meeyfo-hakesef",
  xUrl: process.env.NEXT_PUBLIC_X_URL ?? "https://x.com/0fir0z",
  canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  analyticsEnabled,
  partyLogosEnabled: false,
  contactPolicyHe: "פניות ציבור מתקבלות באמצעות GitHub ובפרופיל X בלבד.",
} as const;
