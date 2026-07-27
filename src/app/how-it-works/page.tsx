import type { Metadata } from "next";
import { PageIntro } from "../../components/page-intro";
import { TermPopover } from "../../components/term-popover";

export const metadata: Metadata = {
  title: "איך מימון מפלגות עובד",
  description: "הסבר אזרחי על מימון ציבורי, תרומות, ערבויות, הלוואות וביקורת.",
};

const lawUrl = "https://media.mevaker.gov.il/mevaker/media/x2aggcqw/laws-mimun-miflagot-1973.pdf";
const amendmentUrl = "https://main.knesset.gov.il/News/PressReleases/Pages/press17072026w.aspx";
const comptrollerUrl = "https://www.mevaker.gov.il/state-audit/elections";

export default function HowItWorksPage() {
  return (
    <div className="prose-page container">
      <PageIntro eyebrow="מדריך אזרחי" title="איך מימון מפלגות עובד">
        <p>
          מפלגות פועלות מכמה סוגי מקורות כספיים. החוק מבחין בין כסף שהתקבל, אשראי שצריך להחזיר,
          התחייבות מותנית ומימון מאוצר המדינה.
        </p>
      </PageIntro>

      <section>
        <h2>חוק מימון מפלגות</h2>
        <p>
          חוק מימון מפלגות, התשל״ג–1973, מסדיר מימון בחירות ומימון שוטף, מגבלות הכנסה והוצאה, ניהול
          חשבונות וביקורת. מבקר המדינה בודק את החשבונות ואת העמידה בכללים.
        </p>
        <a href={lawUrl} target="_blank" rel="noopener noreferrer external">
          נוסח החוק באתר מבקר המדינה <span className="sr-only">(נפתח בחלון חדש)</span>
        </a>
      </section>

      <section>
        <h2>יחידת המימון והמימון הציבורי</h2>
        <p>
          יחידת מימון היא סכום בסיס שמשמש בנוסחאות החוק. לקראת הבחירות לכנסת ה־26 קבעה הוועדה
          הציבורית יחידה של 1,835,000 ₪, והוראת השעה שאושרה התאימה את שיעור המקדמה ואת התוספת למימון
          הבחירות. הזכאות בפועל תלויה במעמד הרשימה ובתוצאות הבחירות.
        </p>
        <a href={amendmentUrl} target="_blank" rel="noopener noreferrer external">
          תיקון מס׳ 46 באתר הכנסת <span className="sr-only">(נפתח בחלון חדש)</span>
        </a>
      </section>

      <section>
        <h2>תרומות: מי וכמה?</h2>
        <p>
          החוק אוסר קבלת תרומה מתאגיד ומגביל תרומות לבוחר. בנוסח החוק שמפרסם מבקר המדינה מופיעה תקרה
          של 2,600 ₪ בשנת בחירות מאדם ומבני ביתו הסמוכים על שולחנו; למפלגה שאינה מיוצגת בכנסת חלה
          לפי אותו סעיף תקרה גבוהה פי חמישה. סכומים עשויים להתעדכן, ולכן המקור המחייב הוא תמיד נוסח
          החוק וההודעות הרשמיות במועד התרומה.
        </p>
      </section>

      <section>
        <h2>לא כל מקור הוא אותו דבר</h2>
        <ul className="explain-list">
          <li>
            <TermPopover termKey="donation" /> — תקבול שאינו אמור להיפרע, בכפוף למגבלות.
          </li>
          <li>
            <TermPopover termKey="guarantee" /> — התחייבות של ערב; היא יכולה לא להתממש לעולם.
          </li>
          <li>
            <TermPopover termKey="bankLoan" /> — אשראי שחלה עליו חובת החזר.
          </li>
          <li>
            <TermPopover termKey="knessetAdvance" /> — אשראי או מקדמה שניתנים לפי מנגנוני החוק.
          </li>
          <li>
            <TermPopover termKey="publicFunding" /> — כסף מאוצר המדינה לפי נוסחה חוקית.
          </li>
          <li>
            <TermPopover termKey="debt" /> — סכום לתשלום; אינו מקור תקבול נוסף.
          </li>
        </ul>
      </section>

      <section>
        <h2>ערבות ומימוש</h2>
        <p>
          ערבות נועדה להגן על המלווה אם החוב לא ייפרע. היא אינה מצטרפת לסכום שהמפלגה קיבלה. לפי
          הודעת מבקר המדינה, ערבות שחולטה עשויה להיחשב תרומה ולהיות כפופה למגבלות התרומות. החזר או
          שחרור הערבות משנים את מצבה, לא את סכום התקבולים המקורי.
        </p>
      </section>

      <section>
        <h2>בחירות לעומת פעילות שוטפת</h2>
        <p>
          החוק מפריד בין תקופת הבחירות לבין הפעילות השוטפת של סיעות. גם מועדי מסירת החשבונות והדוחות
          שונים. מסיבה זו אין לחבר אוטומטית נתונים מתקופות או מדוחות בעלי היקף שונה.
        </p>
      </section>

      <section>
        <h2>פיקוח ופרסום</h2>
        <p>
          המפלגות מדווחות, ומבקר המדינה מבקר את החשבונות ומפרסם מידע ודוחות. הפרסום המקוון של
          תרומות, ערבויות והלוואות מבוסס על דיווחי הגופים ועל אחריותם.
        </p>
        <a href={comptrollerUrl} target="_blank" rel="noopener noreferrer external">
          פורטל מימון מפלגות של מבקר המדינה <span className="sr-only">(נפתח בחלון חדש)</span>
        </a>
      </section>
    </div>
  );
}
