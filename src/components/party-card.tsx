import Link from "next/link";
import type { Party } from "../../schemas";
import { calculateFinancialSummary } from "../lib/finance";
import { formatAgorot } from "../lib/format";
import { getPartyRecords, getPartyScope } from "../lib/data";
import { PartyMark } from "./party-mark";

const statusLabels: Record<Party["status"], string> = {
  knesset: "מיוצגת בכנסת הנוכחית",
  polled: "נכללה לפי כלל הסקרים",
  owner_exception: "נכללה כחריג מתועד",
};

export function PartyCard({ party }: { party: Party }) {
  const scope = getPartyScope(party.party_id);
  if (!scope) return null;
  const summary = calculateFinancialSummary(getPartyRecords(party.party_id), scope);
  const hasRecords = Object.values(summary.categoryTotals).some((value) => value !== null);
  return (
    <article
      className="party-card"
      style={{ "--party-color": party.brand_color } as React.CSSProperties}
    >
      <Link href={`/party/${party.party_id}`} className="party-card-link">
        <PartyMark party={party} />
        <span className="party-card-copy">
          <strong>{party.name_he}</strong>
          <span>{statusLabels[party.status]}</span>
          <span className="party-card-metrics">
            <span>
              <span>הכנסה מדווחת</span>
              <strong>{hasRecords ? formatAgorot(summary.reportedIncome) : "לא דווח"}</strong>
            </span>
            <span>
              <span>מתוכה ערבויות</span>
              <strong>
                {summary.categoryTotals.guarantee === null
                  ? "לא דווח"
                  : formatAgorot(summary.reportedGuarantees)}
              </strong>
            </span>
          </span>
        </span>
        <span aria-hidden="true" className="party-card-arrow">
          ←
        </span>
      </Link>
    </article>
  );
}
