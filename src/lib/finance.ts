import type { FinancingCategory, FinancingRecord, PartyFinancialScope } from "../../schemas";

const inflowCategories = new Set<FinancingCategory>([
  "donation",
  "bank_loan",
  "knesset_loan_or_advance",
  "public_funding",
  "membership_fees",
  "other_official_income",
]);

const excludedStatuses = new Set(["returned", "superseded"]);

export type FinancialSummary = {
  reportedInflows: number;
  reportedGuarantees: number;
  reportedLiabilities: number;
  netPosition: number | null;
  categoryTotals: Record<FinancingCategory, number | null>;
};

function sumAmounts(records: FinancingRecord[]): number {
  return records.reduce((sum, record) => sum + record.amount_agorot, 0);
}

export function activeRecords(records: FinancingRecord[]): FinancingRecord[] {
  return records.filter((record) => !excludedStatuses.has(record.status));
}

export function calculateFinancialSummary(
  records: FinancingRecord[],
  scope: PartyFinancialScope,
): FinancialSummary {
  const active = activeRecords(records);
  const reportedInflows = sumAmounts(
    active.filter((record) => record.cash_received && inflowCategories.has(record.category)),
  );
  const reportedGuarantees = sumAmounts(
    active.filter(
      (record) =>
        record.category === "guarantee" && record.status === "active" && record.contingent,
    ),
  );
  const reportedLiabilities = sumAmounts(
    active.filter((record) => record.category === "debt_liability"),
  );
  const categories: FinancingCategory[] = [
    "donation",
    "guarantee",
    "bank_loan",
    "knesset_loan_or_advance",
    "public_funding",
    "membership_fees",
    "other_official_income",
    "debt_liability",
  ];
  const categoryTotals = Object.fromEntries(
    categories.map((category) => {
      const categoryRecords = active.filter((record) => record.category === category);
      return [category, categoryRecords.length === 0 ? null : sumAmounts(categoryRecords)];
    }),
  ) as Record<FinancingCategory, number | null>;

  return {
    reportedInflows,
    reportedGuarantees,
    reportedLiabilities,
    netPosition: scope.net_position_comparable ? reportedInflows - reportedLiabilities : null,
    categoryTotals,
  };
}

export function sortRecordsByAmount(records: FinancingRecord[]): FinancingRecord[] {
  return [...records].sort(
    (left, right) =>
      right.amount_agorot - left.amount_agorot ||
      left.record_id.localeCompare(right.record_id, "he"),
  );
}
