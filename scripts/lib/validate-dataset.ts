import type { Dataset, csvContracts } from "./load-data";
import { election } from "../../config/election";

const approvedFinancingAuthorities = new Set([
  "state_comptroller",
  "knesset",
  "central_elections_committee",
  "gov_ministry",
  "party_registrar",
  "corporations_authority",
  "isa",
  "tase",
  "other_statutory",
]);

const forbiddenPrivateFields = new Set([
  "email",
  "phone",
  "telephone",
  "address",
  "street_address",
  "id_number",
  "national_id",
  "identity_number",
  "family_details",
]);

export function isApprovedFinancingDomain(url: string): boolean {
  const hostname = new URL(url).hostname.toLowerCase();
  return (
    hostname === "mevaker.gov.il" ||
    hostname.endsWith(".mevaker.gov.il") ||
    hostname === "knesset.gov.il" ||
    hostname.endsWith(".knesset.gov.il") ||
    hostname === "bechirot.gov.il" ||
    hostname.endsWith(".bechirot.gov.il") ||
    hostname === "gov.il" ||
    hostname.endsWith(".gov.il") ||
    hostname === "isa.gov.il" ||
    hostname.endsWith(".isa.gov.il") ||
    hostname === "maya.tase.co.il" ||
    hostname === "tase.co.il" ||
    hostname.endsWith(".tase.co.il")
  );
}

