export function ChartLegend({ cashLabel = "כסף שהתקבל" }: { cashLabel?: string }) {
  return (
    <ul className="chart-legend" aria-label="מקרא התרשים">
      <li>
        <span className="chart-swatch chart-swatch-cash" aria-hidden="true" />
        {cashLabel}
      </li>
      <li>
        <span className="chart-swatch chart-swatch-guarantee" aria-hidden="true" />
        ערבויות — התחייבות מותנית
      </li>
    </ul>
  );
}
