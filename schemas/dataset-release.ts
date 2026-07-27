import { z } from "zod";
import { isoDateTimeSchema } from "./common";

export const datasetReleaseSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  releasedAt: isoDateTimeSchema,
  summaryHe: z.string().trim().min(1),
});

export type DatasetRelease = z.infer<typeof datasetReleaseSchema>;
