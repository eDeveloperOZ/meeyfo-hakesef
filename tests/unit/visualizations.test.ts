import { describe, expect, it } from "vitest";
import type { FinancingRecord, Party } from "../../schemas";
import {
  buildCategoryDistribution,
  buildMonthlyFlow,
  buildPartyComparison,
  buildPersonBreakdown,
  buildTopCounterparties,
} from "../../src/lib/visualizations";

function record(
  record_id: string,
  party_id: string,
  category: FinancingRecord["category"],
  amount_agorot: number,
  overrides: Partial<FinancingRecord> = {},
): FinancingRecord {
  return {
    record_id,
    party_id,
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

function party(party_id: string, name_he: string): Party {
  return {
    party_id,
    name_he,
    legal_name_he: name_he,
    entity_type: "party",
    status: "knesset",
    eligibility_basis_he: "בדיקה",
    eligibility_source_id: "source",
    website_url: "",
    logo_file: "",
    mark_he: "בדק",
    brand_color: "",
    axis_position_id: "axis",
    notes: "",
  };
}

describe("visualization calculations", () => {
  it("keeps received cash, guarantees, and liabilities in separate lanes", () => {
    const distribution = buildCategoryDistribution([
      record("donation", "a", "donation", 100_00),
      record("loan", "a", "bank_loan", 50_00),
      record("guarantee", "a", "guarantee", 400_00),
      record("debt", "a", "debt_liability", 700_00),
      record("returned", "a", "donation", 900_00, { status: "returned" }),
    ]);

    expect(distribution.cashTotal).toBe(150_00);
    expect(distribution.cash.find((datum) => datum.category === "donation")?.share).toBeCloseTo(
      2 / 3,
    );
    expect(distribution.guarantees).toBe(400_00);
    expect(distribution.liabilities).toBe(700_00);
  });

  it("aggregates and sorts counterparties by reported donation plus guarantee amount", () => {
    const result = buildTopCounterparties(
      [
        record("a-donation", "a", "donation", 100_00, { person_id: "person-a" }),
        record("a-guarantee", "a", "guarantee", 500_00, { person_id: "person-a" }),
        record("b-donation", "a", "donation", 300_00, { org_id: "org-b" }),
      ],
      [{ person_id: "person-a", full_name_he: "אדם א", locality_he: "" }],
      [
        {
          org_id: "org-b",
          name_he: "ארגון ב",
          org_type: "חברה",
          registrar_number: "",
          website_url: "",
        },
      ],
    );

    expect(result.map((datum) => datum.profileId)).toEqual(["person-a", "org-b"]);
    expect(result[0]).toMatchObject({
      donations: 100_00,
      guarantees: 500_00,
      total: 600_00,
    });
  });

  it("fills every month in the requested window, including months without reports", () => {
    const result = buildMonthlyFlow(
      [
        record("nov", "a", "donation", 100_00, { event_date: "2022-11-20" }),
        record("jan", "a", "guarantee", 200_00, { event_date: "2023-01-03" }),
      ],
      "2022-11",
      "2023-01",
    );

    expect(result).toEqual([
      { month: "2022-11", donations: 100_00, guarantees: 0, total: 100_00 },
      { month: "2022-12", donations: 0, guarantees: 0, total: 0 },
      { month: "2023-01", donations: 0, guarantees: 200_00, total: 200_00 },
    ]);
  });

  it("builds person rows by party and year without treating guarantees as cash", () => {
    const result = buildPersonBreakdown(
      [
        record("cash", "a", "donation", 100_00, {
          person_id: "person-a",
          event_date: "2025-04-01",
        }),
        record("guarantee", "a", "guarantee", 500_00, {
          person_id: "person-a",
          event_date: "2025-05-01",
        }),
      ],
      [party("a", "מפלגה א")],
    );

    expect(result).toEqual([
      {
        partyId: "a",
        partyName: "מפלגה א",
        year: "2025",
        receivedCash: 100_00,
        guarantees: 500_00,
        total: 600_00,
      },
    ]);
  });

  it("sorts every party by received cash, not by guarantees", () => {
    const result = buildPartyComparison(
      [party("a", "מפלגה א"), party("b", "מפלגה ב"), party("c", "מפלגה ג")],
      [
        record("a-guarantee", "a", "guarantee", 1_000_00),
        record("b-cash", "b", "donation", 200_00),
      ],
    );

    expect(result.map((datum) => datum.partyId)).toEqual(["b", "a", "c"]);
    expect(result[0].receivedCash).toBe(200_00);
    expect(result[1]).toMatchObject({ receivedCash: 0, guarantees: 1_000_00 });
    expect(result[2].hasRecords).toBe(false);
  });
});
