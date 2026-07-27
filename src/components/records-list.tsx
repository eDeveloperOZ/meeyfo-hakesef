import Link from "next/link";
import type { FinancingRecord, Organization, Party, Person, Source } from "../../schemas";
import { formatAgorot, formatHebrewDate } from "../lib/format";
import { sortRecordsByAmount } from "../lib/finance";
import { RecordDetailsDialog } from "./record-details-dialog";

const categoryLabels: Record<FinancingRecord["category"], string> = {
  donation: "תרומה",
  guarantee: "ערבות",
  bank_loan: "הלוואה בנקאית",
  knesset_loan_or_advance: "הלוואה או מקדמה מהכנסת",
  public_funding: "מימון ציבורי",
  membership_fees: "דמי חבר",
  other_official_income: "הכנסה רשמית אחרת",
  debt_liability: "חוב או התחייבות",
};

export function RecordsList({
  records,
  party,
  sources,
  persons,
  organizations,
}: {
  records: FinancingRecord[];
  party: Party;
  sources: Source[];
  persons: Person[];
  organizations: Organization[];
}) {
  const sorted = sortRecordsByAmount(records);

  return (
    <section className="records-section" aria-labelledby="records-title">
      <div className="section-heading">
        <p className="section-kicker">מהסכום הגבוה לנמוך</p>
        <h2 id="records-title">רשומות המימון</h2>
      </div>
      {sorted.length === 0 ? (
        <div className="empty-state">
          <strong>טרם אותרו דיווחים רשמיים זמינים מאז הבחירות לכנסת ה־25</strong>
          <p>
            נבדקו שער מימון המפלגות של מבקר המדינה ומקורות הכנסת. הבדיקה האחרונה מתועדת בעמוד
            המקורות ובמתודולוגיה.
          </p>
        </div>
      ) : (
        <ol className="records-list">
          {sorted.map((record) => {
            const source = sources.find((item) => item.source_id === record.source_id);
            if (!source) return null;
            const person = persons.find((item) => item.person_id === record.person_id);
            const organization = organizations.find((item) => item.org_id === record.org_id);
            const profileId = person?.person_id ?? organization?.org_id;
            return (
              <li key={record.record_id} className="record-row">
                <div>
                  <span className={`record-kind record-kind-${record.category}`}>
                    {categoryLabels[record.category]}
                  </span>
                  {record.in_statutory_election_period && (
                    <span className="statutory-period-badge">בתקופת הבחירות הרשמית</span>
                  )}
                  <strong>{formatAgorot(record.amount_agorot)}</strong>
                  <span>{formatHebrewDate(record.event_date)}</span>
                </div>
                <div className="record-counterparty">
                  {profileId ? (
                    <Link href={`/who/${profileId}`}>
                      {person?.full_name_he ?? organization?.name_he}
                    </Link>
                  ) : (
                    <span>ללא צד שכנגד שפורסם</span>
                  )}
                </div>
                <RecordDetailsDialog
                  record={record}
                  party={party}
                  source={source}
                  person={person}
                  organization={organization}
                />
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
