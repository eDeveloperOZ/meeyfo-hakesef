import type { FinancingRecord } from "../../schemas";
import { formatAgorot } from "../lib/format";
import { buildMonthlyFlow } from "../lib/visualizations";
import { ChartDataTable } from "./chart-data-table";
import { ChartLegend } from "./chart-legend";

function monthLabel(month: string, long = false): string {
  return new Intl.DateTimeFormat("he-IL", {
    month: long ? "long" : "short",
    year: "numeric",
    timeZone: "Asia/Jerusalem",
  }).format(new Date(`${month}-01T12:00:00Z`));
}

export function MonthlyFlowChart({
  records,
  startMonth,
  endMonth,
}: {
  records: FinancingRecord[];
  startMonth: string;
  endMonth: string;
}) {
  const months = buildMonthlyFlow(records, startMonth, endMonth);
  const max = Math.max(...months.map((month) => month.total), 1);
  const topMonth = months.reduce(
    (top, month) => (month.total > top.total ? month : top),
    months[0],
  );
  const chartWidth = Math.max(months.length * 24 + 48, 720);
  const baseline = 210;
  const chartHeight = 240;
  const usableHeight = 172;

  return (
    <section className="visualization-section" aria-labelledby="monthly-flow-title">
      <div className="section-heading">
        <p className="section-kicker">נובמבר 2022 עד העדכון הנוכחי</p>
        <h2 id="monthly-flow-title">סכומים מדווחים לפי חודש</h2>
        <p>
          {topMonth && topMonth.total > 0
            ? `הסכום החודשי הגבוה ביותר דווח ב־${monthLabel(topMonth.month, true)}: ${formatAgorot(topMonth.total)}.`
            : "לא דווחו תרומות או ערבויות בחלון הזמן."}
        </p>
      </div>
      <div className="monthly-chart-frame">
        <ChartLegend cashLabel="תרומות" />
        <div
          className="monthly-chart-scroll"
          tabIndex={0}
          aria-label="תרשים חודשי; ניתן לגלילה אופקית"
        >
          <svg
            className="monthly-flow-svg"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            role="img"
            aria-label={`תרומות וערבויות שדווחו בכל חודש בין ${monthLabel(startMonth, true)} לבין ${monthLabel(endMonth, true)}`}
          >
            <defs>
              <pattern
                id="monthly-guarantee-pattern"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
              >
                <rect width="6" height="6" className="chart-pattern-background" />
                <path d="M-1 6 6-1M3 9 9 3" className="chart-pattern-line" />
              </pattern>
            </defs>
            <line
              className="chart-axis-line"
              x1="28"
              y1={baseline}
              x2={chartWidth - 12}
              y2={baseline}
            />
            {months.map((month, index) => {
              const x = 34 + index * 24;
              const donationHeight = (month.donations / max) * usableHeight;
              const guaranteeHeight = (month.guarantees / max) * usableHeight;
              const showTick = index % 6 === 0 || index === months.length - 1;
              return (
                <g key={month.month}>
                  <rect
                    className="chart-cash-fill"
                    x={x}
                    y={baseline - donationHeight}
                    width="8"
                    height={donationHeight}
                    rx="1"
                  />
                  <rect
                    x={x + 9}
                    y={baseline - guaranteeHeight}
                    width="8"
                    height={guaranteeHeight}
                    rx="1"
                    fill="url(#monthly-guarantee-pattern)"
                  />
                  {showTick && (
                    <>
                      <line
                        className="chart-axis-line"
                        x1={x + 8}
                        y1={baseline}
                        x2={x + 8}
                        y2={baseline + 5}
                      />
                      <text
                        className="chart-axis-label"
                        x={x + 8}
                        y={baseline + 20}
                        textAnchor="middle"
                      >
                        {month.month.slice(5)}/{month.month.slice(2, 4)}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      <ChartDataTable
        label="טבלת נתונים חודשית מלאה"
        caption="תרומות וערבויות לפי חודש. חודשים ללא רשומה מוצגים בסכום אפס."
        columns={["חודש", "תרומות", "ערבויות", "סך הכול"]}
        rows={months.map((month) => ({
          key: month.month,
          cells: [
            monthLabel(month.month, true),
            formatAgorot(month.donations),
            formatAgorot(month.guarantees),
            formatAgorot(month.total),
          ],
        }))}
      />
    </section>
  );
}
