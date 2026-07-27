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

  it("contains the full reconciled inter-election export for eligible entities", () => {
    expect(dataset.financingRecords).toHaveLength(998);
    const totals = new Map<string, { records: number; amount: number }>();
    for (const record of dataset.financingRecords) {
      const key = `${record.party_id}:${record.category}`;
      const current = totals.get(key) ?? { records: 0, amount: 0 };
      current.records += 1;
      current.amount += record.amount_agorot;
      totals.set(key, current);
    }
    expect(Object.fromEntries(totals)).toMatchObject({
      "yashar:donation": { records: 189, amount: 146_194_800 },
      "yashar:guarantee": { records: 23, amount: 1_289_800_000 },
      "beyachad:donation": { records: 19, amount: 16_300_000 },
      "beyachad:guarantee": { records: 9, amount: 1_000_000_000 },
      "democrats:donation": { records: 493, amount: 85_243_100 },
      "miluimnikim:donation": { records: 37, amount: 16_988_200 },
      "miluimnikim:guarantee": { records: 8, amount: 141_200_000 },
      "economic-party:donation": { records: 17, amount: 6_077_500 },
    });
  });

  it("derives the statutory-period flag from the event date", () => {
    for (const record of dataset.financingRecords) {
      expect(record.in_statutory_election_period).toBe(record.event_date >= "2026-07-18");
    }
  });

  it("keeps every comptroller alias unique and sourced", () => {
    expect(dataset.partyNameAliases).toHaveLength(13);
    expect(new Set(dataset.partyNameAliases.map(({ alias_name_he }) => alias_name_he)).size).toBe(
      13,
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
