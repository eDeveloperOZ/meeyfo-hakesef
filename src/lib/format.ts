export function formatAgorot(amountAgorot: number): string {
  if (!Number.isSafeInteger(amountAgorot)) {
    throw new Error("Money values must be safe integer agorot");
  }
  const amountShekels = amountAgorot / 100;
  const fractionDigits = amountAgorot % 100 === 0 ? 0 : 2;
  const formatted = new Intl.NumberFormat("he-IL", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amountShekels);
  return `\u200F${formatted}\u00A0₪`;
}

export function formatHebrewDate(date: string): string {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "long",
    timeZone: "Asia/Jerusalem",
  }).format(new Date(`${date}T12:00:00Z`));
}

export function formatHebrewDateTime(dateTime: string): string {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Jerusalem",
  }).format(new Date(dateTime));
}
