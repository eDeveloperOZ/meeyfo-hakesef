import { z } from "zod";

export const idSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9][a-z0-9-]*$/, "IDs must use lowercase letters, numbers, and hyphens");

export const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const isoDateTimeSchema = z.string().datetime({ offset: true });
export const optionalStringSchema = z.string().trim().optional().default("");
export const optionalDateSchema = z.union([isoDateSchema, z.literal("")]).default("");
export const urlOrEmptySchema = z.union([z.string().url(), z.literal("")]);

export const csvBooleanSchema = z.enum(["true", "false"]).transform((value) => value === "true");

export const positiveIntegerStringSchema = z
  .string()
  .regex(/^[1-9]\d*$/)
  .transform((value) => Number.parseInt(value, 10))
  .pipe(z.number().int().positive().safe());

export const nonNegativeIntegerStringSchema = z
  .string()
  .regex(/^\d+$/)
  .transform((value) => Number.parseInt(value, 10))
  .pipe(z.number().int().nonnegative().safe());
