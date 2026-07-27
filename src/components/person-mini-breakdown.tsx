import Link from "next/link";
import type { FinancingRecord, Party } from "../../schemas";
import { formatAgorot } from "../lib/format";
import { buildPersonBreakdown } from "../lib/visualizations";
import { ChartDataTable } from "./chart-data-table";
import { ChartLegend } from "./chart-legend";
import { DualHorizontalBar } from "./dual-horizontal-bar";

export function PersonMiniBreakdown({
  records,
  parties,
}: {
  records: FinancingRecord[];
  parties: Party[];
}) {
  const breakdown = buildPersonBreakdown(records, parties);
  const max = Math.max(...breakdown.map((datum) => datum.total), 1);
  if (breakdown.length === 0) return null;

  return (
    <section className="visualization-section person-mini-chart" aria-labelledby="person-breakdown-title">
      <div className="section-heading">
        <p className="section-kicker">לפי מפלגה ושנה</p>
        <h2 id="person-breakdown-title">פירוט הסכומים המדווחים</h2>
      </div>
      <div className="horizontal-chart-frame">
        <ChartLegend />
        <ol className="horizontal-chart-list">
          {breakdown.map((datum) => (
            <li key={`${datum.partyId}:${datum.year}`} className="horizontal-chart-row">
              <span>
                <Link href={`/party/${datum.partyId}`}>{datum.partyName}</Link>
                <small>{datum.year}</small>
              </span>
              <DualHorizontalBar
                cash={datum.receivedCash}
                guarantees={datum.guarantees}
                max={max}
                patternId={`person-guarantee-${datum.partyId}-${datum.year}`}
                label={`${datum.partyName}, ${datum.year}`}
              />
              <strong>{formatAgorot(datum.total)}</strong>
            </li>
          ))}
        </ol>
      </div>
      <ChartDataTable
        label="טבלת פירוט לפי מפלגה ושנה"
        caption="סכומי האדם או הארגון לפי מפלגה ושנת הרשומה."
        columns={["מפלגה ושנה", "כסף שהתקבל", "ערבויות", "סך הכול"]}
        rows={breakdown.map((datum) => ({
          key: `${datum.partyId}:${datum.year}`,
          cells: [
            <>
              <Link href={`/party/${datum.partyId}`}>{datum.partyName}</Link> · {datum.year}
            </>,
            formatAgorot(datum.receivedCash),
            formatAgorot(datum.guarantees),
            formatAgorot(datum.total),
          ],
        }))}
      />
    </section>
  );
}
