import Link from "next/link";
import { partiesByAxis, data } from "../lib/data";

export function AxisNavigation() {
  const positionById = new Map(
    data.axisPositions.map((position) => [position.axis_position_id, position]),
  );
  const onAxis = partiesByAxis.filter(
    (party) => positionById.get(party.axis_position_id)?.lane !== "off_axis",
  );
  const offAxis = partiesByAxis.filter(
    (party) => positionById.get(party.axis_position_id)?.lane === "off_axis",
  );

  return (
    <nav className="axis-nav" aria-label="ניווט בין מפלגות לפי הציר המדיני־ביטחוני">
      <p className="axis-nav-label">
        <span>ימין</span>
        <span>הציר המדיני־ביטחוני</span>
        <span>שמאל</span>
      </p>
      <div className="axis-scroll" tabIndex={0} aria-label="גלילה אופקית בין המפלגות">
        <ul className="axis-list">
          {onAxis.map((party) => (
            <li key={party.party_id}>
              <Link href={`/party/${party.party_id}`}>{party.name_he}</Link>
            </li>
          ))}
        </ul>
      </div>
      <details className="off-axis-nav">
        <summary>מפלגות שאינן ממוקמות בבירור על הציר המדיני־ביטחוני</summary>
        <ul>
          {offAxis.map((party) => (
            <li key={party.party_id}>
              <Link href={`/party/${party.party_id}`}>{party.name_he}</Link>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
}
