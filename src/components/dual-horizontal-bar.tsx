import { formatAgorot } from "../lib/format";

export function DualHorizontalBar({
  cash,
  guarantees,
  max,
  patternId,
  label,
}: {
  cash: number;
  guarantees: number;
  max: number;
  patternId: string;
  label: string;
}) {
  const cashWidth = max === 0 ? 0 : (cash / max) * 100;
  const guaranteeWidth = max === 0 ? 0 : (guarantees / max) * 100;
  return (
    <svg
      className="dual-horizontal-bar"
      viewBox="0 0 100 28"
      preserveAspectRatio="none"
      role="img"
      aria-label={`${label}: כסף שהתקבל ${formatAgorot(cash)}; ערבויות ${formatAgorot(guarantees)}`}
    >
      <defs>
        <pattern id={patternId} width="5" height="5" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" className="chart-pattern-background" />
          <path d="M-1 5 5-1M2 8 8 2" className="chart-pattern-line" />
        </pattern>
      </defs>
      <rect className="chart-track" x="0" y="2" width="100" height="9" rx="2" />
      <rect className="chart-cash-fill" x="0" y="2" width={cashWidth} height="9" rx="2" />
      <rect className="chart-track" x="0" y="17" width="100" height="9" rx="2" />
      <rect x="0" y="17" width={guaranteeWidth} height="9" rx="2" fill={`url(#${patternId})`} />
    </svg>
  );
}
