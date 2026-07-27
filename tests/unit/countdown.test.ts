import { describe, expect, it } from "vitest";
import { election } from "../../config/election";
import { calculateCountdown, countdownStorageKey } from "../../src/lib/countdown";

describe("countdown", () => {
  it("derives time from the central election configuration", () => {
    const target = new Date(election.electionDateTime);
    const now = new Date(target.getTime() - (2 * 24 * 60 + 3 * 60 + 4) * 60_000);
    expect(calculateCountdown(election, now)).toEqual({
      days: 2,
      hours: 3,
      minutes: 4,
      completed: false,
    });
  });

  it("stops at zero and keys dismissal by election date", () => {
    expect(calculateCountdown(election, new Date("2027-01-01T00:00:00Z"))).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      completed: true,
    });
    expect(countdownStorageKey(election)).toContain(election.electionDate);
  });
});
