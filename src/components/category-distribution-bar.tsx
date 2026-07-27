import type { FinancingRecord } from "../../schemas";
import { formatAgorot } from "../lib/format";
import {
  buildCategoryDistribution,
  financingCategoryLabels,
} from "../lib/visualizations";
import { ChartDataTable } from "./chart-data-table";
import { ChartLegend } from "./chart-legend";

function formatShare(share: number | null): string {
  if (share === null) return "לא דווח";
  return new Intl.NumberFormat("he-IL", {
    style: "percent",
    maximumFractionDigits: share < 0.01 ? 1 : 0,
  }).format(share);
}

export function CategoryDistributionBar({ records }: { records: FinancingRecord[] }) {
  const distribution = buildCategoryDistribution(records);
  const reportedCash = distribution.cash.filter((datum) => datum.amount !== null);
  const guaranteeScale = Math.max(distribution.cashTotal, distribution.guarantees ?? 0, 1);
  const guaranteeWidth = ((distribution.guarantees ?? 0) / guaranteeScale) * 100;
  let segmentOffset = 0;

  return (
    <section className="visualization-section" aria-labelledby="category-distribution-title">
      <div className="section-heading">
        <p className="section-kicker">לפי סוג מקור</p>
        <h2 id="category-distribution-title">חלוקת המימון שדווח</h2>
        <p>
          התקבולים מוצגים בחלוקה של 100%; הערבויות מוצגות במסלול נפרד ואינן כסף שהתקבל.
        </p>
      </div>

      <div className="category-chart-frame">
        <ChartLegend cashLabel="כסף או אשראי שהתקבלו" />
        {distribution.cashTotal > 0 ? (
          <>
            <div className="category-lane-heading">
              <strong>כסף או אשראי שהתקבלו</strong>
              <span>{formatAgorot(distribution.cashTotal)}</span>
            </div>
            <svg
              className="category-stacked-bar"
              viewBox="0 0 100 16"
              preserveAspectRatio="none"
              role="img"
              aria-label={`חלוקת כסף או אשראי שהתקבלו, בסך ${formatAgorot(distribution.cashTotal)}, לפי קטגוריה`}
            >
              {reportedCash.map((datum, index) => {
                const width = (datum.share ?? 0) * 100;
                const x = segmentOffset;
                segmentOffset += width;
                return (
                  <rect
                    key={datum.category}
                    className={`category-segment category-segment-${(index % 6) + 1}`}
                    x={x}
                    y="1"
                    width={width}
                    height="14"
                  />
                );
              })}
            </svg>
            <ul className="category-segment-labels">
              {reportedCash.map((datum, index) => (
                <li key={datum.category}>
                  <span
                    className={`category-key category-segment-${(index % 6) + 1}`}
                    aria-hidden="true"
                  />
                  <span>{financingCategoryLabels[datum.category]}</span>
                  <strong>{formatAgorot(datum.amount!)}</strong>
                  <span>{formatShare(datum.share)}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="chart-empty-state">לא דווח על כסף או אשראי שהתקבלו.</p>
        )}

        <div className="category-lane-heading">
          <strong>ערבויות — התחייבות מותנית</strong>
          <span>
            {distribution.guarantees === null
              ? "לא דווח"
              : formatAgorot(distribution.guarantees)}
          </span>
        </div>
        <svg
          className="category-guarantee-bar"
          viewBox="0 0 100 12"
          preserveAspectRatio="none"
          role="img"
          aria-label={
            distribution.guarantees === null
              ? "לא דווחו ערבויות"
              : `ערבויות מדווחות בסך ${formatAgorot(distribution.guarantees)}`
          }
        >
          <defs>
            <pattern id="category-guarantee-pattern" width="5" height="5" patternUnits="userSpaceOnUse">
              <rect width="5" height="5" className="chart-pattern-background" />
              <path d="M-1 5 5-1M2 8 8 2" className="chart-pattern-line" />
            </pattern>
          </defs>
          <rect className="chart-track" x="0" y="1" width="100" height="10" rx="2" />
          <rect
            x="0"
            y="1"
            width={guaranteeWidth}
            height="10"
            rx="2"
            fill="url(#category-guarantee-pattern)"
          />
        </svg>

        {distribution.missing.length > 0 && (
          <div className="missing-categories" aria-label="קטגוריות שלא דווחו">
            <strong>לא דווח:</strong>
            {distribution.missing.map((category) => (
              <span key={category}>{financingCategoryLabels[category]}</span>
            ))}
          </div>
        )}
      </div>

      <ChartDataTable
        label="טבלת נתוני חלוקת המימון"
        caption="סכומים מדווחים לפי קטגוריה. חובות והתחייבויות אינם מוצגים כמימון חיובי."
        columns={["קטגוריה", "סכום", "חלק מהכסף שהתקבל", "מהות"]}
        rows={[
          ...distribution.cash.map((datum) => ({
            key: datum.category,
            cells: [
              financingCategoryLabels[datum.category],
              datum.amount === null ? "לא דווח" : formatAgorot(datum.amount),
              formatShare(datum.share),
              "כסף או אשראי שהתקבלו",
            ],
          })),
          {
            key: "guarantee",
            cells: [
              financingCategoryLabels.guarantee,
              distribution.guarantees === null
                ? "לא דווח"
                : formatAgorot(distribution.guarantees),
              "לא חל",
              "התחייבות מותנית",
            ],
          },
          {
            key: "debt_liability",
            cells: [
              financingCategoryLabels.debt_liability,
              distribution.liabilities === null
                ? "לא דווח"
                : formatAgorot(distribution.liabilities),
              "לא חל",
              "חוב או התחייבות; אינו מימון חיובי",
            ],
          },
        ]}
      />
    </section>
  );
}
