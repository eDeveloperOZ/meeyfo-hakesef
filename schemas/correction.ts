import { z } from "zod";
import { idSchema, isoDateSchema, optionalStringSchema, urlOrEmptySchema } from "./common";

export const correctionSchema = z.object({
  correction_id: idSchema,
  date: isoDateSchema,
  affected_record_ids: optionalStringSchema,
  description_he: z.string().trim().min(1),
  github_issue_url: urlOrEmptySchema,
  resolution: z.string().trim().min(1),
});

export type Correction = z.infer<typeof correctionSchema>;
