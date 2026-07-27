import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageIntro } from "../../components/page-intro";
import { data } from "../../lib/data";
import { formatHebrewDate } from "../../lib/format";
import { siteConfig } from "../../../config/site";

export const metadata: Metadata = {
  title: "תיקונים",
  description: "מדיניות התיקונים והיומן הציבורי של מאיפה הכסף.",
};

export default function CorrectionsPage() {
  const issueUrl = `${siteConfig.githubUrl}/issues/new?template=incorrect-data.yml`;
  return (
    <div className="prose-page container">
      <PageIntro eyebrow="אחריות ושקיפות" title="תיקונים">
        <p>
          טעות מתוקנת במהירות האפשרית, בלי למחוק את העובדה שנעשה שינוי. כל תיקון מהותי נרשם ביומן
          הנתונים ומקושר לרשומות שהושפעו.
        </p>
      </PageIntro>
      <section>
        <h2>איך מדווחים?</h2>
        <p>
          יש לצרף קישור למקור רשמי ולהימנע מהוספת מידע אישי או רגיש. דיווח אינו משנה את הנתונים
          אוטומטית; הוא נבדק מול המקור.
        </p>
        <a href={issueUrl} target="_blank" rel="noopener noreferrer external">
          פתיחת דיווח על נתון שגוי
          <ExternalLink aria-hidden="true" size={16} />
          <span className="sr-only">(נפתח בחלון חדש)</span>
        </a>
      </section>
      <section>
        <h2>יומן תיקונים</h2>
        {data.corrections.length === 0 ? (
          <p>לא נרשמו תיקונים בגרסת הנתונים הנוכחית.</p>
        ) : (
          <ol className="corrections-list">
            {data.corrections.map((correction) => (
              <li key={correction.correction_id}>
                <time dateTime={correction.date}>{formatHebrewDate(correction.date)}</time>
                <strong>{correction.description_he}</strong>
                <p>{correction.resolution}</p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
