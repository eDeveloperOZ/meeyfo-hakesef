"use client";

import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { trackPublicEvent, type AnalyticsEventName } from "./analytics";

export function TrackedExternalLink({
  href,
  event,
  properties,
  className,
  children,
}: {
  href: string;
  event: AnalyticsEventName;
  properties?: Record<string, string>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer external"
      onClick={() => trackPublicEvent(event, properties)}
    >
      {children}
      <ExternalLink aria-hidden="true" size={16} />
      <span className="sr-only">(נפתח בחלון חדש)</span>
    </a>
  );
}
