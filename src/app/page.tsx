import Link from "next/link";
import { ArrowLeft, FileWarning } from "lucide-react";
import { CountdownBanner } from "../components/countdown-banner";
import { PartyCard } from "../components/party-card";
import { partiesByAxis, data } from "../lib/data";
import { formatHebrewDateTime } from "../lib/format";
import { siteConfig } from "../../config/site";

const addPartyUrl = `${siteConfig.githubUrl}/issues/new?template=add-party.yml`;

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-grid container">
          <div>
            <p className="eyebrow">שקיפות במימון מפלגות · הבחירות לכנסת ה־26</p>
            <h1>{siteConfig.nameHe}</h1>
            <p className="hero-tagline">{siteConfig.taglineHe}</p>
            <p className="hero-description">
              ריכוז נגיש של תרומות, ערבויות, הלוואות, מימון ציבורי וחובות — כפי שדווחו במקורות
              רשמיים, עם קישור לכל מקור ועם סימון ברור של מידע חסר.
            </p>
          </div>
          <aside className="hero-note" aria-label="עקרונות הפרויקט">
            <span className="hero-note-number">01</span>
            <strong>מציגים עובדות. לא מסיקים מניעים.</strong>
            <p>ערבות אינה תרומה, הלוואה אינה הכנסה, וחוסר בדיווח אינו אפס.</p>
          </aside>
        </div>
      </section>

      <div className="container">
        <CountdownBanner />
        <p className="last-updated">
          עודכן לאחרונה:{" "}
          <time dateTime={data.release.releasedAt}>
            {formatHebrewDateTime(data.release.releasedAt)}
          </time>
        </p>

        <section className="methodology-banner" aria-labelledby="methodology-banner-title">
          <FileWarning aria-hidden="true" />
          <div>
            <h2 id="methodology-banner-title">איך לקרוא את הנתונים</h2>
            <p>
              האתר מאגד מידע ציבורי שכבר פורסם, אינו קשור למפלגה כלשהי ואינו מסיק מניעים. כל נתון
              כספי מחייב מקור רשמי; מידע חסר מסומן, ותיקונים מתקבלים דרך GitHub.
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
              <p className="section-kicker">לפי הציר המדיני־ביטחוני</p>
              <h2 id="parties-title">מפלגות ורשימות</h2>
            </div>
            <p>
              הסדר הוא המחשה עריכתית של אפיון מקובל. מפלגות שאין להן מיקום ברור מופיעות במסלול נפרד.
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
