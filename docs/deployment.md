# פריסה ב־Vercel

האתר נבנה כייצוא סטטי אל `out/`. אין API Routes, middleware או שרת
יישום.

## לפני כניסה ל־Vercel

1. עברו על `docs/legal/legal-review-checklist.md`.
2. ודאו שהביוגרפיה המאושרת מוצגת ושסמלי המפלגות נשארים כבויים בהתאם להחלטת בעל הפרויקט מ־27 ביולי 2026.
3. הריצו Node 22:

   ```bash
   npm ci
   npm run validate
   npm run test:e2e
   ```

4. ודאו ש־gitleaks נקי ושאין קבצים תחת `private/` או `.env*` במעקב.
5. מיזוג ל־`main` ופרסום ראשון דורשים אישור בעל הפרויקט.

## יצירת הפרויקט — פעולות בעל הפרויקט

1. היכנסו ל־[Vercel](https://vercel.com/) ואשרו את חשבון GitHub.
2. לחצו **Add New → Project**.
3. בחרו במאגר `eDeveloperOZ/meeyfo-hakesef`.
4. ודאו ש־Framework Preset הוא **Next.js**.
5. Build Command: `npm run build`.
6. Output Directory: `out`.
7. Node.js Version: `22.x`.
8. הוסיפו משתני סביבה:
   - `NEXT_PUBLIC_SITE_URL` — הכתובת הקנונית לאחר שתיקבע.
   - `NEXT_PUBLIC_GITHUB_URL=https://github.com/eDeveloperOZ/meeyfo-hakesef`
   - `NEXT_PUBLIC_X_URL=https://x.com/0fir0z`
   - `NEXT_PUBLIC_ANALYTICS_ENABLED=false`
9. אל תפעילו Analytics בלי אישור נפרד.
10. לחצו **Deploy** רק לאחר אישור מפורש לפרסום הראשון.

## בדיקת Preview

- ה־build הסתיים ללא שגיאה ונוצרו כל הנתיבים הסטטיים.
- `lang="he"` ו־`dir="rtl"` קיימים.
- דף הבית, כל עמוד מפלגה, מילון, מתודולוגיה והורדות פועלים.
- קובצי CSV נשמרים בעברית תקינה וה־ZIP נפתח.
- קישורי מקור ואתרי מפלגות נפתחים באופן אחיד.
- חלונות פועלים במקלדת ובמובייל.
- כותרות האבטחה מ־`vercel.json` מופיעות.

## דומיין

שיוך דומיין הוא שער אישור נפרד. לאחר רכישה, הגדירו אותו ב־Settings →
Domains ועדכנו את `NEXT_PUBLIC_SITE_URL`. הריצו פריסה חדשה ובדקו
canonical metadata והורדות.

## Analytics

הקוד משלב Vercel Web Analytics אך אינו מרנדר אותו כשהדגל `false`.
הפעלה דורשת אישור בעל הפרויקט ובדיקה שמדיניות הפרטיות עדיין מדויקת.
