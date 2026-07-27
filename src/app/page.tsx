import Link from "next/link";
import { ArrowDown, ArrowLeft, FileCheck2, FileWarning } from "lucide-react";
import { CountdownBanner } from "../components/countdown-banner";
import { PartyComparisonChart } from "../components/party-comparison-chart";
import { PartyCard } from "../components/party-card";
import { partiesByAxis, data } from "../lib/data";
import { formatAgorot, formatHebrewDateTime } from "../lib/format";
import { activeRecords } from "../lib/finance";
import { siteConfig } from "../../config/site";

const addPartyUrl = `${siteConfig.githubUrl}/issues/new?template=add-party.yml`;
const currentRecords = activeRecords(data.financingRecords);
const totalDonations = currentRecords
  .filter((record) => record.category === "donation")
  .reduce((sum, record) => sum + record.amount_agorot, 0);
const totalGuarantees = currentRecords
  .filter((record) => record.category === "guarantee")
  .reduce((sum, record) => sum + record.amount_agorot, 0);
const totalReportedIncome = totalDonations + totalGuarantees;

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero-grid container">
          <div className="home-hero-copy">
            <p className="eyebrow">שקיפות במימון מפלגות · הבחירות לכנסת ה־26</p>
            <h1>{siteConfig.nameHe}</h1>
            <p className="hero-tagline">{siteConfig.taglineHe}</p>
            <p className="hero-description">
              תמונת מצב נגישה של תרומות, ערבויות, הלוואות, מימון ציבורי וחובות — מתוך מקורות
              רשמיים בלבד.
            </p>
            <div className="home-hero-actions">
              <a className="primary-button" href="#parties-title">
                לבדיקת המפלגות
                <ArrowDown aria-hidden="true" size={18} />
              </a>
              <Link className="secondary-button" href="/methodology">
                איך חישבנו
              </Link>
            </div>
          </div>

          <aside className="home-snapshot" aria-label="תמונת מצב כספית">
            <div className="snapshot-heading">
              <span className="snapshot-icon" aria-hidden="true">
                <FileCheck2 size={20} />
              </span>
              <div>
                <p>סך ההכנסה המדווחת באתר</p>
                <span>תרומות וערבויות יחד</span>
              </div>
            </div>
            <strong className="snapshot-total">{formatAgorot(totalReportedIncome)}</strong>
            <dl className="snapshot-breakdown">
              <div>
                <dt>תרומות</dt>
                <dd>{formatAgorot(totalDonations)}</dd>
              </div>
              <div>
                <dt>
                  ערבויות
                  <small>התחייבות מותנית</small>
                </dt>
                <dd>{formatAgorot(totalGuarantees)}</dd>
              </div>
            </dl>
            <p className="snapshot-note">
              הסכום משקף רשומות פעילות במאגר ואינו כולל מימון שלא פורסם במקור רשמי.
            </p>
          </aside>
        </div>

        <div className="home-release-strip">
          <div className="container">
            <span>
              <strong>{data.parties.length}</strong> מפלגות ורשימות
            </span>
            <span>
              <strong>{currentRecords.length}</strong> רשומות רשמיות
            </span>
            <span>
              עודכן{" "}
              <time dateTime={data.release.releasedAt}>
                {formatHebrewDateTime(data.release.releasedAt)}
              </time>
            </span>
          </div>
        </div>
      </section>

      <div className="home-content container">
        <PartyComparisonChart parties={data.parties} records={data.financingRecords} />

        <CountdownBanner />

        <section className="methodology-banner" aria-labelledby="methodology-banner-title">
          <FileWarning aria-hidden="true" />
          <div>
            <h2 id="methodology-banner-title">איך לקרוא את הנתונים</h2>
            <p>
              האתר מאגד מידע ציבורי שכבר פורסם, אינו קשור למפלגה כלשהי ואינו מסיק מניעים. כל נתון
              כספי מחייב מקור רשמי; ערבויות מסומנות כהתחייבות מותנית; מידע חסר מסומן, ותיקונים
              מתקבלים דרך GitHub.
            </p>
          </div>
          <Link href="/methodology">
            למתודולוגיה
            <ArrowLeft aria-hidden="true" size={18} />
          </Link>
        </section>

        <section className="party-section" aria-labelledby="parties-title">
          <div className="section-heading section-heading-split">
            <div>
              <p className="section-kicker">תמונת מצב לפי מפלגה</p>
              <h2 id="parties-title">מפלגות ורשימות</h2>
            </div>
            <p>
              בחרו מפלגה כדי לראות את הסכום המדווח, הפירוט המלא והמקורות הרשמיים שעליהם הוא מבוסס.
            </p>
          </div>
          <div className="party-grid">
            {partiesByAxis.map((party) => (
              <PartyCard key={party.party_id} party={party} />
            ))}
            <article className="party-card party-card-request">
              <a href={addPartyUrl} target="_blank" rel="noopener noreferrer external">
                <span aria-hidden="true" className="request-plus">
                  +
                </span>
                <span>
                  <strong>חסרה מפלגה?</strong>
                  <span>בקשו להוסיף דרך טופס מסודר</span>
                </span>
                <span className="sr-only">(נפתח בחלון חדש)</span>
              </a>
            </article>
          </div>
        </section>
      </div>
    </>
  );
}
