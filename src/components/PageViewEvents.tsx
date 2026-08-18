"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { capture, PAGE_EVENTS } from "@/lib/analytics";

/**
 * A named event per page, on top of PostHog's automatic `$pageview`.
 *
 * Keyed on `usePathname` rather than on clicks in the nav, so a visit
 * counts however it arrived - nav click, direct link, back button or
 * a share. Wiring it to the nav links would have missed all but the
 * first.
 *
 * `usePathname` specifically, never `useSearchParams`: the latter
 * opts every page that uses it out of static rendering, and every page
 * on this site is static.
 */
export default function PageViewEvents() {
  const pathname = usePathname();

  useEffect(() => {
    const event = PAGE_EVENTS[pathname];
    if (event) capture(event, { path: pathname });
    else capture("page_viewed", { path: pathname });
  }, [pathname]);

  return null;
}
