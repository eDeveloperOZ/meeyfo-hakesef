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
            ? "יתרה מדווחת נטו = תקבולים מדווחים שהתקבלו פחות חובות והתחייבויות בני־השוואה."
            : "המספר מסכם רק רשומות שסומנו ככסף שהתקבל: תרומות, הלוואות, מקדמות או הלוואות מהכנסת, מימון ציבורי, דמי חבר והכנסות רשמיות אחרות."}
        </p>
        <ul>
          <li>ערבויות אינן נכללות לעולם בסכום הכסף שהתקבל.</li>
          <li>רשומות שהוחזרו או הוחלפו אינן נכללות.</li>
          <li>
            חלון המדידה:{" "}
            {scope.measurement_start && scope.measurement_end
              ? `${formatHebrewDate(scope.measurement_start)}–${formatHebrewDate(scope.measurement_end)}`
              : "לא נקבע חלון בר־השוואה"}
            .
          </li>
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
