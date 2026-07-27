"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";
import { siteConfig } from "../../config/site";

export type AnalyticsEventName =
  | "party_page_view"
  | "source_link_open"
  | "csv_download"
  | "methodology_visit"
  | "correction_button_use"
  | "external_party_link_use";

export function trackPublicEvent(
  name: AnalyticsEventName,
  properties?: Record<string, string | number | boolean>,
): void {
  if (siteConfig.analyticsEnabled) track(name, properties);
}

export function AnalyticsPageEvent({
  name,
  properties,
}: {
  name: AnalyticsEventName;
  properties?: Record<string, string | number | boolean>;
}) {
  useEffect(() => {
    trackPublicEvent(name, properties);
  }, [name, properties]);
  return null;
}
