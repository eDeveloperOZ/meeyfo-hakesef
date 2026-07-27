import { z } from "zod";
import { idSchema, isoDateSchema, optionalDateSchema, optionalStringSchema } from "./common";

export const personRoleSchema = z.object({
  assertion_id: idSchema,
  person_id: idSchema,
  org_id: optionalStringSchema,
  assertion_type: z.enum(["position", "material_holding", "founder", "other_documented"]),
  role_text_he: z.string().trim().min(1),
  start_date: optionalDateSchema,
  end_date: optionalDateSchema,
  source_id: idSchema,
  verified_at: isoDateSchema,
  status: z.string().trim().min(1),
});

export type PersonRole = z.infer<typeof personRoleSchema>;
