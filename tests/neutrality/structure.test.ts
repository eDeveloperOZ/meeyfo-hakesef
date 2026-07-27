import { describe, expect, it } from "vitest";
import { loadDataset } from "../../scripts/lib/load-data";
import { orderPartiesByAxis } from "../../src/lib/axis";

const dataset = loadDataset();

describe("machine-checkable neutrality invariants", () => {
  it("applies one shared financial-scope contract to every party", () => {
    expect(dataset.partyFinancialScopes.map(({ party_id }) => party_id).sort()).toEqual(
      dataset.parties.map(({ party_id }) => party_id).sort(),
    );
  });

  it("places the Economic Party through the same data-driven ordering path", () => {
    const ordered = orderPartiesByAxis(dataset.parties, dataset.axisPositions);
    const economic = ordered.find(({ party_id }) => party_id === "economic-party");
    expect(economic?.status).toBe("owner_exception");
    expect(
      dataset.axisPositions.find(
        ({ axis_position_id }) => axis_position_id === economic?.axis_position_id,
      )?.lane,
    ).toBe("off_axis");
  });

  it("uses one eligibility source and one axis source path for every party", () => {
    const sourceIds = new Set(dataset.sources.map(({ source_id }) => source_id));
    for (const party of dataset.parties) {
      expect(sourceIds.has(party.eligibility_source_id)).toBe(true);
      const position = dataset.axisPositions.find(
        ({ axis_position_id }) => axis_position_id === party.axis_position_id,
      );
      expect(position?.source_ids.length).toBeGreaterThan(0);
    }
  });
});
