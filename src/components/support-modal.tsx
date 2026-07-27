"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { ExternalLink, Heart, X } from "lucide-react";
import { siteConfig } from "../../config/site";

export function SupportModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="text-button" type="button">
          תמיכה בפרויקט
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="dialog-header">
            <Dialog.Title>תמיכה בפרויקט</Dialog.Title>
            <Dialog.Close asChild>
              <button className="icon-button" type="button" aria-label="סגירת חלון התמיכה">
                <X aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <p>הדרך הפשוטה לעזור היא לעקוב אחר העדכונים, לשתף מקור רשמי או לסמן כוכב ב־GitHub.</p>
          <div className="button-row">
            <a
              className="secondary-button"
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer external"
            >
              <Heart aria-hidden="true" size={17} />
              GitHub
              <ExternalLink aria-hidden="true" size={15} />
            </a>
            <a
              className="secondary-button"
              href={siteConfig.xUrl}
              target="_blank"
              rel="noopener noreferrer external"
            >
              X
              <ExternalLink aria-hidden="true" size={15} />
            </a>
            <Link className="secondary-button" href="/about">
              מי מאחורי האתר?
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
