import { z } from "zod";
import { idSchema, nonNegativeIntegerStringSchema } from "./common";

export const axisPositionSchema = z.object({
  axis_position_id: idSchema,
  lane: z.enum(["far_right", "right", "center_right", "center", "center_left", "left", "off_axis"]),
  order_index: nonNegativeIntegerStringSchema,
  label_he: z.string().trim().min(1),
  rationale_he: z.string().trim().min(1),
  source_ids: z.string().trim().min(1),
});

export type AxisPosition = z.infer<typeof axisPositionSchema>;
