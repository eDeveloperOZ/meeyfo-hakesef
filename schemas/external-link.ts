import { z } from "zod";
import { idSchema, optionalStringSchema } from "./common";

export const externalLinkSchema = z
  .object({
    link_id: idSchema,
    person_id: optionalStringSchema,
    org_id: optionalStringSchema,
    kind: z.enum([
      "wikipedia",
      "official_site",
      "corporate_bio",
      "isa_filing",
      "tase_filing",
      "personal_site",
    ]),
    url: z.string().url(),
    label_he: z.string().trim().min(1),
  })
  .superRefine((link, context) => {
    if (Boolean(link.person_id) === Boolean(link.org_id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["person_id"],
        message: "External links must reference exactly one person or organization",
      });
    }
  });

export type ExternalLink = z.infer<typeof externalLinkSchema>;
