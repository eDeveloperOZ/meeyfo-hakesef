import type { AxisPosition, Party } from "../../schemas";

export const axisLaneOrder: AxisPosition["lane"][] = [
  "far_right",
  "right",
  "center_right",
  "center",
  "center_left",
  "left",
  "off_axis",
];

export function orderPartiesByAxis(parties: Party[], positions: AxisPosition[]): Party[] {
  const positionById = new Map(positions.map((position) => [position.axis_position_id, position]));
  return [...parties].sort((left, right) => {
    const leftPosition = positionById.get(left.axis_position_id);
    const rightPosition = positionById.get(right.axis_position_id);
    if (!leftPosition || !rightPosition) {
      return left.name_he.localeCompare(right.name_he, "he");
    }
    const laneDifference =
      axisLaneOrder.indexOf(leftPosition.lane) - axisLaneOrder.indexOf(rightPosition.lane);
    return (
      laneDifference ||
      leftPosition.order_index - rightPosition.order_index ||
      left.name_he.localeCompare(right.name_he, "he")
    );
  });
}
