import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { AnalyticsPageEvent } from "../../../components/analytics";
import { ExternalPartyLink } from "../../../components/external-party-link";
import { FinancingBreakdown } from "../../../components/financing-breakdown";
import { MetricHeadline } from "../../../components/metric-headline";
import { PartyMark } from "../../../components/party-mark";
import { RecordsList } from "../../../components/records-list";
import { SourceLink } from "../../../components/source-link";
import { TrackedExternalLink } from "../../../components/tracked-external-link";
import { calculateFinancialSummary } from "../../../lib/finance";
import { data, getParty, getPartyRecords, getPartyScope, getSource } from "../../../lib/data";
import { formatHebrewDate, formatHebrewDateTime } from "../../../lib/format";
import { siteConfig } from "../../../../config/site";

const statusLabels = {
  knesset: "נכללת משום שהיא מיוצגת בכנסת ה־25",
  polled: "נכללת לפי כלל ההופעה בשני סקרים ארציים לפחות",
  owner_exception: "נכללת כחריג בעלים גלוי ומתועד",
} as const;

export function generateStaticParams() {
  return data.parties.map((party) => ({ id: party.party_id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const party = getParty(id);
  return party
    ? {
        title: party.name_he,
        description: `מקורות המימון המדווחים של ${party.name_he} מאז הבחירות לכנסת ה־25.`,
      }
    : {};
}

export default async function PartyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const party = getParty(id);
  const scope = getPartyScope(id);
  if (!party || !scope) notFound();

  const records = getPartyRecords(id);
  const summary = calculateFinancialSummary(records, scope);
  const eligibilitySource = getSource(party.eligibility_source_id);
  const comptrollerSource = getSource("src-comptroller-financing-portal");
  const correctionUrl = `${siteConfig.githubUrl}/issues/new?template=incorrect-data.yml&title=${encodeURIComponent(`תיקון נתון: ${party.name_he}`)}&party=${encodeURIComponent(party.name_he)}`;

  return (
    <div className="page-stack party-page container">
      <AnalyticsPageEvent name="party_page_view" properties={{ party_id: party.party_id }} />
      <nav className="breadcrumbs" aria-label="פירורי לחם">
        <Link href="/">מפלגות</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{party.name_he}</span>
      </nav>

      <header className="party-header">
        <PartyMark party={party} />
        <div>
          <p className="eyebrow">{statusLabels[party.status]}</p>
          <h1>{party.name_he}</h1>
          <p>{party.legal_name_he}</p>
          <p className="entity-context">
            סוג ישות:{" "}
            {party.entity_type === "party"
              ? "מפלגה"
              : party.entity_type === "list"
                ? "רשימת בחירות"
                : "סיעה בכנסת"}
          </p>
        </div>
        {party.website_url && (
          <ExternalPartyLink href={party.website_url} partyId={party.party_id} />
        )}
      </header>

      <MetricHeadline summary={summary} scope={scope} />
      <FinancingBreakdown summary={summary} />
      <RecordsList
        records={records}
        party={party}
        sources={data.sources}
        persons={data.persons}
        organizations={data.organizations}
      />

      <section className="limitations-section" aria-labelledby="limitations-title">
        <AlertTriangle aria-hidden="true" />
        <div>
          <h2 id="limitations-title">מגבלות ושלמות הנתונים</h2>
          <p>{scope.note_he}</p>
          <p>
            ערבויות נכללות בכותרת ההכנסה המדווחת לפי החלטת הפרויקט, ומוצגות גם בנפרד כהתחייבות
            מותנית שאינה מזומן שהתקבל. היעדר רשומה בקטגוריה מסוימת מסומן „לא דווח” ולא כאפס.
          </p>
          {party.notes && <p>{party.notes}</p>}
        </div>
      </section>

      <section className="sources-section" aria-labelledby="sources-title">
        <div className="section-heading">
          <p className="section-kicker">כל מה שמופיע בעמוד</p>
          <h2 id="sources-title">מקורות</h2>
        </div>
        <ul>
          {eligibilitySource && (
            <li>
              <SourceLink source={eligibilitySource} />
            </li>
          )}
          {comptrollerSource && (
            <li>
              <SourceLink source={comptrollerSource} />
            </li>
          )}
          {records.map((record) => {
            const source = getSource(record.source_id);
            return source ? (
              <li key={record.record_id}>
                <SourceLink source={source} />
              </li>
            ) : null;
          })}
        </ul>
      </section>

      <div className="party-footer-actions">
        <TrackedExternalLink
          className="secondary-button"
          href={correctionUrl}
          event="correction_button_use"
          properties={{ party_id: party.party_id }}
        >
          דיווח על טעות
        </TrackedExternalLink>
        <Link className="text-link" href="/methodology">
          למתודולוגיה המלאה
          <ArrowLeft aria-hidden="true" size={17} />
        </Link>
      </div>

      <p className="verification-stamp">
        בדיקת נתונים אחרונה: {formatHebrewDate(scope.checked_at)} · עדכון גרסה:{" "}
        {formatHebrewDateTime(data.release.releasedAt)}
      </p>
    </div>
  );
}
