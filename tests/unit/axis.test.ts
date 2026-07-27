import { expect, it } from "vitest";
import type { AxisPosition, Party } from "../../schemas";
import { orderPartiesByAxis } from "../../src/lib/axis";

const positions = [
  {
    axis_position_id: "right",
    lane: "right",
    order_index: 1,
    label_he: "ימין",
    rationale_he: "נימוק",
    source_ids: "source",
  },
  {
    axis_position_id: "left",
    lane: "left",
    order_index: 1,
    label_he: "שמאל",
    rationale_he: "נימוק",
    source_ids: "source",
  },
  {
    axis_position_id: "off",
    lane: "off_axis",
    order_index: 1,
    label_he: "מחוץ לציר",
    rationale_he: "נימוק",
    source_ids: "source",
  },
] satisfies AxisPosition[];

function party(party_id: string, axis_position_id: string): Party {
  return {
    party_id,
    name_he: party_id,
    legal_name_he: party_id,
    entity_type: "party",
    status: "knesset",
    eligibility_basis_he: "ייצוג",
    eligibility_source_id: "source",
    website_url: "",
    logo_file: "",
    mark_he: party_id.slice(0, 3).padEnd(2, "x"),
    brand_color: "#000000",
    axis_position_id,
    notes: "",
  };
}

it("orders the right edge before the left and keeps off-axis parties separate at the end", () => {
  const ordered = orderPartiesByAxis(
    [party("off-party", "off"), party("left-party", "left"), party("right-party", "right")],
    positions,
  );
  expect(ordered.map(({ party_id }) => party_id)).toEqual([
    "right-party",
    "left-party",
    "off-party",
  ]);
});
