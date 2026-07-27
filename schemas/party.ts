import { z } from "zod";
import { idSchema, optionalStringSchema, urlOrEmptySchema } from "./common";

export const partySchema = z.object({
  party_id: idSchema,
  name_he: z.string().trim().min(1),
  legal_name_he: z.string().trim().min(1),
  entity_type: z.enum(["party", "list", "faction"]),
  status: z.enum(["knesset", "polled", "owner_exception"]),
  eligibility_basis_he: z.string().trim().min(1),
  eligibility_source_id: idSchema,
  website_url: urlOrEmptySchema,
  logo_file: optionalStringSchema,
  brand_color: z.union([z.string().regex(/^#[0-9A-Fa-f]{6}$/), z.literal("")]).default(""),
  axis_position_id: idSchema,
  notes: optionalStringSchema,
});

export type Party = z.infer<typeof partySchema>;
