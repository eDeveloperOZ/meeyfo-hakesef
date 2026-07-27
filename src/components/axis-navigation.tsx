import { partiesByAxis, data } from "../lib/data";
import { AxisPartyLink } from "./axis-party-link";

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
      <div className="axis-row">
        <p className="axis-nav-label">
          <span>ימין</span>
          <strong>הציר המדיני־ביטחוני</strong>
          <span>שמאל</span>
        </p>
        <div className="axis-scroll" tabIndex={0} aria-label="גלילה אופקית לאורך הציר">
          <ul className="axis-list">
            {onAxis.map((party) => (
              <li key={party.party_id}>
                <AxisPartyLink
                  href={`/party/${party.party_id}`}
                  name={party.name_he}
                  color={party.brand_color}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="axis-row off-axis-nav">
        <p className="off-axis-label">מפלגות שאינן ממוקמות בבירור על הציר המדיני־ביטחוני</p>
        <div className="axis-scroll" tabIndex={0} aria-label="גלילה אופקית בין מפלגות מחוץ לציר">
          <ul className="axis-list">
            {offAxis.map((party) => (
              <li key={party.party_id}>
                <AxisPartyLink
                  href={`/party/${party.party_id}`}
                  name={party.name_he}
                  color={party.brand_color}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
