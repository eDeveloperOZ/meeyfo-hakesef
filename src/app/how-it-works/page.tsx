import type { Metadata } from "next";
import {
  CalendarRange,
  FileCheck2,
  HandCoins,
  Landmark,
  Scale,
  Shapes,
  ShieldCheck,
} from "lucide-react";
import { ConceptCard } from "../../components/concept-card";
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

      <div className="concept-grid">
        <ConceptCard
          icon={<Scale />}
          title="חוק מימון מפלגות"
          lead="המסגרת למימון, מגבלות, חשבונות וביקורת."
        >
          <p>
            חוק מימון מפלגות, התשל״ג–1973, מסדיר מימון בחירות ומימון שוטף, מגבלות הכנסה והוצאה,
            ניהול חשבונות וביקורת. מבקר המדינה בודק את החשבונות ואת העמידה בכללים.
          </p>
          <a href={lawUrl} target="_blank" rel="noopener noreferrer external">
            נוסח החוק באתר מבקר המדינה <span className="sr-only">(נפתח בחלון חדש)</span>
          </a>
        </ConceptCard>

        <ConceptCard
          icon={<Landmark />}
          title="יחידת המימון והמימון הציבורי"
          lead="סכום בסיס לנוסחאות החוק, שהזכאות אליו תלויה במעמד ובתוצאות."
        >
          <p>
            יחידת מימון היא סכום בסיס שמשמש בנוסחאות החוק. לקראת הבחירות לכנסת ה־26 קבעה הוועדה
            הציבורית יחידה של 1,835,000 ₪, והוראת השעה שאושרה התאימה את שיעור המקדמה ואת התוספת
            למימון הבחירות. הזכאות בפועל תלויה במעמד הרשימה ובתוצאות הבחירות.
          </p>
          <a href={amendmentUrl} target="_blank" rel="noopener noreferrer external">
            תיקון מס׳ 46 באתר הכנסת <span className="sr-only">(נפתח בחלון חדש)</span>
          </a>
        </ConceptCard>

        <ConceptCard
          icon={<HandCoins />}
          title="תרומות: מי וכמה?"
          lead="תרומות מוגבלות לפי זהות הנותן, מועד הנתינה ומעמד המפלגה."
        >
          <p>
            החוק אוסר קבלת תרומה מתאגיד ומגביל תרומות לבוחר. בנוסח החוק שמפרסם מבקר המדינה מופיעה
            תקרה של 2,600 ₪ בשנת בחירות מאדם ומבני ביתו הסמוכים על שולחנו; למפלגה שאינה מיוצגת בכנסת
            חלה לפי אותו סעיף תקרה גבוהה פי חמישה. סכומים עשויים להתעדכן, ולכן המקור המחייב הוא תמיד
            נוסח החוק וההודעות הרשמיות במועד התרומה.
          </p>
        </ConceptCard>

        <ConceptCard
          icon={<Shapes />}
          title="לא כל מקור הוא אותו דבר"
          lead="תקבול, אשראי, ערבות, מימון ציבורי וחוב מתארים מצבים שונים."
        >
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
        </ConceptCard>

        <ConceptCard
          icon={<ShieldCheck />}
          title="ערבות ומימוש"
          lead="ערבות מגינה על המלווה; היא אינה מזומן שהועבר למפלגה."
        >
          <p>
            ערבות נועדה להגן על המלווה אם החוב לא ייפרע. היא אינה מצטרפת לסכום שהמפלגה קיבלה. לפי
            הודעת מבקר המדינה, ערבות שחולטה עשויה להיחשב תרומה ולהיות כפופה למגבלות התרומות. החזר או
            שחרור הערבות משנים את מצבה, לא את סכום התקבולים המקורי.
          </p>
          <p>
            באתר זה, לפי החלטת בעל הפרויקט, ערבויות פעילות כן נכללות בכותרת „הכנסה מדווחת”. זהו כלל
            תצוגה של האתר ולא טענה שהערבות היא מזומן; לכן סכום הערבויות מוצג גם בנפרד ובסימון מותנה.
          </p>
        </ConceptCard>

        <ConceptCard
          icon={<CalendarRange />}
          title="בחירות לעומת פעילות שוטפת"
          lead="חלונות דיווח שונים אינם מתחברים אוטומטית לסכום אחד."
        >
          <p>
            החוק מפריד בין תקופת הבחירות לבין הפעילות השוטפת של סיעות. גם מועדי מסירת החשבונות
            והדוחות שונים. מסיבה זו אין לחבר אוטומטית נתונים מתקופות או מדוחות בעלי היקף שונה.
          </p>
        </ConceptCard>

        <ConceptCard
          icon={<FileCheck2 />}
          title="פיקוח ופרסום"
          lead="הגופים מדווחים, ומבקר המדינה מבקר ומפרסם את המידע."
        >
          <p>
            המפלגות מדווחות, ומבקר המדינה מבקר את החשבונות ומפרסם מידע ודוחות. הפרסום המקוון של
            תרומות, ערבויות והלוואות מבוסס על דיווחי הגופים ועל אחריותם.
          </p>
          <a href={comptrollerUrl} target="_blank" rel="noopener noreferrer external">
            פורטל מימון מפלגות של מבקר המדינה <span className="sr-only">(נפתח בחלון חדש)</span>
          </a>
        </ConceptCard>
      </div>
    </div>
  );
}
