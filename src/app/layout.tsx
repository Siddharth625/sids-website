import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import AskLauncher from "@/components/AskLauncher";
import PageViewEvents from "@/components/PageViewEvents";
import PostHogScript from "@/components/PostHogScript";
import Nav from "@/components/Nav";
import { profile } from "@/content/site";
import "./globals.css";

/**
 * Inter Tight is the spec's named substitute for the custom geometric
 * sans. The design has no bold: weight 400 carries the whole site, and
 * hierarchy comes from size and letter-spacing. Weight 600 is loaded
 * as a deliberate, single exception for the figures in the assistant's
 * answers.
 */
const interTight = Inter_Tight({
  subsets: ["latin"],
  /* 400 is the design system's only weight and stays that way
     everywhere on the page. 600 is loaded for exactly one thing: the
     figures in Arthur's answers, where a colour step alone was not
     enough to make a number jump out of a paragraph. Nothing else may
     use it - see the `strong`/`b` reset in globals.css, which still
     holds those elements at 400 by default. */
  weight: ["400", "600"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.fullName} - ${profile.role}`,
  description: profile.description,
  openGraph: {
    title: `${profile.fullName} - ${profile.role}`,
    description: profile.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={interTight.variable}>
      {/* Browser extensions (Grammarly, password managers, translators)
          inject attributes onto <body> before React hydrates, which
          trips a hydration mismatch and, in dev, throws up a full-screen
          error overlay that reads as "the page failed to load". This is
          the sanctioned escape hatch: it ignores attribute differences
          on this element only, not on its children. */}
      <body suppressHydrationWarning>
        <PostHogScript />
        <PageViewEvents />

        {/* Anchor targets sit behind a fixed nav; give keyboard users
            a way past it. */}
        <a
          href="#main"
          className="label sr-only focus:not-sr-only focus:fixed focus:left-24 focus:top-24 focus:z-[60] focus:rounded-button focus:bg-ink-black focus:px-16 focus:py-8 focus:text-paper-white"
        >
          SKIP TO CONTENT
        </a>
        <Nav />
        <main id="main">{children}</main>

        {/* Arthur, reachable from every page. */}
        <AskLauncher />
      </body>
    </html>
  );
}
