export type HttpLinkState = "blocked_bot" | "unexpected_status";

const botBlockStatuses = new Set([401, 403, 429]);

export function classifyHttpStatus(status: number): HttpLinkState | undefined {
  if (botBlockStatuses.has(status)) return "blocked_bot";
  if (status < 200 || status > 226) return "unexpected_status";
  return undefined;
}
