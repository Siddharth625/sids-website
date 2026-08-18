import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import Nav from "@/components/Nav";
import { profile } from "@/content/site";
import "./globals.css";

/**
 * Inter Tight is the spec's named substitute for the custom geometric
 * sans. Only weight 400 is loaded - the design has no bold, and not
 * shipping the other weights makes that impossible to violate by
 * accident.
 */
const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400"],
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
      </body>
    </html>
  );
}
