import Link from "next/link";
import { siteConfig } from "../../config/site";
import { AxisNavigation } from "./axis-navigation";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-bar container">
        <Link className="brand" href="/" aria-label={`${siteConfig.nameHe} — דף הבית`}>
          <span className="brand-dot" aria-hidden="true" />
          {siteConfig.nameHe}
        </Link>
        <nav aria-label="ניווט ראשי">
          <ul className="primary-nav">
            <li>
              <Link href="/methodology">מתודולוגיה</Link>
            </li>
            <li>
              <Link href="/glossary">מילון מושגים</Link>
            </li>
            <li>
              <Link href="/data">נתונים</Link>
            </li>
          </ul>
        </nav>
      </div>
      <AxisNavigation />
    </header>
  );
}
