import { z } from "zod";
import { csvBooleanSchema, idSchema, isoDateSchema, optionalDateSchema } from "./common";

export const partyFinancialScopeSchema = z.object({
  party_id: idSchema,
  net_position_comparable: csvBooleanSchema,
  measurement_start: optionalDateSchema,
  measurement_end: optionalDateSchema,
  public_funding_status: z.enum(["actual", "projected", "unknown"]),
  completeness_status: z.enum(["complete", "partial", "not_found", "pending_collection"]),
  checked_at: isoDateSchema,
  note_he: z.string().trim().min(1),
});

export type PartyFinancialScope = z.infer<typeof partyFinancialScopeSchema>;
