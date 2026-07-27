import { describe, expect, it } from "vitest";
import type { FinancingRecord, PartyFinancialScope } from "../../schemas";
import {
  activeRecords,
  calculateFinancialSummary,
  sortRecordsByAmount,
} from "../../src/lib/finance";

function record(
  record_id: string,
  category: FinancingRecord["category"],
  amount_agorot: number,
  overrides: Partial<FinancingRecord> = {},
): FinancingRecord {
  return {
    record_id,
    party_id: "party",
    category,
    amount_agorot,
    currency: "ILS",
    event_date: "2026-07-20",
    report_date: "2026-07-21",
    person_id: "",
    org_id: "",
    cash_received: category !== "guarantee" && category !== "debt_liability",
    contingent: category === "guarantee",
    repayment_expected: category.includes("loan"),
    in_statutory_election_period: true,
    status: "active",
    source_id: "source",
    official_record_id: "",
    superseded_by: "",
    notes: "",
    ...overrides,
  };
}

const comparableScope: PartyFinancialScope = {
  party_id: "party",
  net_position_comparable: true,
  measurement_start: "2026-07-18",
  measurement_end: "2026-07-27",
  public_funding_status: "unknown",
  completeness_status: "complete",
  checked_at: "2026-07-27T12:00:00+03:00",
  note_he: "חלון מדידה משותף.",
};

describe("financial calculations", () => {
  it("counts guarantees in reported income while keeping them separate from cash", () => {
    const summary = calculateFinancialSummary(
      [
        record("donation", "donation", 1_000_00),
        record("loan", "bank_loan", 2_000_00),
        record("guarantee", "guarantee", 8_000_00),
        record("debt", "debt_liability", 750_00),
        record("returned", "donation", 500_00, { status: "returned" }),
      ],
      comparableScope,
    );
    expect(summary.reportedIncome).toBe(11_000_00);
    expect(summary.reportedCashInflows).toBe(3_000_00);
    expect(summary.reportedGuarantees).toBe(8_000_00);
    expect(summary.statutoryIncome).toBe(11_000_00);
    expect(summary.statutoryGuarantees).toBe(8_000_00);
    expect(summary.reportedLiabilities).toBe(750_00);
    expect(summary.netPosition).toBe(10_250_00);
  });

  it("does not calculate net position when scope is not comparable", () => {
    const summary = calculateFinancialSummary([record("donation", "donation", 100_00)], {
      ...comparableScope,
      net_position_comparable: false,
    });
    expect(summary.netPosition).toBeNull();
    expect(summary.categoryTotals.guarantee).toBeNull();
    expect(summary.categoryTotals.donation).toBe(100_00);
  });

  it("excludes returned and superseded records and sorts active records by amount", () => {
    const records = [
      record("small", "donation", 100),
      record("large-b", "donation", 300),
      record("large-a", "donation", 300),
      record("old", "donation", 900, { status: "superseded", superseded_by: "small" }),
    ];
    expect(activeRecords(records).map(({ record_id }) => record_id)).toEqual([
      "small",
      "large-b",
      "large-a",
    ]);
    expect(sortRecordsByAmount(activeRecords(records)).map(({ record_id }) => record_id)).toEqual([
      "large-a",
      "large-b",
      "small",
    ]);
  });
});
