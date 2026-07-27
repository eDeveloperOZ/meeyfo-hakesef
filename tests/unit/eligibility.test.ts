import { describe, expect, it } from "vitest";
import { isPartyEligible } from "../../src/lib/eligibility";

describe("party eligibility", () => {
  it.each([
    [
      {
        representedInCurrentKnesset: true,
        nationwidePollAppearancesInRolling30Days: 0,
        ownerException: false,
      },
      true,
    ],
    [
      {
        representedInCurrentKnesset: false,
        nationwidePollAppearancesInRolling30Days: 2,
        ownerException: false,
      },
      true,
    ],
    [
      {
        representedInCurrentKnesset: false,
        nationwidePollAppearancesInRolling30Days: 0,
        ownerException: true,
      },
      true,
    ],
    [
      {
        representedInCurrentKnesset: false,
        nationwidePollAppearancesInRolling30Days: 1,
        ownerException: false,
      },
      false,
    ],
  ])("applies the documented rule to %o", (input, expected) => {
    expect(isPartyEligible(input)).toBe(expected);
  });
});
