import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { SourceLink } from "../../../components/source-link";
import { data, getParty, getSource } from "../../../lib/data";
import { formatAgorot, formatHebrewDate } from "../../../lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  const profiles = [
    ...data.persons.map((person) => ({ id: person.person_id })),
    ...data.organizations.map((organization) => ({ id: organization.org_id })),
  ];
  return profiles.length > 0 ? profiles : [{ id: "pending-profile" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const person = data.persons.find((item) => item.person_id === id);
  const organization = data.organizations.find((item) => item.org_id === id);
  return {
    title:
      person?.full_name_he ??
      organization?.name_he ??
      (id === "pending-profile" ? "פרופילים מתועדים" : "פרופיל"),
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = data.persons.find((item) => item.person_id === id);
  const organization = data.organizations.find((item) => item.org_id === id);
  if (id === "pending-profile" && !person && !organization) {
    return (
      <div className="page-stack profile-page container">
        <nav className="breadcrumbs" aria-label="פירורי לחם">
          <Link href="/">דף הבית</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">פרופילים מתועדים</span>
        </nav>
        <header className="page-header">
          <p className="eyebrow">מידע חסר מסומן בגלוי</p>
          <h1>טרם פורסמו פרופילים מתועדים</h1>
          <p>
            פרופיל יופיע רק לאחר שתימצא רשומת מימון רשמית עם צד שכנגד, וכל טענה בפרופיל תאומת מול
            מקור מתאים.
          </p>
        </header>
      </div>
    );
  }
  if (!person && !organization) notFound();

  const name = person?.full_name_he ?? organization!.name_he;
  const records = data.financingRecords.filter(
    (record) => record.person_id === id || record.org_id === id,
  );
  const assertions = person
    ? data.personRoles.filter((assertion) => assertion.person_id === id)
    : [];
  const externalLinks = data.externalLinks.filter(
    (link) => link.person_id === id || link.org_id === id,
  );
  const sourceIds = new Set([
    ...records.map((record) => record.source_id),
    ...assertions.map((assertion) => assertion.source_id),
  ]);

  return (
    <div className="page-stack profile-page container">
      <nav className="breadcrumbs" aria-label="פירורי לחם">
        <Link href="/">דף הבית</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{name}</span>
      </nav>
      <header className="page-header">
        <p className="eyebrow">פרופיל מבוסס מקורות</p>
        <h1>{name}</h1>
        <p>
          {person
            ? person.locality_he
              ? `יישוב כפי שפורסם במקור הרשמי: ${person.locality_he}`
              : "אדם המופיע ברשומת מימון רשמית"
            : `ארגון · ${organization!.org_type}`}
        </p>
      </header>

      <section aria-labelledby="financing-roles-title">
        <h2 id="financing-roles-title">תפקידים ברשומות מימון</h2>
        {records.length === 0 ? (
          <p>לא נמצאו רשומות פעילות בפרסום הנוכחי.</p>
        ) : (
          <ul className="profile-records">
            {records.map((record) => (
              <li key={record.record_id}>
                <strong>{formatAgorot(record.amount_agorot)}</strong>
                <span>{getParty(record.party_id)?.name_he}</span>
                <span>{formatHebrewDate(record.event_date)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="assertions-title">
        <h2 id="assertions-title">עובדות עסקיות מתועדות</h2>
        {assertions.length === 0 ? (
          <p>לא נוספו טענות פרופיל עסקי מאומתות.</p>
        ) : (
          <ul>
            {assertions.map((assertion) => {
              const source = getSource(assertion.source_id);
              return (
                <li key={assertion.assertion_id}>
                  <span>{assertion.role_text_he}</span>
                  {source && <SourceLink source={source} compact />}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {externalLinks.length > 0 && (
        <section aria-labelledby="learn-more-title">
          <h2 id="learn-more-title">להרחבה</h2>
          <ul>
            {externalLinks.map((link) => (
              <li key={link.link_id}>
                <a href={link.url} target="_blank" rel="noopener noreferrer external">
                  {link.label_he}
                  <ExternalLink aria-hidden="true" size={15} />
                  <span className="sr-only">(נפתח בחלון חדש)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="sources-section" aria-labelledby="profile-sources-title">
        <h2 id="profile-sources-title">מקורות</h2>
        <ul>
          {[...sourceIds].map((sourceId) => {
            const source = getSource(sourceId);
            return source ? (
              <li key={sourceId}>
                <SourceLink source={source} />
              </li>
            ) : null;
          })}
        </ul>
      </section>
    </div>
  );
}
