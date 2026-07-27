import { describe, expect, it } from "vitest";
import { csvContracts } from "../../scripts/lib/load-data";
import {
  isApprovedFinancingDomain,
  validateHeaderPrivacy,
} from "../../scripts/lib/validate-dataset";

describe("source allowlist and privacy", () => {
  it.each([
    ["https://www.mevaker.gov.il/a", true],
    ["https://main.knesset.gov.il/a", true],
    ["https://www.gov.il/a", true],
    ["https://maya.tase.co.il/a", true],
    ["https://news.example/a", false],
    ["https://mevaker.gov.il.example.com/a", false],
  ])("classifies %s", (url, expected) => {
    expect(isApprovedFinancingDomain(url)).toBe(expected);
  });

  it("keeps private fields out of every canonical CSV contract", () => {
    expect(validateHeaderPrivacy(csvContracts)).toEqual([]);
  });
});
