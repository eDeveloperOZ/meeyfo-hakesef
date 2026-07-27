import Link from "next/link";
import type { Party } from "../../schemas";
import { PartyMark } from "./party-mark";

const statusLabels: Record<Party["status"], string> = {
  knesset: "מיוצגת בכנסת",
  polled: "נכללה לפי כלל הסקרים",
  owner_exception: "חריג מתועד למדיניות",
};

export function PartyCard({ party }: { party: Party }) {
  return (
    <article className="party-card">
      <Link href={`/party/${party.party_id}`} className="party-card-link">
        <PartyMark party={party} />
        <span className="party-card-copy">
          <strong>{party.name_he}</strong>
          <span>{statusLabels[party.status]}</span>
        </span>
        <span aria-hidden="true" className="party-card-arrow">
          ←
        </span>
      </Link>
    </article>
  );
}
