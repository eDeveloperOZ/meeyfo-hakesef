import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { siteConfig } from "../../config/site";
import { SupportModal } from "./support-modal";

const internalLinks = [
  ["/methodology", "מתודולוגיה"],
  ["/glossary", "מילון מושגים"],
  ["/how-it-works", "איך זה עובד"],
  ["/data", "נתונים להורדה"],
  ["/about", "אודות"],
  ["/accessibility", "נגישות"],
  ["/privacy", "פרטיות"],
  ["/terms", "תנאי שימוש"],
  ["/corrections", "תיקונים"],
] as const;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid container">
        <div>
          <strong className="footer-brand">{siteConfig.nameHe}</strong>
          <p>{siteConfig.taglineHe}</p>
          <p>פרויקט עצמאי שאינו קשור למפלגה כלשהי.</p>
        </div>
        <nav aria-label="ניווט תחתון">
          <ul>
            {internalLinks.map(([href, label]) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer-external">
          <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer external">
            GitHub
            <ExternalLink aria-hidden="true" size={15} />
            <span className="sr-only">(נפתח בחלון חדש)</span>
          </a>
          <a href={siteConfig.xUrl} target="_blank" rel="noopener noreferrer external">
            X
            <ExternalLink aria-hidden="true" size={15} />
            <span className="sr-only">(נפתח בחלון חדש)</span>
          </a>
          <SupportModal />
        </div>
      </div>
    </footer>
  );
}
