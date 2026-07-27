# Source verification

The four layers are separate:

1. **URL availability** — status, redirects, and content type.
2. **Document retrieval** — bytes received, PDF/HTML detection, and optional SHA-256.
3. **Structural extraction** — expected fields and record boundaries.
4. **Semantic verification** — a human checks that the source supports the exact published
   claim.

`check-links` performs layers 1 and 2 only. Data collectors perform layer 3. A financing
record may be published only after layer 4 is recorded as `verified`.

## בדיקות והעשרת פרופילי אנשים

בדיקת הפרופילים נעשית באופן אחיד לפי היקף הרשומות ולא לפי זהות האדם או המפלגה:

1. **שכבה 1** — כל אדם שדווח כערב וכן כל צד שכנגד שסכומיו המצטברים הם
   50,000 ₪ ומעלה. נדרשת העשרה מלאה כאשר קיימת התאמה ראייתית.
2. **שכבה 2** — כל אדם נוסף שסכומיו המצטברים הם 10,000 ₪ ומעלה. נדרשת בדיקה
   מתועדת והוספת קישור הרחבה רק כאשר הזהות הותאמה בביטחון.

לכל אדם בשתי השכבות נרשמת שורה ב־`data/profile_checks.csv`. סדר החיפוש הראייתי
הוא: דיווחי מאיה ורשות ניירות ערך; רשות התאגידים; אתרי קשרי משקיעים רשמיים;
ביוגרפיות מוסדיות רשמיות. טענת תפקיד מתווספת ל־`person_roles.csv` רק כאשר
מקור אחד תומך במישרין בנוסח הנייטרלי שפורסם. לכל טענה מוצמד `source_id` יחיד
ומצב האימות נשמר ביושר.

התאמת זהות דורשת שם ולפחות אות מאשש נוסף: יישוב מן הפרסום הסטטוטורי, תפקיד
התואם את הדיווח, או ייחודיות מובהקת של השם. שם נפוץ ללא אות מאשש אינו מקבל
טענה או קישור. כאשר קיימים שני אנשים אפשריים — ובפרט כאשר במאגר עצמו קיימות
שתי רשומות באותו שם — התוצאה היא `ambiguous_identity`; אין לבחור ביניהם.

ויקיפדיה ואתרים אישיים או תאגידיים נשמרים ב־`external_links.csv` כקישורי
„להרחבה” בלבד. הם אינם ראיה לרשומת מימון ואינם מחליפים מקור לטענת תפקיד.
כאשר הזהות הותאמה בביטחון וקיים ערך בוויקיפדיה העברית, הוא נוסף כקישור
`kind=wikipedia`.

תוצאות הבדיקה האפשריות:

- `enriched` — פורסמה לפחות טענה אחת עם מקור;
- `links_only` — נמצאו קישורי הרחבה אך לא טענה ראייתית;
- `no_reliable_match` — לא נמצאה התאמה במקור ראייתי;
- `ambiguous_identity` — אין די אותות כדי לבחור זהות אחת בביטחון.

If robots.txt or terms do not allow automated retrieval, stop automated access and ask the
owner to retrieve the document manually. Record that provenance without claiming automated
verification.

Known restriction recorded on 2026-07-27: the State Comptroller website terms require access
through the interfaces and instructions supplied by the site. `check-links` therefore makes no
automated document request to `mevaker.gov.il` hosts. Those sources are checked through the
public user interface and reported as `manual_check_required`. The site's `robots.txt` returned
HTTP 200 with no rules, but an empty robots file does not override the terms.

Known restriction recorded on 2026-07-27: `mayafiles.tase.co.il/robots.txt` returned HTTP 403
to the automated checker. The two cited filings were opened and semantically checked through a
regular browser. `check-links` therefore reports that host as `manual_check_required` instead
of retrying or bypassing the restriction.

Semantic verification states stored in `sources.csv`:

- `verified`
- `pending_semantic`
- `unreachable_temp`
- `superseded`

HTTP link-check states stored in the generated report are separate:

- `available` and `redirected` — an ordinary successful response;
- `blocked_bot` — HTTP 401, 403 or 429 indicates an automated-access block;
- `unexpected_status` — any response outside the accepted HTTP 200–226 range, including
  non-standard responses such as 247;
- `robots_disallowed` and `robots_unknown` — the automated check did not retrieve the target;
- `manual_check_required` — the host is intentionally excluded from automated retrieval;
- `unreachable` and `hash_mismatch` — retrieval failed or retrieved bytes differ from the
  recorded fingerprint.

`blocked_bot` and `unexpected_status` are explicit manual-verification flags. They never cause
automatic source deletion and never masquerade as `available`.
