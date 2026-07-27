import { describe, expect, it } from "vitest";
import { loadDataset } from "../../scripts/lib/load-data";

function rgbDistance(first: string, second: string) {
  const channels = (color: string) =>
    [1, 3, 5].map((index) => Number.parseInt(color.slice(index, index + 2), 16));
  const firstChannels = channels(first);
  const secondChannels = channels(second);
  return Math.hypot(...firstChannels.map((channel, index) => channel - secondChannels[index]));
}

describe("party identity system", () => {
  const parties = loadDataset().parties;

  it("assigns every party a unique two- or three-letter Hebrew mark", () => {
    const marks = parties.map((party) => party.mark_he);
    expect(new Set(marks).size).toBe(marks.length);
    expect(marks.every((mark) => mark.length >= 2 && mark.length <= 3)).toBe(true);
  });

  it("keeps documented party colors visibly distinct", () => {
    for (let first = 0; first < parties.length; first += 1) {
      for (let second = first + 1; second < parties.length; second += 1) {
        expect(
          rgbDistance(parties[first].brand_color, parties[second].brand_color),
          `${parties[first].party_id} and ${parties[second].party_id}`,
        ).toBeGreaterThanOrEqual(20);
      }
    }
  });
});
