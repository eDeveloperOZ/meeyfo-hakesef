import { describe, expect, it } from "vitest";
import { csvContracts, type Dataset } from "../../scripts/lib/load-data";
import { createMasterCsv, masterHeaders } from "../../scripts/lib/public-data";

const emptyDataset: Dataset = {
  parties: [],
  axisPositions: [],
  financingRecords: [],
  persons: [],
  organizations: [],
  personRoles: [],
  profileChecks: [],
  sources: [],
  externalLinks: [],
  corrections: [],
  partyFinancialScopes: [],
  partyNameAliases: [],
  release: {
    version: "0.1.0",
    releasedAt: "2026-07-27T12:00:00+03:00",
    summaryHe: "בדיקה",
  },
};

describe("public CSV", () => {
  it("includes profile checks and party aliases in the normalized package contract", () => {
    expect(Object.keys(csvContracts)).toEqual(
      expect.arrayContaining(["profile_checks.csv", "party_name_aliases.csv"]),
    );
  });

  it("starts with an Excel-compatible UTF-8 BOM and preserves the column contract", () => {
    const csv = createMasterCsv(emptyDataset);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv.slice(1).split("\r\n")[0]).toBe(masterHeaders.join(","));
  });

  it("escapes commas and quotes", () => {
    const dataset: Dataset = {
      ...emptyDataset,
      parties: [
        {
          party_id: "p",
          name_he: 'שם, "רשמי"',
          legal_name_he: "שם",
          entity_type: "party",
          status: "knesset",
          eligibility_basis_he: "ייצוג",
          eligibility_source_id: "s",
          website_url: "",
          logo_file: "",
          mark_he: "בדק",
          brand_color: "#000000",
          axis_position_id: "a",
          notes: "",
        },
      ],
      financingRecords: [
        {
          record_id: "r",
          party_id: "p",
          category: "donation",
          amount_agorot: 100,
          currency: "ILS",
          event_date: "2026-07-20",
          report_date: "2026-07-21",
          person_id: "",
          org_id: "",
          cash_received: true,
          contingent: false,
          repayment_expected: false,
          in_statutory_election_period: true,
          status: "active",
          source_id: "s",
          official_record_id: "",
          superseded_by: "",
          notes: "",
        },
      ],
      sources: [
        {
          source_id: "s",
          authority: "state_comptroller",
          source_type: "web_page",
          title: "מקור",
          url: "https://www.mevaker.gov.il/example",
          publication_date: "",
          access_datetime: "2026-07-27T12:00:00+03:00",
          extraction_datetime: "2026-07-27T12:00:00+03:00",
          locator: "רשומה",
          content_sha256: "",
          language: "he",
          verification_status: "verified",
          is_primary: true,
          notes: "",
        },
      ],
    };
    expect(createMasterCsv(dataset)).toContain('"שם, ""רשמי"""');
  });
});
