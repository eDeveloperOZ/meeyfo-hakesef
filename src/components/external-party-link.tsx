"use client";

import { ExternalLink } from "lucide-react";
import { trackPublicEvent } from "./analytics";

export function ExternalPartyLink({ href, partyId }: { href: string; partyId: string }) {
  return (
    <a
      className="external-party-link"
      data-component="external-party-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer external"
      onClick={() => trackPublicEvent("external_party_link_use", { party_id: partyId })}
    >
      <span>לאתר הרשמי של המפלגה</span>
      <ExternalLink aria-hidden="true" size={17} strokeWidth={1.8} />
      <span className="sr-only">(נפתח בחלון חדש)</span>
    </a>
  );
}
