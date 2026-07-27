import { describe, expect, it } from "vitest";
import { csvContracts, loadDataset } from "../../scripts/lib/load-data";
import { validateDataset, validateHeaderPrivacy } from "../../scripts/lib/validate-dataset";

const dataset = loadDataset();

describe("real canonical dataset", () => {
  it("parses against every entity schema and passes all cross-entity rules", () => {
    expect(validateDataset(dataset)).toEqual([]);
  });

  it("contains exactly one financial scope row for every party", () => {
    expect(dataset.partyFinancialScopes).toHaveLength(dataset.parties.length);
    expect(new Set(dataset.partyFinancialScopes.map(({ party_id }) => party_id)).size).toBe(
      dataset.parties.length,
    );
  });

  it("keeps every axis rationale sourced", () => {
    expect(dataset.axisPositions.every(({ rationale_he }) => rationale_he.trim().length > 0)).toBe(
      true,
    );
    expect(dataset.axisPositions.every(({ source_ids }) => source_ids.trim().length > 0)).toBe(
      true,
    );
  });

  it("has no private fields in canonical contracts", () => {
    expect(validateHeaderPrivacy(csvContracts)).toEqual([]);
  });

  it("never treats guarantees or liabilities as received cash", () => {
    for (const record of dataset.financingRecords) {
      if (record.category === "guarantee" || record.category === "debt_liability") {
        expect(record.cash_received).toBe(false);
      }
    }
  });
});
