import { z } from "zod";
import {
  csvBooleanSchema,
  idSchema,
  isoDateSchema,
  optionalStringSchema,
  positiveIntegerStringSchema,
} from "./common";

export const financingCategorySchema = z.enum([
  "donation",
  "guarantee",
  "bank_loan",
  "knesset_loan_or_advance",
  "public_funding",
  "membership_fees",
  "other_official_income",
  "debt_liability",
]);

export const financingRecordSchema = z
  .object({
    record_id: idSchema,
    party_id: idSchema,
    category: financingCategorySchema,
    amount_agorot: positiveIntegerStringSchema,
    currency: z.literal("ILS"),
    event_date: isoDateSchema,
    report_date: isoDateSchema,
    person_id: optionalStringSchema,
    org_id: optionalStringSchema,
    cash_received: csvBooleanSchema,
    contingent: csvBooleanSchema,
    repayment_expected: csvBooleanSchema,
    in_statutory_election_period: csvBooleanSchema,
    status: z.enum(["active", "returned", "exercised", "superseded"]),
    source_id: idSchema,
    official_record_id: optionalStringSchema,
    superseded_by: optionalStringSchema,
    notes: optionalStringSchema,
  })
  .superRefine((record, context) => {
    if (record.person_id && record.org_id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["person_id"],
        message: "A record may reference a person or an organization, not both",
      });
    }
    if (record.category === "guarantee" && (!record.contingent || record.cash_received)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["category"],
        message: "Guarantees must be contingent and must not be marked as cash received",
      });
    }
    if (record.category === "debt_liability" && record.cash_received) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cash_received"],
        message: "Liabilities cannot be marked as cash received",
      });
    }
    if (record.status === "superseded" && !record.superseded_by) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["superseded_by"],
        message: "Superseded records must point to their replacement",
      });
    }
  });

export type FinancingRecord = z.infer<typeof financingRecordSchema>;
export type FinancingCategory = z.infer<typeof financingCategorySchema>;
