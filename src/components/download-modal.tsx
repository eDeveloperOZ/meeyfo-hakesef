"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { Download, ExternalLink, Heart, X } from "lucide-react";
import { siteConfig } from "../../config/site";
import { trackPublicEvent } from "./analytics";

export function DownloadModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="primary-button" type="button">
          <Download aria-hidden="true" size={18} />
          הורדת הנתונים
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="dialog-header">
            <div>
              <Dialog.Title>הנתונים פתוחים וחופשיים לשימוש</Dialog.Title>
              <Dialog.Description>
                הפרויקט נבנה ומתוחזק באופן עצמאי. אפשר להוריד מיד; תמיכה היא בחירה נפרדת.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="icon-button" type="button" aria-label="סגירת חלון ההורדה">
                <X aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <div className="download-actions">
            <a
              className="primary-button"
              href="/data/master-financing-records.csv"
              download
              onClick={() => trackPublicEvent("csv_download", { package: "master_csv" })}
            >
              <Download aria-hidden="true" size={18} />
              הורדת הנתונים
            </a>
            <div className="support-box">
              <strong>
                <Heart aria-hidden="true" size={18} />
                תמיכה בפרויקט
              </strong>
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
              <Link href="/about">מי מאחורי האתר?</Link>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
