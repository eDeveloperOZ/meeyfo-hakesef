"use client";

import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { X } from "lucide-react";
import { glossaryTerms, type GlossaryTermKey } from "../lib/glossary";

export function TermPopover({ termKey }: { termKey: GlossaryTermKey }) {
  const term = glossaryTerms[termKey];
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="term-trigger" type="button">
          {term.term}
          <span className="sr-only"> — פתיחת הגדרה</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="popover-content" sideOffset={8}>
          <div className="popover-heading">
            <strong>{term.term}</strong>
            <Popover.Close asChild>
              <button
                className="icon-button icon-button-small"
                type="button"
                aria-label="סגירת ההגדרה"
              >
                <X aria-hidden="true" size={16} />
              </button>
            </Popover.Close>
          </div>
          <p>{term.short}</p>
          <Link href={`/glossary#${termKey}`}>להסבר המלא</Link>
          <Popover.Arrow className="popover-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
