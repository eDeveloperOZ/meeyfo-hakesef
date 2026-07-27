import { z } from "zod";
import { idSchema, optionalStringSchema, urlOrEmptySchema } from "./common";

export const organizationSchema = z.object({
  org_id: idSchema,
  name_he: z.string().trim().min(1),
  org_type: z.string().trim().min(1),
  registrar_number: optionalStringSchema,
  website_url: urlOrEmptySchema,
});

export type Organization = z.infer<typeof organizationSchema>;
