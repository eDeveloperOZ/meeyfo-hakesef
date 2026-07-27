import type { PartyFinancialScope } from "../../schemas";
import { formatHebrewDate } from "../lib/format";

export function FormulaDisclosure({
  scope,
  netPositionCalculated,
}: {
  scope: PartyFinancialScope;
  netPositionCalculated: boolean;
}) {
  return (
    <details className="formula-disclosure">
      <summary>איך חושב המספר הזה?</summary>
      <div>
        <p>
          {netPositionCalculated
            ? "יתרה מדווחת נטו = הכנסה מדווחת לפי הגדרת האתר פחות חובות והתחייבויות בני־השוואה."
            : "הכנסה מדווחת לפי הגדרת האתר = תקבולים ואשראי שדווחו + ערבויות פעילות שדווחו."}
        </p>
        <ul>
          <li>
            ערבויות נכללות בסכום ההכנסה המדווחת לפי החלטת הפרויקט, אך נשארות מסומנות כהתחייבות
            מותנית ולא ככסף שהתקבל.
          </li>
          <li>רשומות שהוחזרו או הוחלפו אינן נכללות.</li>
          <li>
            חלון התצוגה:{" "}
            {scope.measurement_start && scope.measurement_end
              ? `${formatHebrewDate(scope.measurement_start)}–${formatHebrewDate(scope.measurement_end)}`
              : "לא נקבע חלון בר־השוואה"}
            .
          </li>
          <li>התקופה הסטטוטורית מסומנת בכל רשומה ואינה משמשת כמסנן.</li>
          <li>
            מימון ציבורי:{" "}
            {scope.public_funding_status === "actual"
              ? "סכום ששולם"
              : scope.public_funding_status === "projected"
                ? "תחזית מסומנת"
                : "טרם סווג"}
            .
          </li>
        </ul>
        <p>{scope.note_he}</p>
      </div>
    </details>
  );
}
