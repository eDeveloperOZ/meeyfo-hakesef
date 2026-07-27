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
  const reportedCategories = categories.filter(
    (category) => summary.categoryTotals[category.id] !== null,
  );
  const missingCategories = categories.filter(
    (category) => summary.categoryTotals[category.id] === null,
  );
  const values = reportedCategories.map(
    (category) => summary.categoryTotals[category.id] as number,
  );
  const max = Math.max(...values, 1);

  return (
    <section className="breakdown-section" aria-labelledby="breakdown-title">
      <div className="section-heading">
        <p className="section-kicker">לפי סוג מקור</p>
        <h2 id="breakdown-title">תמונת המימון</h2>
      </div>
      <div className="chart-shell" aria-hidden="true">
        {reportedCategories.map((category) => {
          const value = summary.categoryTotals[category.id] as number;
          const width = Math.max((value / max) * 100, 2);
          return (
            <div className="chart-row" key={category.id}>
              <span>{category.label}</span>
              <svg
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                focusable="false"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id={`pattern-${category.id}`}
                    width="4"
                    height="4"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M0 4 4 0" stroke="currentColor" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect className="chart-track" x="0" y="1" width="100" height="10" rx="2" />
                <rect
                  x="0"
                  y="1"
                  width={width}
                  height="10"
                  rx="2"
                  className={`chart-bar chart-bar-${category.kind}`}
                  fill={category.kind === "cash" ? "currentColor" : `url(#pattern-${category.id})`}
                />
              </svg>
              <strong>{formatAgorot(value)}</strong>
            </div>
          );
        })}
      </div>
      {missingCategories.length > 0 && (
        <div className="missing-categories" aria-label="קטגוריות שלא דווחו">
          <strong>לא דווח:</strong>
          {missingCategories.map((category) => (
            <span key={category.id}>{category.label}</span>
          ))}
        </div>
      )}
      <div className="table-scroll">
        <table>
          <caption>סכומים מדווחים לפי קטגוריה; ערבות היא התחייבות מותנית ואינה כסף שהתקבל</caption>
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
