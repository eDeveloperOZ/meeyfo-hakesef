"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ExternalLink, X } from "lucide-react";
import type { FinancingRecord, Organization, Party, Person, Source } from "../../schemas";
import { formatAgorot, formatHebrewDate } from "../lib/format";
import { trackPublicEvent } from "./analytics";

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

export function RecordDetailsDialog({
  record,
  party,
  source,
  person,
  organization,
}: {
  record: FinancingRecord;
  party: Party;
  source: Source;
  person?: Person;
  organization?: Organization;
}) {
  const counterparty = person?.full_name_he ?? organization?.name_he ?? "לא צוין בדיווח";

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="secondary-button" type="button">
          מידע נוסף
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="dialog-header">
            <div>
              <Dialog.Title>פרטי הרשומה</Dialog.Title>
              <Dialog.Description>
                {categoryLabels[record.category]} עבור {party.name_he}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="icon-button" type="button" aria-label="סגירת פרטי הרשומה">
                <X aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <dl className="record-details">
            <div>
              <dt>סכום מדויק</dt>
              <dd>{formatAgorot(record.amount_agorot)}</dd>
            </div>
            {record.event_date === record.report_date ? (
              <div>
                <dt>תאריך כפי שפורסם במקור</dt>
                <dd>{formatHebrewDate(record.event_date)}</dd>
              </div>
            ) : (
              <>
                <div>
                  <dt>תאריך האירוע</dt>
                  <dd>{formatHebrewDate(record.event_date)}</dd>
                </div>
                <div>
                  <dt>תאריך הדיווח</dt>
                  <dd>{formatHebrewDate(record.report_date)}</dd>
                </div>
              </>
            )}
            <div>
              <dt>צד שכנגד</dt>
              <dd>{counterparty}</dd>
            </div>
            <div>
              <dt>הישות המקבלת</dt>
              <dd>{party.legal_name_he}</dd>
            </div>
            <div>
              <dt>כסף שהתקבל</dt>
              <dd>{record.cash_received ? "כן" : "לא"}</dd>
            </div>
            <div>
              <dt>התחייבות מותנית</dt>
              <dd>{record.contingent ? "כן" : "לא"}</dd>
            </div>
            <div>
              <dt>צפוי פירעון</dt>
              <dd>{record.repayment_expected ? "כן" : "לא"}</dd>
            </div>
            <div>
              <dt>בתקופת הבחירות הרשמית</dt>
              <dd>{record.in_statutory_election_period ? "כן" : "לא"}</dd>
            </div>
          </dl>
          {record.notes && <p className="record-note">{record.notes}</p>}
          <a
            className="primary-button"
            href={source.url}
            target="_blank"
            rel="noopener noreferrer external"
            onClick={() => trackPublicEvent("source_link_open", { source_id: source.source_id })}
          >
            לצפייה במקור הרשמי
            <ExternalLink aria-hidden="true" size={17} />
            <span className="sr-only">(נפתח בחלון חדש)</span>
          </a>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
