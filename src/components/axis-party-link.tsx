"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AxisPartyLink({
  href,
  name,
  color,
}: {
  href: string;
  name: string;
  color: string;
}) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      aria-current={pathname === href || pathname === `${href}/` ? "page" : undefined}
      style={{ "--party-color": color } as React.CSSProperties}
    >
      {name}
    </Link>
  );
}
