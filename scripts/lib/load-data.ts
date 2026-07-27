import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";
import type { ZodType, ZodTypeDef } from "zod";
import {
  axisPositionSchema,
  correctionSchema,
  datasetReleaseSchema,
  externalLinkSchema,
  financingRecordSchema,
  organizationSchema,
  partyFinancialScopeSchema,
  partyNameAliasSchema,
  partySchema,
  personRoleSchema,
  personSchema,
  sourceSchema,
  type AxisPosition,
  type Correction,
  type DatasetRelease,
  type ExternalLink,
  type FinancingRecord,
  type Organization,
  type Party,
  type PartyFinancialScope,
  type PartyNameAlias,
  type Person,
  type PersonRole,
  type Source,
} from "../../schemas";

export type Dataset = {
  parties: Party[];
  axisPositions: AxisPosition[];
  financingRecords: FinancingRecord[];
  persons: Person[];
  organizations: Organization[];
  personRoles: PersonRole[];
  sources: Source[];
  externalLinks: ExternalLink[];
  corrections: Correction[];
  partyFinancialScopes: PartyFinancialScope[];
  partyNameAliases: PartyNameAlias[];
  release: DatasetRelease;
};

export const csvContracts = {
  "parties.csv": [
    "party_id",
    "name_he",
    "legal_name_he",
    "entity_type",
    "status",
    "eligibility_basis_he",
    "eligibility_source_id",
    "website_url",
    "logo_file",
    "mark_he",
    "brand_color",
    "axis_position_id",
    "notes",
  ],
  "axis_positions.csv": [
    "axis_position_id",
    "lane",
    "order_index",
    "label_he",
    "rationale_he",
    "source_ids",
  ],
  "financing_records.csv": [
    "record_id",
    "party_id",
    "category",
    "amount_agorot",
    "currency",
    "event_date",
    "report_date",
    "person_id",
    "org_id",
    "cash_received",
    "contingent",
    "repayment_expected",
    "in_statutory_election_period",
    "status",
    "source_id",
    "official_record_id",
    "superseded_by",
    "notes",
  ],
  "persons.csv": ["person_id", "full_name_he", "locality_he"],
  "organizations.csv": ["org_id", "name_he", "org_type", "registrar_number", "website_url"],
  "person_roles.csv": [
    "assertion_id",
    "person_id",
    "org_id",
    "assertion_type",
    "role_text_he",
    "start_date",
    "end_date",
    "source_id",
    "verified_at",
    "status",
  ],
  "sources.csv": [
    "source_id",
    "authority",
    "source_type",
    "title",
    "url",
    "publication_date",
    "access_datetime",
    "extraction_datetime",
    "locator",
    "content_sha256",
    "language",
    "verification_status",
    "is_primary",
    "notes",
  ],
  "external_links.csv": ["link_id", "person_id", "org_id", "kind", "url", "label_he"],
  "corrections.csv": [
    "correction_id",
    "date",
    "affected_record_ids",
    "description_he",
    "github_issue_url",
    "resolution",
  ],
  "party_financial_scopes.csv": [
    "party_id",
    "net_position_comparable",
    "measurement_start",
    "measurement_end",
    "public_funding_status",
    "completeness_status",
    "checked_at",
    "note_he",
  ],
  "party_name_aliases.csv": ["alias_name_he", "party_id", "basis_he", "source_id"],
} as const;

function parseCsv<T>(
  root: string,
  fileName: keyof typeof csvContracts,
  schema: ZodType<T, ZodTypeDef, unknown>,
): T[] {
  const raw = readFileSync(join(root, "data", fileName), "utf8").replace(/^\uFEFF/, "");
  const rows = parse(raw, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    relax_column_count: false,
    trim: true,
  }) as Record<string, string>[];

  const parsedHeader = raw.split(/\r?\n/, 1)[0]?.split(",") ?? [];
  const expectedHeader = [...csvContracts[fileName]];
  if (JSON.stringify(parsedHeader) !== JSON.stringify(expectedHeader)) {
    throw new Error(
      `${fileName}: header contract mismatch.\nExpected: ${expectedHeader.join(",")}\nActual: ${parsedHeader.join(",")}`,
    );
  }

  return rows.map((row, index) => {
    const result = schema.safeParse(row);
    if (!result.success) {
      const details = result.error.issues
        .map((issue) => `${issue.path.join(".") || "row"}: ${issue.message}`)
        .join("; ");
      throw new Error(`${fileName}:${index + 2}: ${details}`);
    }
    return result.data;
  });
}

export function loadDataset(root = process.cwd()): Dataset {
  const releaseRaw = JSON.parse(
    readFileSync(join(root, "data", "dataset-release.json"), "utf8"),
  ) as unknown;

  return {
    parties: parseCsv(root, "parties.csv", partySchema),
    axisPositions: parseCsv(root, "axis_positions.csv", axisPositionSchema),
    financingRecords: parseCsv(root, "financing_records.csv", financingRecordSchema),
    persons: parseCsv(root, "persons.csv", personSchema),
    organizations: parseCsv(root, "organizations.csv", organizationSchema),
    personRoles: parseCsv(root, "person_roles.csv", personRoleSchema),
    sources: parseCsv(root, "sources.csv", sourceSchema),
    externalLinks: parseCsv(root, "external_links.csv", externalLinkSchema),
    corrections: parseCsv(root, "corrections.csv", correctionSchema),
    partyFinancialScopes: parseCsv(root, "party_financial_scopes.csv", partyFinancialScopeSchema),
    partyNameAliases: parseCsv(root, "party_name_aliases.csv", partyNameAliasSchema),
    release: datasetReleaseSchema.parse(releaseRaw),
  };
}
