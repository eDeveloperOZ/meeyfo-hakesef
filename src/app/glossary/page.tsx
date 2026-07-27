import type { Metadata } from "next";
import { PageIntro } from "../../components/page-intro";
import { glossaryTerms } from "../../lib/glossary";

export const metadata: Metadata = {
  title: "מילון מושגים",
  description: "הגדרות פשוטות למושגים במימון מפלגות.",
};

const lawUrl = "https://media.mevaker.gov.il/mevaker/media/x2aggcqw/laws-mimun-miflagot-1973.pdf";

const expanded: Record<keyof typeof glossaryTerms, { explanation: string; example: string }> = {
  donation: {
    explanation:
      "תרומה אינה אמורה להיפרע. היא כפופה לזהות התורם, לתקרה החלה במועד הנתינה ולחובת דיווח.",
    example: "דוגמה: אדם נותן סכום מותר למפלגה והסכום נרשם כתרומה.",
  },
  guarantee: {
    explanation:
      "ערב מתחייב כלפי המלווה לשלם אם החייב לא יעמוד בתנאים. כל עוד לא מומשה, אין זה תקבול למפלגה.",
    example: "דוגמה: ערב מתחייב לבנק להבטיח הלוואה, אך המפלגה פורעת אותה בעצמה.",
  },
  exercisedGuarantee: {
    explanation:
      "כאשר המלווה דורש מן הערב לשלם, מצב הערבות משתנה. הדין עשוי לסווג את התשלום כתרומה.",
    example: "דוגמה: הלוואה לא נפרעה והבנק גובה מן הערב לפי כתב הערבות.",
  },
  bankLoan: {
    explanation: "הלוואה מגדילה זמנית את המזומן אך יוצרת חובת פירעון וריבית או הצמדה.",
    example: "דוגמה: בנק מעמיד אשראי בתנאים מקובלים ולוח החזר.",
  },
  publicFunding: {
    explanation: "מימון מאוצר המדינה מחושב לפי יחידת מימון וכללי הזכאות שבחוק.",
    example: "דוגמה: סיעה מקבלת מקדמה על חשבון מימון הבחירות לפי הנוסחה החלה.",
  },
  knessetAdvance: {
    explanation: "הכנסת יכולה להעביר באמצעות מנגנוני החוק הלוואה או מקדמה שתקוזז ממימון עתידי.",
    example: "דוגמה: סיעה מקבלת מקדמה ולאחר הבחירות מתבצעת התחשבנות.",
  },
  membershipFees: {
    explanation: "דמי חבר הם הכנסה ארגונית הנגבית לפי כללי המפלגה ואינה זהה לתרומה חד־פעמית.",
    example: "דוגמה: חברי מפלגה משלמים תשלום תקופתי קבוע.",
  },
  debt: {
    explanation: "חוב הוא סכום בר־תשלום. הוא מוצג בנפרד מתקבולים כדי שלא ליצור תמונה מנופחת.",
    example: "דוגמה: יתרת הלוואה שטרם נפרעה במועד הדוח.",
  },
  liability: {
    explanation: "התחייבות יכולה להיות ודאית או תלויה בתנאי. יש לבדוק את הגדרתה בדוח המקורי.",
    example: "דוגמה: חשבון ספק שטרם שולם או התחייבות לפי חוזה.",
  },
  repayment: {
    explanation: "החזר מקטין יתרת חוב ואינו הכנסה שלילית או תרומה שהוחזרה בהכרח.",
    example: "דוגמה: תשלום חודשי שמקטין את קרן ההלוואה.",
  },
};

export default function GlossaryPage() {
  return (
    <div className="prose-page container">
      <PageIntro eyebrow="מילים לפני מספרים" title="מילון מושגים">
        <p>אותה מילה יכולה לשנות את משמעות המספר. כאן ההבדלים מוצגים בשפה פשוטה.</p>
      </PageIntro>
      <div className="glossary-grid">
        {Object.entries(glossaryTerms).map(([id, item]) => {
          const details = expanded[id as keyof typeof glossaryTerms];
          return (
            <article id={id} key={id} className="glossary-entry">
              <p className="term-nature">{item.nature}</p>
              <h2>{item.term}</h2>
              <p className="term-short">{item.short}</p>
              <p>{details.explanation}</p>
              <p className="neutral-example">{details.example}</p>
              <a href={lawUrl} target="_blank" rel="noopener noreferrer external">
                למקור הרשמי <span className="sr-only">(נפתח בחלון חדש)</span>
              </a>
            </article>
          );
        })}
        <article id="guarantee-vs-cash" className="glossary-entry">
          <p className="term-nature">הבדל יסודי</p>
          <h2>ההבדל בין ערבות לכסף שהתקבל</h2>
          <p>ערבות מגינה על מלווה. הכסף שהתקבל הוא סכום שהועבר בפועל למפלגה.</p>
          <p className="neutral-example">
            דוגמה: הלוואה של 100 ₪ בערבות 100 ₪ היא תקבול של 100 ₪, לא 200 ₪.
          </p>
        </article>
        <article id="non-additive" className="glossary-entry">
          <p className="term-nature">טווח ומדידה</p>
          <h2>למה אי־אפשר תמיד לחבר קטגוריות?</h2>
          <p>
            דוחות יכולים לכסות מועדים, ישויות והגדרות שונים. חיבורם עלול לערבב תקבול, אשראי
            והתחייבות.
          </p>
        </article>
        <article id="reporting-dates" className="glossary-entry">
          <p className="term-nature">מגבלת נתונים</p>
          <h2>מגבלות מועדי הדיווח הרשמיים</h2>
          <p>
            חלק מהמידע מפורסם סמוך לאירוע וחלק רק לאחר הגשת חשבונות וביקורת. לכן תמונת המצב יכולה
            להיות חלקית גם כשהיא מדויקת למועד הבדיקה.
          </p>
        </article>
      </div>
    </div>
  );
}
