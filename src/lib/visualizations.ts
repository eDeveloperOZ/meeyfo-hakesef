import type {
  FinancingCategory,
  FinancingRecord,
  Organization,
  Party,
  Person,
} from "../../schemas";
import { activeRecords } from "./finance";

export const receivedCashCategories: FinancingCategory[] = [
  "donation",
  "bank_loan",
  "knesset_loan_or_advance",
  "public_funding",
  "membership_fees",
  "other_official_income",
];

export const financingCategoryLabels: Record<FinancingCategory, string> = {
  donation: "תרומות",
  guarantee: "ערבויות",
  bank_loan: "הלוואות בנקאיות",
  knesset_loan_or_advance: "הלוואות או מקדמות מהכנסת",
  public_funding: "מימון ציבורי",
  membership_fees: "דמי חבר",
  other_official_income: "הכנסות רשמיות אחרות",
  debt_liability: "חובות והתחייבויות",
};

export type CategoryDistributionDatum = {
  category: FinancingCategory;
  amount: number | null;
  share: number | null;
};

export type CategoryDistribution = {
  cash: CategoryDistributionDatum[];
  cashTotal: number;
  guarantees: number | null;
  liabilities: number | null;
  missing: FinancingCategory[];
};

export type CounterpartyChartDatum = {
  profileId: string;
  name: string;
  donations: number;
  guarantees: number;
  total: number;
};

export type MonthlyFlowDatum = {
  month: string;
  donations: number;
  guarantees: number;
  total: number;
};

export type PersonBreakdownDatum = {
  partyId: string;
  partyName: string;
  year: string;
  receivedCash: number;
  guarantees: number;
  total: number;
};

export type PartyComparisonDatum = {
  partyId: string;
  partyName: string;
  receivedCash: number;
  guarantees: number;
  hasRecords: boolean;
};

function sum(records: FinancingRecord[]): number {
  return records.reduce((total, record) => total + record.amount_agorot, 0);
}

export function buildCategoryDistribution(records: FinancingRecord[]): CategoryDistribution {
  const active = activeRecords(records);
  const cash = receivedCashCategories.map((category) => {
    const categoryRecords = active.filter(
      (record) => record.category === category && record.cash_received,
    );
    return {
      category,
      amount: categoryRecords.length > 0 ? sum(categoryRecords) : null,
      share: null,
    };
  });
  const cashTotal = cash.reduce((total, datum) => total + (datum.amount ?? 0), 0);
  const cashWithShares = cash.map((datum) => ({
    ...datum,
    share: datum.amount === null || cashTotal === 0 ? null : datum.amount / cashTotal,
  }));
  const guaranteeRecords = active.filter(
    (record) =>
      record.category === "guarantee" &&
      record.status === "active" &&
      record.contingent &&
      !record.cash_received,
  );
  const liabilityRecords = active.filter((record) => record.category === "debt_liability");
  const guarantees = guaranteeRecords.length > 0 ? sum(guaranteeRecords) : null;
  const liabilities = liabilityRecords.length > 0 ? sum(liabilityRecords) : null;
  const missing = [
    ...cashWithShares.filter((datum) => datum.amount === null).map((datum) => datum.category),
    ...(guarantees === null ? (["guarantee"] as FinancingCategory[]) : []),
    ...(liabilities === null ? (["debt_liability"] as FinancingCategory[]) : []),
  ];

  return {
    cash: cashWithShares,
    cashTotal,
    guarantees,
    liabilities,
    missing,
  };
}

export function buildTopCounterparties(
  records: FinancingRecord[],
  persons: Person[],
  organizations: Organization[],
  limit = 10,
): CounterpartyChartDatum[] {
  const personNames = new Map(persons.map((person) => [person.person_id, person.full_name_he]));
  const organizationNames = new Map(
    organizations.map((organization) => [organization.org_id, organization.name_he]),
  );
  const byCounterparty = new Map<string, CounterpartyChartDatum>();

  for (const record of activeRecords(records)) {
    if (record.category !== "donation" && record.category !== "guarantee") continue;
    const profileId = record.person_id || record.org_id;
    if (!profileId) continue;
    const name = record.person_id
      ? personNames.get(record.person_id)
      : organizationNames.get(record.org_id);
    if (!name) continue;
    const current = byCounterparty.get(profileId) ?? {
      profileId,
      name,
      donations: 0,
      guarantees: 0,
      total: 0,
    };
    if (record.category === "guarantee") {
      current.guarantees += record.amount_agorot;
    } else {
      current.donations += record.amount_agorot;
    }
    current.total += record.amount_agorot;
    byCounterparty.set(profileId, current);
  }

  return [...byCounterparty.values()]
    .sort((left, right) => right.total - left.total || left.name.localeCompare(right.name, "he"))
    .slice(0, limit);
}

