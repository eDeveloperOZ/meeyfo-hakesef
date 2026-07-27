import { describe, expect, it } from "vitest";
import { classifyHttpStatus } from "../../scripts/lib/link-state";

describe("link-check HTTP states", () => {
  it.each([401, 403, 429])("classifies %i as an automated-access block", (status) => {
    expect(classifyHttpStatus(status)).toBe("blocked_bot");
  });

  it.each([199, 227, 247, 500])("classifies %i as an unexpected status", (status) => {
    expect(classifyHttpStatus(status)).toBe("unexpected_status");
  });

  it.each([200, 206, 226])("accepts ordinary successful status %i", (status) => {
    expect(classifyHttpStatus(status)).toBeUndefined();
  });
});
