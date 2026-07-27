import { z } from "zod";
import {
  csvBooleanSchema,
  idSchema,
  isoDateTimeSchema,
  optionalDateSchema,
  optionalStringSchema,
} from "./common";

export const sourceAuthoritySchema = z.enum([
  "state_comptroller",
  "knesset",
  "central_elections_committee",
  "gov_ministry",
  "party_registrar",
  "corporations_authority",
  "isa",
  "tase",
  "other_statutory",
  "reference_only",
]);

export const sourceSchema = z.object({
  source_id: idSchema,
  authority: sourceAuthoritySchema,
  source_type: z.enum(["web_page", "pdf", "db_record", "filing"]),
  title: z.string().trim().min(1),
  url: z.string().url(),
  publication_date: optionalDateSchema,
  access_datetime: isoDateTimeSchema,
  extraction_datetime: isoDateTimeSchema,
  locator: z.string().trim().min(1),
  content_sha256: z.union([z.string().regex(/^[a-f0-9]{64}$/), z.literal("")]),
  language: z.string().trim().min(2),
  verification_status: z.enum(["verified", "pending_semantic", "unreachable_temp", "superseded"]),
  is_primary: csvBooleanSchema,
  notes: optionalStringSchema,
});

export type Source = z.infer<typeof sourceSchema>;
export type SourceAuthority = z.infer<typeof sourceAuthoritySchema>;
