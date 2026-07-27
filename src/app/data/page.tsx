import type { Metadata } from "next";
import { Download } from "lucide-react";
import { DownloadModal } from "../../components/download-modal";
import { MarkdownFile } from "../../components/markdown-file";
import { PageIntro } from "../../components/page-intro";
import { data } from "../../lib/data";
import { formatHebrewDateTime } from "../../lib/format";

export const metadata: Metadata = {
  title: "הורדת הנתונים",
  description: "קובצי CSV פתוחים והגדרות השדות של מאיפה הכסף.",
};

export default function DataPage() {
  return (
    <div className="prose-page data-page container">
      <PageIntro eyebrow="פתוח לבדיקה ולשימוש חוזר" title="הנתונים">
        <p>
          כל הנתונים הקנוניים זמינים כ־CSV ב־UTF-8. הקובץ הראשי כולל BOM כדי להיפתח בעברית תקינה
          ב־Excel.
        </p>
        <DownloadModal />
      </PageIntro>

      <section className="dataset-meta" aria-labelledby="release-title">
        <h2 id="release-title">גרסה {data.release.version}</h2>
        <dl>
          <div>
            <dt>פורסמה</dt>
            <dd>{formatHebrewDateTime(data.release.releasedAt)}</dd>
          </div>
          <div>
            <dt>מפלגות וישויות</dt>
            <dd>{data.parties.length}</dd>
          </div>
          <div>
            <dt>רשומות מימון</dt>
            <dd>{data.financingRecords.length}</dd>
          </div>
          <div>
            <dt>מקורות</dt>
            <dd>{data.sources.length}</dd>
          </div>
          <div>
            <dt>רישיון</dt>
            <dd>CC BY 4.0; סמלי מפלגות מוחרגים</dd>
          </div>
        </dl>
        <p>{data.release.summaryHe}</p>
      </section>

      <section className="download-grid" aria-labelledby="downloads-title">
        <h2 id="downloads-title">חבילות להורדה</h2>
        <a className="download-card" href="/data/master-financing-records.csv" download>
          <Download aria-hidden="true" />
          <strong>CSV ראשי</strong>
          <span>רשומות מימון מועשרות בשם המפלגה ובמקור</span>
        </a>
        <a className="download-card" href="/data/meeyfo-hakesef-normalized.zip" download>
          <Download aria-hidden="true" />
          <strong>חבילת CSV מנורמלת</strong>
          <span>כל טבלאות המקור, המטא־נתונים, המילון והרישיון</span>
        </a>
        <a className="download-card" href="/data/manifest.json" download>
          <Download aria-hidden="true" />
          <strong>Manifest</strong>
          <span>גרסה, ספירות ורשימת קבצים במבנה JSON</span>
        </a>
        <a className="download-card" href="/data/profile_checks.csv" download>
          <Download aria-hidden="true" />
          <strong>בדיקות כיסוי לפרופילים</strong>
          <span>תאריך, מקורות שנבדקו ותוצאת ההתאמה לכל אדם בשכבות הכיסוי</span>
        </a>
        <a className="download-card" href="/data/party_name_aliases.csv" download>
          <Download aria-hidden="true" />
          <strong>כינויי מפלגות</strong>
          <span>מיפוי שמות, סיעות ומותגי בחירות אל הישות הקנונית</span>
        </a>
      </section>

      <section className="rendered-markdown" aria-labelledby="dictionary-title">
        <h2 id="dictionary-title">מילון הנתונים</h2>
        <MarkdownFile relativePath="docs/data-dictionary.md" />
      </section>
    </div>
  );
}
