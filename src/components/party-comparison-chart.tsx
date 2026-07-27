import Link from "next/link";
import type { FinancingRecord, Party } from "../../schemas";
import { formatAgorot } from "../lib/format";
import { buildPartyComparison } from "../lib/visualizations";
import { ChartDataTable } from "./chart-data-table";
import { ChartLegend } from "./chart-legend";
import { DualHorizontalBar } from "./dual-horizontal-bar";

export function PartyComparisonChart({
  parties,
  records,
}: {
  parties: Party[];
  records: FinancingRecord[];
}) {
  const comparison = buildPartyComparison(parties, records);
  const max = Math.max(...comparison.flatMap((datum) => [datum.receivedCash, datum.guarantees]), 1);

  return (
    <section
      className="visualization-section home-comparison"
      aria-labelledby="party-comparison-title"
    >
      <div className="section-heading section-heading-split">
        <div>
          <p className="section-kicker">כל המפלגות · לפי כסף שהתקבל</p>
          <h2 id="party-comparison-title">השוואת מקורות המימון שדווחו</h2>
        </div>
        <p>האורך מייצג סכום על סולם אחיד. ערבויות מוצגות בדוגמה נפרדת ואינן כסף שהתקבל.</p>
      </div>
      <div className="horizontal-chart-frame party-comparison-frame">
        <ChartLegend />
        <ol className="horizontal-chart-list">
          {comparison.map((datum) => (
            <li key={datum.partyId} className="horizontal-chart-row">
              <Link href={`/party/${datum.partyId}`}>{datum.partyName}</Link>
              <DualHorizontalBar
                cash={datum.receivedCash}
                guarantees={datum.guarantees}
                max={max}
                patternId={`comparison-guarantee-${datum.partyId}`}
                label={datum.partyName}
              />
              <strong>{datum.hasRecords ? formatAgorot(datum.receivedCash) : "לא דווח"}</strong>
            </li>
          ))}
        </ol>
      </div>
      <ChartDataTable
        label="טבלת השוואה מלאה"
        caption="כל המפלגות לפי סכום כסף או אשראי שהתקבלו, מהגבוה לנמוך."
        columns={["מפלגה", "כסף שהתקבל", "ערבויות"]}
        rows={comparison.map((datum) => ({
          key: datum.partyId,
          cells: [
            <Link key={datum.partyId} href={`/party/${datum.partyId}`}>
              {datum.partyName}
            </Link>,
            datum.hasRecords ? formatAgorot(datum.receivedCash) : "לא דווח",
            datum.hasRecords ? formatAgorot(datum.guarantees) : "לא דווח",
          ],
        }))}
      />
    </section>
  );
}
