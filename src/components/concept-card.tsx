import type { ReactNode } from "react";

export function ConceptCard({
  id,
  icon,
  title,
  lead,
  children,
  detailsLabel = "לפרטים המלאים",
}: {
  id?: string;
  icon: ReactNode;
  title: string;
  lead: string;
  children: ReactNode;
  detailsLabel?: string;
}) {
  return (
    <article id={id} className="concept-card">
      <div className="concept-card-heading">
        <span className="concept-card-icon" aria-hidden="true">
          {icon}
        </span>
        <div>
          <h2>{title}</h2>
          <p>{lead}</p>
        </div>
      </div>
      <details>
        <summary>{detailsLabel}</summary>
        <div className="concept-card-content">{children}</div>
      </details>
    </article>
  );
}
