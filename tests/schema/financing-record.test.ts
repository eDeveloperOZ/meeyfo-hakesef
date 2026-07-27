import { describe, expect, it } from "vitest";
import { financingRecordSchema } from "../../schemas";

const valid = {
  record_id: "record-1",
  party_id: "party-1",
  category: "donation",
  amount_agorot: "100",
  currency: "ILS",
  event_date: "2026-07-20",
  report_date: "2026-07-21",
  person_id: "",
  org_id: "",
  cash_received: "true",
  contingent: "false",
  repayment_expected: "false",
  in_statutory_election_period: "true",
  status: "active",
  source_id: "source-1",
  official_record_id: "",
  superseded_by: "",
  notes: "",
};

describe("financing record schema", () => {
  it("accepts positive integer agorot", () => {
    expect(financingRecordSchema.parse(valid).amount_agorot).toBe(100);
  });

  it.each(["0", "-1", "1.5"])("rejects invalid amount %s", (amount_agorot) => {
    expect(financingRecordSchema.safeParse({ ...valid, amount_agorot }).success).toBe(false);
  });

  it("requires a guarantee to be contingent and not received cash", () => {
    expect(
      financingRecordSchema.safeParse({
        ...valid,
        category: "guarantee",
        cash_received: "true",
        contingent: "false",
      }).success,
    ).toBe(false);
  });

  it("forbids simultaneous person and organization references", () => {
    expect(
      financingRecordSchema.safeParse({
        ...valid,
        person_id: "person",
        org_id: "org",
      }).success,
    ).toBe(false);
  });

  it("requires a superseded record to identify its replacement", () => {
    expect(financingRecordSchema.safeParse({ ...valid, status: "superseded" }).success).toBe(false);
  });
});
