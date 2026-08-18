import {
  clients,
  education,
  industries,
  posts,
  profile,
  projects,
  socials,
  work,
} from "@/content/site";

/**
 * Renders the site's content as plain markdown for machine readers.
 *
 * Generated from `site.ts` rather than written by hand, so the agent
 * view cannot drift from what the pages show.
 *
 * Deliberately omits Interests, Books and the Knowledge Bank: those
 * sections are still placeholder copy, and publishing "BOOK TITLE" to
 * something built for extraction is worse than omitting it.
 */
export function buildAgentMarkdown(): string {
  const L: string[] = [];
  const push = (...lines: string[]) => L.push(...lines);

  push(`# ${profile.fullName}`, "");
  push(`> ${profile.headline}`, "");
  push(`- **Role:** ${profile.role}`);
  push(`- **Email:** ${profile.email}`);
  socials.forEach((s) => push(`- **${s.label}:** ${s.href}`));
  push("");

  push("## About", "", profile.bio, "");

  push("## Industry experience", "");
  industries.items.forEach((i) => push(`- ${i.name}`));
  push("");

  push(`## ${clients.title}`, "");
  clients.items.forEach((c) => push(`- ${c.name}`));
  push("");

  push("## Work", "");
  work.forEach((role) => {
    push(`### ${role.role}, ${role.company}`, "");
    push(`- **Period:** ${role.period}`);
    if (role.context) push(`- **Context:** ${role.context}`);
    if (role.href) push(`- **Link:** ${role.href}`);
    push(`- **Detail page:** /work/${role.slug}`);
    push("", role.blurb, "");
    if (role.impact?.length) {
      push("**Impact**", "");
      role.impact.forEach((i) => push(`- **${i.metric}** ${i.note}`));
      push("");
    }
    if (role.highlights?.length) {
      push("**Highlights**", "");
      role.highlights.forEach((h) => push(`- ${h}`));
      push("");
    }
  });

  push("## Education and activities", "");
  education.forEach((study) => {
    push(`### ${study.institution}`, "");
    if (study.period) push(`- **Period:** ${study.period}`);
    if (study.stream) push(`- **Stream:** ${study.stream}`);
    push("");
    if (study.achievements?.length) {
      study.achievements.forEach((a) => push(`- ${a}`));
      push("");
    }
    study.children?.forEach((child) => {
      push(`#### ${child.institution}`, "");
      if (child.stream) push(`- **Period:** ${child.stream}`);
      if (child.href) push(`- **Link:** ${child.href}`);
      push("");
      if (child.note) push(child.note, "");
      if (child.achievements?.length) {
        child.achievements.forEach((a) => push(`- ${a}`));
        push("");
      }
      child.posts?.forEach((post) => {
        push(`##### ${post.title}${post.period ? ` (${post.period})` : ""}`, "");
        post.points.forEach((pt) => push(`- ${pt}`));
        push("");
      });
    });
  });

  push("## Projects", "");
  projects.forEach((p) => {
    push(`### ${p.title} (${p.year})`, "");
    push(p.blurb, "");
    push(`- **Tags:** ${p.tags.join(", ")}`);
    if (p.href) push(`- **Link:** ${p.href}`);
    push("");
  });

  push("## Writing", "");
  posts.forEach((post) => {
    push(`### ${post.title}`, "");
    push(`- **Date:** ${post.date}`);
    if (post.readingTime) push(`- **Reading time:** ${post.readingTime}`);
    if (post.source) push(`- **Published on:** ${post.source}`);
    push(`- **Link:** ${post.href}`);
    push("", post.blurb, "");
  });

  return L.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
