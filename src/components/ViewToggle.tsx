"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Human / Agent switch.
 *
 * The agent side is a real route rather than a client-side mode, so it
 * can be linked, crawled and fetched without running any JS.
 */
export default function ViewToggle({ filled }: { filled: boolean }) {
  const pathname = usePathname();
  const onAgent = pathname === "/agent";

  const base =
    "label rounded-full px-12 py-4 transition-colors duration-200";

  const active = filled
    ? "bg-paper-white text-klein-blue"
    : "bg-ink-black text-paper-white";

  const idle = filled
    ? "text-on-accent/70 hover:text-on-accent"
    : "text-smoke-gray hover:text-ink-black";

  return (
    <div
      className={`hidden items-center gap-4 rounded-full p-4 sm:flex ${
        filled ? "bg-klein-blue/40" : "bg-veil-gray/40"
      }`}
    >
      <Link
        href="/"
        aria-current={!onAgent ? "page" : undefined}
        className={`${base} ${onAgent ? idle : active}`}
      >
        HUMAN
      </Link>
      <Link
        href="/agent"
        aria-current={onAgent ? "page" : undefined}
        className={`${base} ${onAgent ? active : idle}`}
      >
        AGENT
      </Link>
    </div>
  );
}
