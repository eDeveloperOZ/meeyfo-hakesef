import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageIntro } from "../../components/page-intro";
import { siteConfig } from "../../../config/site";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
  description: "הנגשת מאיפה הכסף והדרכים לדווח על בעיית נגישות.",
};

export default function AccessibilityPage() {
  const issueUrl = `${siteConfig.githubUrl}/issues/new?template=accessibility.yml`;
  return (
    <div className="prose-page container">
      <PageIntro eyebrow="הצהרת נגישות" title="נגישות">
        <p>
          האתר נבנה לשימוש במקלדת, בקוראי מסך, בהגדלת תצוגה ובמסכים צרים, מתוך יעד של WCAG 2.1 ברמה
          AA ותקן ישראלי 5568.
        </p>
      </PageIntro>

      <section>
        <h2>מה יושם</h2>
        <ul>
          <li>עברית מלאה עם כיוון RTL, אזורי ניווט סמנטיים וקישור דילוג לתוכן.</li>
          <li>מיקוד מקלדת נראה, יעדי מגע בגודל מתאים ושימוש ללא מחוות עכבר בלבד.</li>
          <li>חלונות ושכבות מידע עם סגירה במקש Esc, לכידת מיקוד והחזרת המיקוד.</li>
          <li>טבלה טקסטואלית מקבילה לכל תרשים והבחנה שאינה מסתמכת על צבע בלבד.</li>
          <li>
            סימני מפלגות טקסטואליים ייחודיים, צבעי זהות כתוספת בלבד וסימון המפלגה הנוכחית
            ב־aria-current.
          </li>
          <li>גופן עברי מקומי שאינו תלוי בשירות חיצוני ומספרים כספיים ברוחב ספרות אחיד.</li>
          <li>כיבוד ההעדפה להפחתת תנועה ותמיכה בהגדלה עד 200% וברוחב 320px.</li>
        </ul>
      </section>

      <section>
        <h2>מגבלות ידועות</h2>
        <p>
          מסמכים וקישורים באתרי המקור החיצוניים אינם בשליטתנו ועלולים שלא לעמוד באותה רמת נגישות.
          בדיקת התאמה אנושית וייעוץ מומחה לפי תקן 5568 עדיין נדרשים לפני פרסום ראשון.
        </p>
      </section>

      <section>
        <h2>דיווח על בעיה</h2>
        <p>אפשר לדווח בלי למסור מידע אישי או רגיש:</p>
        <a href={issueUrl} target="_blank" rel="noopener noreferrer external">
          פתיחת דיווח נגישות ב־GitHub
          <ExternalLink aria-hidden="true" size={16} />
          <span className="sr-only">(נפתח בחלון חדש)</span>
        </a>
        <p>
          אפשר גם לפנות דרך{" "}
          <a href={siteConfig.xUrl} target="_blank" rel="noopener noreferrer external">
            פרופיל X <span className="sr-only">(נפתח בחלון חדש)</span>
          </a>
          .
        </p>
      </section>
    </div>
  );
}
