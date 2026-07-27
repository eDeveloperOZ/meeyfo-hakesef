import { z } from "zod";
import { idSchema, optionalStringSchema } from "./common";

export const personSchema = z.object({
  person_id: idSchema,
  full_name_he: z.string().trim().min(1),
  locality_he: optionalStringSchema,
});

export type Person = z.infer<typeof personSchema>;
