import { z } from "zod";
import { idSchema } from "./common";

export const partyNameAliasSchema = z.object({
  alias_name_he: z.string().trim().min(1),
  party_id: idSchema,
  basis_he: z.string().trim().min(1),
  source_id: idSchema,
});

export type PartyNameAlias = z.infer<typeof partyNameAliasSchema>;
