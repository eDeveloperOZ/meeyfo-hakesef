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
            ? formatAgorot(summary.reportedInflows)
            : "לא דווח"}
      </p>
      <p className="metric-subtitle">
        {hasNet
          ? "תקבולים וחובות שנבדקו לאותו חלון מדידה"
          : hasReportedRecords
            ? "סכום הרשומות שסומנו ככסף שהתקבל; ערבויות וחובות מוצגים בנפרד"
            : "לא אותרה רשומת מימון זמינה בהיקף שנבדק; אין לפרש זאת כאפס"}
      </p>
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