function monthRange(startMonth: string, endMonth: string): string[] {
  const [startYear, startMonthNumber] = startMonth.split("-").map(Number);
  const [endYear, endMonthNumber] = endMonth.split("-").map(Number);
  const months: string[] = [];
  let year = startYear;
  let month = startMonthNumber;
  while (year < endYear || (year === endYear && month <= endMonthNumber)) {
    months.push(`${year}-${String(month).padStart(2, "0")}`);
    month += 1;
    if (month === 13) {
      month = 1;
      year += 1;
    }
  }
  return months;
}

export function buildMonthlyFlow(
  records: FinancingRecord[],
  startMonth: string,
  endMonth: string,
): MonthlyFlowDatum[] {
  const result = new Map(
    monthRange(startMonth, endMonth).map((month) => [
      month,
      { month, donations: 0, guarantees: 0, total: 0 },
    ]),
  );
  for (const record of activeRecords(records)) {
    if (record.category !== "donation" && record.category !== "guarantee") continue;
    const month = record.event_date.slice(0, 7);
    const datum = result.get(month);
    if (!datum) continue;
    if (record.category === "guarantee") {
      datum.guarantees += record.amount_agorot;
    } else {
      datum.donations += record.amount_agorot;
    }
    datum.total += record.amount_agorot;
  }
  return [...result.values()];
}

export function buildPersonBreakdown(
  records: FinancingRecord[],
  parties: Party[],
): PersonBreakdownDatum[] {
  const partyNames = new Map(parties.map((party) => [party.party_id, party.name_he]));
  const byPartyYear = new Map<string, PersonBreakdownDatum>();
  for (const record of activeRecords(records)) {
    if (!record.cash_received && record.category !== "guarantee") continue;
    if (record.category === "debt_liability") continue;
    const year = record.event_date.slice(0, 4);
    const key = `${record.party_id}:${year}`;
    const current = byPartyYear.get(key) ?? {
      partyId: record.party_id,
      partyName: partyNames.get(record.party_id) ?? record.party_id,
      year,
      receivedCash: 0,
      guarantees: 0,
      total: 0,
    };
    if (record.category === "guarantee") {
      current.guarantees += record.amount_agorot;
    } else if (record.cash_received) {
      current.receivedCash += record.amount_agorot;
    }
    current.total += record.amount_agorot;
    byPartyYear.set(key, current);
  }
  return [...byPartyYear.values()].sort(
    (left, right) =>
      right.total - left.total ||
      right.year.localeCompare(left.year) ||
      left.partyName.localeCompare(right.partyName, "he"),
  );
}

export function buildPartyComparison(
  parties: Party[],
  records: FinancingRecord[],
): PartyComparisonDatum[] {
  const active = activeRecords(records);
  return parties
    .map((party) => {
      const partyRecords = active.filter((record) => record.party_id === party.party_id);
      const receivedCash = sum(partyRecords.filter((record) => record.cash_received));
      const guarantees = sum(
        partyRecords.filter(
          (record) =>
            record.category === "guarantee" &&
            record.status === "active" &&
            record.contingent &&
            !record.cash_received,
        ),
      );
      return {
        partyId: party.party_id,
        partyName: party.name_he,
        receivedCash,
        guarantees,
        hasRecords: partyRecords.length > 0,
      };
    })
    .sort(
      (left, right) =>
        right.receivedCash - left.receivedCash ||
        right.guarantees - left.guarantees ||
        left.partyName.localeCompare(right.partyName, "he"),
    );
}
