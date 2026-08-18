import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/Section";
import { profile } from "@/content/site";
import { buildAgentMarkdown } from "@/lib/agent-markdown";

export const metadata: Metadata = {
  title: "For agents",
  description: `Machine-readable summary of ${profile.fullName}'s site.`,
};

/**
 * The agent view: the whole site as plain markdown source.
 *
 * Rendered inside <pre> on purpose. Formatting it as HTML would defeat
 * the point, since what a model wants is the markdown itself, not a
 * styled approximation of it. The same string is served raw at
 * /llms.txt for anything fetching rather than browsing.
 */
export default function AgentView() {
  const markdown = buildAgentMarkdown();

  return (
    <PageShell>
      <Section>
        <div className="flex flex-wrap items-baseline justify-between gap-16">
          <div>
            <p className="label text-smoke-gray">FOR AGENTS</p>
            <h1 className="mt-12 text-[24px] leading-heading tracking-heading text-ink-black sm:text-heading">
              This page as markdown
            </h1>
          </div>

          <Link
            href="/llms.txt"
            className="label link-underline text-ink-black"
            prefetch={false}
          >
            RAW AT /LLMS.TXT
          </Link>
        </div>

        <p className="mt-16 max-w-[760px] text-body leading-body tracking-body text-mist-gray">
          Everything on this site, generated from the same content source
          the pages use, so the two cannot drift apart.
        </p>

        <pre className="mt-40 overflow-x-auto whitespace-pre-wrap rounded-card border border-veil-gray p-32 text-caption leading-body tracking-caption text-ink-black">
          {markdown}
        </pre>
      </Section>
    </PageShell>
  );
}