function duplicateValues(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function assertUnique(errors: string[], label: string, values: string[]): void {
  for (const value of duplicateValues(values)) {
    errors.push(`${label}: duplicate ID "${value}"`);
  }
}

export function validateDataset(dataset: Dataset): string[] {
  const errors: string[] = [];
  const partyIds = new Set(dataset.parties.map((party) => party.party_id));
  const axisIds = new Set(dataset.axisPositions.map((position) => position.axis_position_id));
  const personIds = new Set(dataset.persons.map((person) => person.person_id));
  const organizationIds = new Set(dataset.organizations.map((organization) => organization.org_id));
  const sourceById = new Map(dataset.sources.map((source) => [source.source_id, source]));
  const recordIds = new Set(dataset.financingRecords.map((record) => record.record_id));
  const scopeByPartyId = new Map(
    dataset.partyFinancialScopes.map((scope) => [scope.party_id, scope]),
  );

  assertUnique(
    errors,
    "parties",
    dataset.parties.map((party) => party.party_id),
  );
  assertUnique(
    errors,
    "axis_positions",
    dataset.axisPositions.map((position) => position.axis_position_id),
  );
  assertUnique(
    errors,
    "financing_records",
    dataset.financingRecords.map((record) => record.record_id),
  );
  assertUnique(
    errors,
    "persons",
    dataset.persons.map((person) => person.person_id),
  );
  assertUnique(
    errors,
    "organizations",
    dataset.organizations.map((organization) => organization.org_id),
  );
  assertUnique(
    errors,
    "person_roles",
    dataset.personRoles.map((assertion) => assertion.assertion_id),
  );
  assertUnique(
    errors,
    "profile_checks",
    dataset.profileChecks.map((check) => check.person_id),
  );
  assertUnique(
    errors,
    "sources",
    dataset.sources.map((source) => source.source_id),
  );
  assertUnique(
    errors,
    "external_links",
    dataset.externalLinks.map((link) => link.link_id),
  );
  assertUnique(
    errors,
    "corrections",
    dataset.corrections.map((correction) => correction.correction_id),
  );
  assertUnique(
    errors,
    "party_financial_scopes",
    dataset.partyFinancialScopes.map((scope) => scope.party_id),
  );
  assertUnique(
    errors,
    "party_name_aliases",
    dataset.partyNameAliases.map((alias) => alias.alias_name_he),
  );

  const officialRecordIds = dataset.financingRecords
    .map((record) => record.official_record_id)
    .filter(Boolean);
  assertUnique(errors, "financing_records.official_record_id", officialRecordIds);

  for (const party of dataset.parties) {
    if (!axisIds.has(party.axis_position_id)) {
      errors.push(`${party.party_id}: missing axis position ${party.axis_position_id}`);
    }
    if (!sourceById.has(party.eligibility_source_id)) {
      errors.push(`${party.party_id}: missing eligibility source ${party.eligibility_source_id}`);
    }
  }

  for (const position of dataset.axisPositions) {
    for (const sourceId of position.source_ids.split("|").filter(Boolean)) {
      if (!sourceById.has(sourceId)) {
        errors.push(`${position.axis_position_id}: missing rationale source ${sourceId}`);
      }
    }
  }

  for (const record of dataset.financingRecords) {
    if (!partyIds.has(record.party_id)) {
      errors.push(`${record.record_id}: missing party ${record.party_id}`);
    }
    if (record.person_id && !personIds.has(record.person_id)) {
      errors.push(`${record.record_id}: missing person ${record.person_id}`);
    }
    if (record.org_id && !organizationIds.has(record.org_id)) {
      errors.push(`${record.record_id}: missing organization ${record.org_id}`);
    }
    if (record.superseded_by && !recordIds.has(record.superseded_by)) {
      errors.push(`${record.record_id}: missing superseding record ${record.superseded_by}`);
    }
    if (record.in_statutory_election_period !== record.event_date >= election.cycleStartDate) {
      errors.push(`${record.record_id}: in_statutory_election_period does not match event_date`);
    }
    if (record.event_date < election.scopeStartDate) {
      errors.push(`${record.record_id}: event date predates the public measurement scope`);
    }
    const scope = scopeByPartyId.get(record.party_id);
    if (
      scope?.measurement_start &&
      scope.measurement_end &&
      (record.event_date < scope.measurement_start || record.event_date > scope.measurement_end)
    ) {
      errors.push(
        `${record.record_id}: event date is outside the declared financial measurement window`,
      );
    }

    const source = sourceById.get(record.source_id);
    if (!source) {
      errors.push(`${record.record_id}: missing source ${record.source_id}`);
      continue;
    }
    if (!approvedFinancingAuthorities.has(source.authority)) {
      errors.push(`${record.record_id}: source authority ${source.authority} is not approved`);
    }
    if (!source.is_primary) {
      errors.push(`${record.record_id}: financing source must be primary`);
    }
    if (!isApprovedFinancingDomain(source.url)) {
      errors.push(`${record.record_id}: financing source domain is not allowlisted`);
    }
    if (source.verification_status !== "verified") {
      errors.push(`${record.record_id}: financing source is not semantically verified`);
    }
  }

  for (const assertion of dataset.personRoles) {
    if (!personIds.has(assertion.person_id)) {
      errors.push(`${assertion.assertion_id}: missing person ${assertion.person_id}`);
    }
    if (assertion.org_id && !organizationIds.has(assertion.org_id)) {
      errors.push(`${assertion.assertion_id}: missing organization ${assertion.org_id}`);
    }
    if (!sourceById.has(assertion.source_id)) {
      errors.push(`${assertion.assertion_id}: missing source ${assertion.source_id}`);
    }
  }

  const assertionPersonIds = new Set(dataset.personRoles.map((assertion) => assertion.person_id));
  const externalLinkPersonIds = new Set(
    dataset.externalLinks.map((link) => link.person_id).filter(Boolean),
  );
  const profileCheckByPersonId = new Map(
    dataset.profileChecks.map((check) => [check.person_id, check]),
  );
  const totalsByPersonId = new Map<string, { total: number; hasGuarantee: boolean }>();
  for (const record of dataset.financingRecords) {
    if (!record.person_id || record.status === "returned" || record.status === "superseded") {
      continue;
    }
    const current = totalsByPersonId.get(record.person_id) ?? {
      total: 0,
      hasGuarantee: false,
    };
    current.total += record.amount_agorot;
    current.hasGuarantee ||= record.category === "guarantee";
    totalsByPersonId.set(record.person_id, current);
  }

  for (const check of dataset.profileChecks) {
    if (!personIds.has(check.person_id)) {
      errors.push(`profile_checks: missing person ${check.person_id}`);
    }
    if (check.outcome === "enriched" && !assertionPersonIds.has(check.person_id)) {
      errors.push(`${check.person_id}: enriched profile check requires a sourced assertion`);
    }
    if (check.outcome === "links_only" && !externalLinkPersonIds.has(check.person_id)) {
      errors.push(`${check.person_id}: links-only profile check requires an external link`);
    }
  }

  for (const [personId, totals] of totalsByPersonId) {
    const isTier1 = totals.hasGuarantee || totals.total >= 5_000_000;
    const isTier2 = !isTier1 && totals.total >= 1_000_000;
    if (!isTier1 && !isTier2) continue;
    const check = profileCheckByPersonId.get(personId);
    if (!check) {
      errors.push(`${personId}: missing Tier-1/Tier-2 profile check`);
      continue;
    }
    if (
      isTier1 &&
      !assertionPersonIds.has(personId) &&
      check.outcome !== "no_reliable_match" &&
      check.outcome !== "ambiguous_identity"
    ) {
      errors.push(`${personId}: Tier-1 profile requires an assertion or a documented no-match`);
    }
  }

  for (const link of dataset.externalLinks) {
    if (link.person_id && !personIds.has(link.person_id)) {
      errors.push(`${link.link_id}: missing person ${link.person_id}`);
    }
    if (link.org_id && !organizationIds.has(link.org_id)) {
      errors.push(`${link.link_id}: missing organization ${link.org_id}`);
    }
  }

  for (const scope of dataset.partyFinancialScopes) {
    if (!partyIds.has(scope.party_id)) {
      errors.push(`party_financial_scopes: missing party ${scope.party_id}`);
    }
    if (scope.net_position_comparable && (!scope.measurement_start || !scope.measurement_end)) {
      errors.push(`${scope.party_id}: comparable net position requires a measurement window`);
    }
  }
  for (const partyId of partyIds) {
    if (!dataset.partyFinancialScopes.some((scope) => scope.party_id === partyId)) {
      errors.push(`${partyId}: missing financial scope row`);
    }
  }

  for (const alias of dataset.partyNameAliases) {
    if (!partyIds.has(alias.party_id)) {
      errors.push(`party_name_aliases: missing party ${alias.party_id}`);
    }
    if (!sourceById.has(alias.source_id)) {
      errors.push(`party_name_aliases: missing source ${alias.source_id}`);
    }
  }

  for (const correction of dataset.corrections) {
    for (const recordId of correction.affected_record_ids.split("|").filter(Boolean)) {
      if (!recordIds.has(recordId)) {
        errors.push(`${correction.correction_id}: missing affected record ${recordId}`);
      }
    }
  }

  return errors;
}

export function validateHeaderPrivacy(contracts: typeof csvContracts): string[] {
  const errors: string[] = [];
  for (const [fileName, headers] of Object.entries(contracts)) {
    for (const header of headers) {
      if (forbiddenPrivateFields.has(header)) {
        errors.push(`${fileName}: forbidden private field "${header}"`);
      }
    }
  }
  return errors;
}
