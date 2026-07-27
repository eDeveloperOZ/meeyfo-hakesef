import Link from "next/link";
import type { FinancingRecord, Organization, Person } from "../../schemas";
import { activeRecords } from "../lib/finance";
import { formatAgorot } from "../lib/format";
import { buildTopCounterparties } from "../lib/visualizations";

export function PartyStatBand({
  records,
  persons,
  organizations,
}: {
  records: FinancingRecord[];
  persons: Person[];
  organizations: Organization[];
}) {
  const active = activeRecords(records);
  const sourceCount = new Set(active.map((record) => record.source_id)).size;
  const guarantees = active
    .filter(
      (record) =>
        record.category === "guarantee" &&
        record.status === "active" &&
        record.contingent &&
        !record.cash_received,
    )
    .reduce((total, record) => total + record.amount_agorot, 0);
  const topCounterparty = buildTopCounterparties(active, persons, organizations, 1)[0];

  return (
    <dl className="party-stat-band" aria-label="נתוני מפתח על דיווחי המפלגה">
      <div>
        <dt>מקורות שדווחו</dt>
        <dd>{sourceCount || "לא דווח"}</dd>
      </div>
      <div>
        <dt>ערבויות</dt>
        <dd>{guarantees > 0 ? formatAgorot(guarantees) : "לא דווח"}</dd>
        <dd className="party-stat-note">התחייבות מותנית</dd>
      </div>
      <div>
        <dt>מספר רשומות</dt>
        <dd>{active.length || "לא דווח"}</dd>
      </div>
      <div>
        <dt>הצד הגדול ביותר</dt>
        {topCounterparty ? (
          <>
            <dd>{formatAgorot(topCounterparty.total)}</dd>
            <dd className="party-stat-note">
              <Link href={`/who/${topCounterparty.profileId}`}>{topCounterparty.name}</Link>
            </dd>
          </>
        ) : (
          <dd>לא דווח</dd>
        )}
      </div>
    </dl>
  );
}
