import { siteConfig } from "../../config/site";
import type { Party } from "../../schemas";

export function PartyMark({ party, size = "medium" }: { party: Party; size?: "small" | "medium" }) {
  if (siteConfig.partyLogosEnabled && party.logo_file) {
    return (
      // Logo files remain disabled until the owner approves them after legal review.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={`party-logo party-logo-${size}`}
        src={party.logo_file}
        alt={`סמל ${party.name_he}`}
        width={size === "small" ? 40 : 64}
        height={size === "small" ? 40 : 64}
      />
    );
  }

  return (
    <span className={`party-mark party-logo-${size}`} aria-hidden="true">
      {party.mark_he}
    </span>
  );
}
