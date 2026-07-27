import { describe, expect, it } from "vitest";
import { formatAgorot } from "../../src/lib/format";

describe("formatAgorot", () => {
  it("formats whole shekels and agorot without floating-point storage", () => {
    expect(formatAgorot(1_234_00)).toContain("1,234");
    expect(formatAgorot(1_234_56)).toContain("1,234.56");
    expect(formatAgorot(1_234_56).startsWith("₪")).toBe(true);
  });

  it("rejects unsafe integers", () => {
    expect(() => formatAgorot(Number.MAX_SAFE_INTEGER + 1)).toThrow();
  });
});
