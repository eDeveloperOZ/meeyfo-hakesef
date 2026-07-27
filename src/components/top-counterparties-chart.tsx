import Link from "next/link";
import type { FinancingRecord, Organization, Person } from "../../schemas";
import { formatAgorot } from "../lib/format";
import { buildTopCounterparties } from "../lib/visualizations";
import { ChartDataTable } from "./chart-data-table";
import { ChartLegend } from "./chart-legend";
import { DualHorizontalBar } from "./dual-horizontal-bar";

export function TopCounterpartiesChart({
  records,
  persons,
  organizations,
}: {
  records: FinancingRecord[];
  persons: Person[];
  organizations: Organization[];
}) {
  const counterparties = buildTopCounterparties(records, persons, organizations);
  const max = Math.max(...counterparties.map((datum) => datum.total), 1);

  return (
    <section className="visualization-section" aria-labelledby="top-counterparties-title">
      <div className="section-heading">
        <p className="section-kicker">תרומות וערבויות · מהסכום הגבוה לנמוך</p>
        <h2 id="top-counterparties-title">הצדדים הגדולים שדווחו</h2>
        <p>
          עד עשרה אנשים או ארגונים לפי הסכום המצטבר שפורסם. ערבויות מוצגות בדוגמה נפרדת.
        </p>
      </div>
      {counterparties.length === 0 ? (
        <div className="chart-empty-state">לא דווחו צדדים שכנגד בתרומות או בערבויות.</div>
      ) : (
        <>
          <div className="horizontal-chart-frame">
            <ChartLegend cashLabel="תרומות" />
            <ol className="horizontal-chart-list">
              {counterparties.map((datum) => (
                <li key={datum.profileId} className="horizontal-chart-row">
                  <Link href={`/who/${datum.profileId}`}>{datum.name}</Link>
                  <DualHorizontalBar
                    cash={datum.donations}
                    guarantees={datum.guarantees}
                    max={max}
                    patternId={`counterparty-guarantee-${datum.profileId}`}
                    label={datum.name}
                  />
                  <strong>{formatAgorot(datum.total)}</strong>
                </li>
              ))}
            </ol>
          </div>
          <ChartDataTable
            label="טבלת נתוני הצדדים הגדולים"
            caption="עשרת הצדדים הגדולים שדווחו, לפי סכום מצטבר של תרומות וערבויות."
            columns={["צד שכנגד", "תרומות", "ערבויות", "סך הכול"]}
            rows={counterparties.map((datum) => ({
              key: datum.profileId,
              cells: [
                <Link key={datum.profileId} href={`/who/${datum.profileId}`}>
                  {datum.name}
                </Link>,
                formatAgorot(datum.donations),
                formatAgorot(datum.guarantees),
                formatAgorot(datum.total),
              ],
            }))}
          />
        </>
      )}
    </section>
  );
}
