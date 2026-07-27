"use client";

import { ExternalLink } from "lucide-react";
import type { Source } from "../../schemas";
import { trackPublicEvent } from "./analytics";
import { formatHebrewDate } from "../lib/format";

const authorityLabels: Record<Source["authority"], string> = {
  state_comptroller: "מבקר המדינה",
  knesset: "הכנסת",
  central_elections_committee: "ועדת הבחירות",
  gov_ministry: "מקור ממשלתי",
  party_registrar: "רשם המפלגות",
  corporations_authority: "רשות התאגידים",
  isa: "רשות ניירות ערך",
  tase: "הבורסה",
  other_statutory: "גוף ציבורי",
  reference_only: "מקור עזר",
};

export function SourceLink({ source, compact = false }: { source: Source; compact?: boolean }) {
  return (
    <a
      className="source-link"
      href={source.url}
      target="_blank"
      rel="noopener noreferrer external"
      onClick={() => trackPublicEvent("source_link_open", { source_id: source.source_id })}
    >
      <span className="authority-chip">{authorityLabels[source.authority]}</span>
      <span>{compact ? "למקור" : source.title}</span>
      <ExternalLink aria-hidden="true" size={15} />
      <span className="sr-only">(נפתח בחלון חדש)</span>
      {!compact && (
        <span className="source-verified">
          אומת לאחרונה: {formatHebrewDate(source.access_datetime.slice(0, 10))}
        </span>
      )}
    </a>
  );
}
