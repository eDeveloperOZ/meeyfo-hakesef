import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Building2, ExternalLink, Globe2, Landmark } from "lucide-react";
import type { ExternalLink as ExternalLinkRecord, FinancingRecord } from "../../../../schemas";
import { PersonMiniBreakdown } from "../../../components/person-mini-breakdown";
import { SourceLink } from "../../../components/source-link";
import { data, getParty, getSource } from "../../../lib/data";
import { formatAgorot, formatHebrewDate } from "../../../lib/format";

export const dynamicParams = false;

const categoryLabels: Record<FinancingRecord["category"], string> = {
  donation: "תרומה",
  guarantee: "ערבות — התחייבות מותנית",
  bank_loan: "הלוואה בנקאית",
  knesset_loan_or_advance: "הלוואה או מקדמה מהכנסת",
  public_funding: "מימון ציבורי",
  membership_fees: "דמי חבר",
  other_official_income: "הכנסה רשמית אחרת",
  debt_liability: "חוב או התחייבות",
};

function linkIcon(kind: ExternalLinkRecord["kind"]) {
  if (kind === "wikipedia") return <BookOpen aria-hidden="true" />;
  if (kind === "corporate_bio") return <Building2 aria-hidden="true" />;
  if (kind === "isa_filing" || kind === "tase_filing") {
    return <Landmark aria-hidden="true" />;
  }
  return <Globe2 aria-hidden="true" />;
}

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
  const profileCheck = person
    ? data.profileChecks.find((check) => check.person_id === person.person_id)
    : undefined;
  const sourceIds = new Set([
    ...records.map((record) => record.source_id),
    ...assertions.map((assertion) => assertion.source_id),
  ]);
  const roleSummaries = new Map<string, { partyId: string; category: FinancingRecord["category"]; amount: number }>();
  for (const record of records) {
    const key = `${record.party_id}:${record.category}`;
    const current = roleSummaries.get(key) ?? {
      partyId: record.party_id,
      category: record.category,
      amount: 0,
    };
    current.amount += record.amount_agorot;
    roleSummaries.set(key, current);
  }
  const sortedRoleSummaries = [...roleSummaries.values()].sort(
    (left, right) => right.amount - left.amount,
  );
  const totalAmount = records.reduce((sum, record) => sum + record.amount_agorot, 0);
  const guaranteeAmount = records
    .filter((record) => record.category === "guarantee")
    .reduce((sum, record) => sum + record.amount_agorot, 0);

  return (
    <div className="page-stack profile-page container">
      <nav className="breadcrumbs" aria-label="פירורי לחם">
        <Link href="/">דף הבית</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{name}</span>
      </nav>
      <header className="page-header profile-header">
        <div>
          <p className="eyebrow">פרופיל מבוסס מקורות</p>
          <h1>{name}</h1>
          <p>
            {person
              ? person.locality_he
                ? `יישוב כפי שפורסם במקור הרשמי: ${person.locality_he}`
                : "אדם המופיע ברשומת מימון רשמית"
              : `ארגון · ${organization!.org_type}`}
          </p>
        </div>
        {records.length > 0 && (
          <dl className="profile-headline-metrics" aria-label="סיכום רשומות המימון">
            <div>
              <dt>סכום מדווח כולל</dt>
              <dd>{formatAgorot(totalAmount)}</dd>
            </div>
            <div>
              <dt>מתוכו ערבויות</dt>
              <dd>{formatAgorot(guaranteeAmount)}</dd>
            </div>
            <div>
              <dt>מספר רשומות</dt>
              <dd>{records.length}</dd>
            </div>
          </dl>
        )}
      </header>

      <section aria-labelledby="financing-roles-title">
        <h2 id="financing-roles-title">תפקידים ברשומות מימון</h2>
        {records.length === 0 ? (
          <p>לא נמצאו רשומות פעילות בפרסום הנוכחי.</p>
        ) : (
          <ul className="profile-records">
            {sortedRoleSummaries.map((summary) => (
              <li key={`${summary.partyId}:${summary.category}`}>
                <strong>{formatAgorot(summary.amount)}</strong>
                <span>{getParty(summary.partyId)?.name_he}</span>
                <span>{categoryLabels[summary.category]}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <PersonMiniBreakdown records={records} parties={data.parties} />

      <section aria-labelledby="assertions-title">
        <h2 id="assertions-title">עובדות עסקיות מתועדות</h2>
        {assertions.length === 0 ? (
          <div className="profile-check-state" data-outcome={profileCheck?.outcome ?? "not_checked"}>
            {profileCheck?.outcome === "ambiguous_identity" ? (
              <p>
                זהות לא חד־משמעית — לא פורסמו טענות. הפרופיל נבדק ב־
                {formatHebrewDate(profileCheck.checked_at)} מול{" "}
                {profileCheck.sources_checked.split("|").join(", ")}.
              </p>
            ) : profileCheck?.outcome === "no_reliable_match" ? (
              <p>
                הפרופיל נבדק ב־{formatHebrewDate(profileCheck.checked_at)} מול{" "}
                {profileCheck.sources_checked.split("|").join(", ")}; לא אותרה התאמה ודאית במקור
                ראייתי.
              </p>
            ) : profileCheck?.outcome === "links_only" ? (
              <p>
                הבדיקה מ־{formatHebrewDate(profileCheck.checked_at)} לא הניבה טענת תפקיד ראייתית;
                קישורי הרחבה מאומתים מופיעים להלן.
              </p>
            ) : (
              <p>לא פורסמה טענת פרופיל עסקי שלא אומתה מול מקור מתאים.</p>
            )}
          </div>
        ) : (
          <ul className="profile-assertions">
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
        <section className="learn-more-links" aria-labelledby="learn-more-title">
          <h2 id="learn-more-title">להרחבה</h2>
          <p>קישורים אלה נועדו לקריאה נוספת ואינם משמשים ראיה לרשומות המימון.</p>
          <ul className="learn-more-icon-row">
            {externalLinks.map((link) => (
              <li key={link.link_id}>
                <a href={link.url} target="_blank" rel="noopener noreferrer external">
                  {linkIcon(link.kind)}
                  {link.label_he}
                  <ExternalLink className="external-link-mark" aria-hidden="true" size={14} />
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
