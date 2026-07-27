import type { FinancingCategory } from "../../schemas";
import type { FinancialSummary } from "../lib/finance";
import { formatAgorot } from "../lib/format";

const categories: { id: FinancingCategory; label: string; kind: "cash" | "contingent" | "debt" }[] =
  [
    { id: "donation", label: "תרומות", kind: "cash" },
    { id: "guarantee", label: "ערבויות", kind: "contingent" },
    { id: "bank_loan", label: "הלוואות בנקאיות", kind: "cash" },
    { id: "knesset_loan_or_advance", label: "הלוואות או מקדמות מהכנסת", kind: "cash" },
    { id: "public_funding", label: "מימון ציבורי", kind: "cash" },
    { id: "membership_fees", label: "דמי חבר", kind: "cash" },
    { id: "other_official_income", label: "הכנסות רשמיות אחרות", kind: "cash" },
    { id: "debt_liability", label: "חובות והתחייבויות", kind: "debt" },
  ];

export function FinancingBreakdown({ summary }: { summary: FinancialSummary }) {
  const values = categories
    .map((category) => summary.categoryTotals[category.id])
    .filter((value): value is number => value !== null);
  const max = Math.max(...values, 1);

  return (
    <section className="breakdown-section" aria-labelledby="breakdown-title">
      <div className="section-heading">
        <p className="section-kicker">לפי סוג מקור</p>
        <h2 id="breakdown-title">תמונת המימון</h2>
      </div>
      <div className="chart-shell" aria-hidden="true">
        <svg viewBox="0 0 100 192" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <defs>
            <pattern id="guarantee-pattern" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M0 4 4 0" stroke="currentColor" strokeWidth="0.8" />
            </pattern>
            <pattern id="debt-pattern" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M0 0 5 5M5 0 0 5" stroke="currentColor" strokeWidth="0.6" />
            </pattern>
          </defs>
          {categories.map((category, index) => {
            const value = summary.categoryTotals[category.id];
            const width = value === null ? 0 : Math.max((value / max) * 94, 2);
            return (
              <rect
                key={category.id}
                x={0}
                y={index * 24 + 4}
                width={width}
                height={14}
                rx={3}
                className={`chart-bar chart-bar-${category.kind}`}
                fill={
                  category.kind === "contingent"
                    ? "url(#guarantee-pattern)"
                    : category.kind === "debt"
                      ? "url(#debt-pattern)"
                      : "currentColor"
                }
              />
            );
          })}
        </svg>
      </div>
      <div className="table-scroll">
        <table>
          <caption>סכומים מדווחים לפי קטגוריה; ערבות וחוב אינם כסף שהתקבל</caption>
          <thead>
            <tr>
              <th scope="col">קטגוריה</th>
              <th scope="col">סכום</th>
              <th scope="col">מהות</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const value = summary.categoryTotals[category.id];
              return (
                <tr key={category.id}>
                  <th scope="row">{category.label}</th>
                  <td>{value === null ? "לא דווח" : formatAgorot(value)}</td>
                  <td>
                    {category.kind === "cash"
                      ? "תקבול או אשראי שהתקבל"
                      : category.kind === "contingent"
                        ? "התחייבות מותנית"
                        : "חוב או התחייבות"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
