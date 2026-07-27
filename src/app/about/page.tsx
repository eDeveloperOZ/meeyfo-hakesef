import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageIntro } from "../../components/page-intro";
import { siteConfig } from "../../../config/site";

export const metadata: Metadata = {
  title: "אודות",
  description: "על פרויקט מאיפה הכסף ועל העקרונות שמנחים אותו.",
};

export default function AboutPage() {
  return (
    <div className="prose-page container">
      <PageIntro eyebrow="פרויקט מידע אזרחי" title="אודות מאיפה הכסף">
        <p>
          „מאיפה הכסף” מרכז מידע ציבורי על מימון מפלגות ומציג אותו בשפה נגישה, עם מקור לכל נתון ועם
          הבחנה בין תרומה, ערבות, אשראי, מימון ציבורי וחוב.
        </p>
      </PageIntro>

      <section>
        <h2>עצמאי ולא מפלגתי</h2>
        <p>
          הפרויקט אינו שייך למפלגה, לרשימה או למועמד ואינו פועל מטעמם. הוא אינו מדרג מפלגות, אינו
          ממליץ כיצד להצביע ואינו מסיק מניעים מן הנתונים.
        </p>
      </section>

      <section>
        <h2>מי מאחורי האתר?</h2>
        <div className="pending-profile">
          <strong>פרטי היוצר יפורסמו לאחר אישור נוסח הביוגרפיה.</strong>
          <p>עד אז אפשר לעקוב אחר עבודת הקוד והנתונים במאגר הציבורי או ליצור קשר דרך X.</p>
        </div>
        <div className="button-row">
          <a
            className="secondary-button"
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer external"
          >
            GitHub
            <ExternalLink aria-hidden="true" size={16} />
            <span className="sr-only">(נפתח בחלון חדש)</span>
          </a>
          <a
            className="secondary-button"
            href={siteConfig.xUrl}
            target="_blank"
            rel="noopener noreferrer external"
          >
            X
            <ExternalLink aria-hidden="true" size={16} />
            <span className="sr-only">(נפתח בחלון חדש)</span>
          </a>
        </div>
      </section>

      <section>
        <h2>היקף הפרויקט</h2>
        <p>
          הגרסה הנוכחית מוקדשת לבחירות לכנסת ה־26. לאחר הבחירות ניתן יהיה לארכב אותה או להתאים אותה
          למחזור הבא, אך אין מנגנון שמוחק את האתר אוטומטית.
        </p>
      </section>
    </div>
  );
}
