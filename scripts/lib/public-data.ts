import type { Dataset } from "./load-data";

export const masterHeaders = [
  "record_id",
  "party_id",
  "party_name_he",
  "category",
  "amount_agorot",
  "currency",
  "event_date",
  "report_date",
  "counterparty_name_he",
  "cash_received",
  "contingent",
  "repayment_expected",
  "in_statutory_election_period",
  "status",
  "source_title",
  "source_url",
  "verification_status",
  "notes",
] as const;

export function escapeCsv(value: unknown): string {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function createMasterCsv(dataset: Dataset): string {
  const sourceById = new Map(dataset.sources.map((source) => [source.source_id, source]));
  const partyById = new Map(dataset.parties.map((party) => [party.party_id, party]));
  const personById = new Map(dataset.persons.map((person) => [person.person_id, person]));
  const organizationById = new Map(
    dataset.organizations.map((organization) => [organization.org_id, organization]),
  );
  const rows = dataset.financingRecords.map((record) => {
    const party = partyById.get(record.party_id);
    const source = sourceById.get(record.source_id);
    const counterparty =
      (record.person_id ? personById.get(record.person_id)?.full_name_he : undefined) ??
      (record.org_id ? organizationById.get(record.org_id)?.name_he : undefined) ??
      "";
    return [
      record.record_id,
      record.party_id,
      party?.name_he,
      record.category,
      record.amount_agorot,
      record.currency,
      record.event_date,
      record.report_date,
      counterparty,
      record.cash_received,
      record.contingent,
      record.repayment_expected,
      record.in_statutory_election_period,
      record.status,
      source?.title,
      source?.url,
      source?.verification_status,
      record.notes,
    ];
  });

  const csv = [
    masterHeaders.map(escapeCsv).join(","),
    ...rows.map((row) => row.map(escapeCsv).join(",")),
  ].join("\r\n");
  return `\uFEFF${csv}\r\n`;
}
