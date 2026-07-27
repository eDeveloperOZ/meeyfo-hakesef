import type { PartyFinancialScope } from "../../schemas";
import type { FinancialSummary } from "../lib/finance";
import { formatAgorot } from "../lib/format";
import { FormulaDisclosure } from "./formula-disclosure";

export function MetricHeadline({
  summary,
  scope,
}: {
  summary: FinancialSummary;
  scope: PartyFinancialScope;
}) {
  const hasNet = summary.netPosition !== null;
  const hasReportedRecords = Object.values(summary.categoryTotals).some((value) => value !== null);
  return (
    <section className="metric-panel" aria-labelledby="headline-metric">
      <p className="section-kicker">תמונת מצב מדווחת</p>
      <h2 id="headline-metric">{hasNet ? "יתרה מדווחת נטו" : "מקורות מימון שדווחו"}</h2>
      <p className="metric-number">
        {hasNet
          ? formatAgorot(summary.netPosition!)
          : hasReportedRecords
            ? formatAgorot(summary.reportedIncome)
            : "לא דווח"}
      </p>
      <p className="metric-subtitle">
        {hasNet
          ? "תקבולים וחובות שנבדקו לאותו חלון מדידה"
          : hasReportedRecords
            ? "סך התקבולים והערבויות שדווחו מאז הבחירות לכנסת ה־25; הערבויות מסומנות כהתחייבות מותנית"
            : "לא אותרה רשומת מימון זמינה מאז הבחירות לכנסת ה־25; אין לפרש זאת כאפס"}
      </p>
      {hasReportedRecords && (
        <dl className="metric-secondary">
          <div>
            <dt>מתוכם כסף או אשראי שהתקבלו</dt>
            <dd>{formatAgorot(summary.reportedCashInflows)}</dd>
          </div>
          <div>
            <dt>מתוכם ערבויות</dt>
            <dd>{formatAgorot(summary.reportedGuarantees)}</dd>
          </div>
          <div>
            <dt>מתוך ההכנסה המדווחת בתקופת הבחירות הרשמית</dt>
            <dd>{formatAgorot(summary.statutoryIncome)}</dd>
          </div>
          <div>
            <dt>ערבויות בתקופת הבחירות הרשמית</dt>
            <dd>{formatAgorot(summary.statutoryGuarantees)}</dd>
          </div>
        </dl>
      )}
      {!hasNet && (
        <div className="state-card" role="status">
          <strong>אין די מידע רשמי לחישוב יתרה נטו</strong>
          <span>{scope.note_he}</span>
        </div>
      )}
      <FormulaDisclosure scope={scope} netPositionCalculated={hasNet} />
    </section>
  );
}
