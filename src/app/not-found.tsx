import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found-page container">
      <p className="error-code">404</p>
      <h1>העמוד לא נמצא</h1>
      <p>ייתכן שהקישור השתנה או שהמידע עדיין לא פורסם. הנתונים הקיימים נשארים זמינים.</p>
      <div className="button-row">
        <Link className="primary-button" href="/">
          חזרה לדף הבית
        </Link>
        <Link className="secondary-button" href="/data">
          לעמוד הנתונים
        </Link>
      </div>
    </div>
  );
}
