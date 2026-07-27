import { z } from "zod";
import { idSchema, isoDateSchema } from "./common";

export const profileCheckOutcomeSchema = z.enum([
  "enriched",
  "links_only",
  "no_reliable_match",
  "ambiguous_identity",
]);

export const profileCheckSchema = z.object({
  person_id: idSchema,
  checked_at: isoDateSchema,
  sources_checked: z.string().trim().min(1),
  outcome: profileCheckOutcomeSchema,
});

export type ProfileCheck = z.infer<typeof profileCheckSchema>;
export type ProfileCheckOutcome = z.infer<typeof profileCheckOutcomeSchema>;
