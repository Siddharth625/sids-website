import { buildAgentMarkdown } from "@/lib/agent-markdown";

/**
 * Raw markdown at /llms.txt, the convention crawlers and agents look
 * for. Served as text/plain so nothing has to render or execute to
 * read it.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(buildAgentMarkdown(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
