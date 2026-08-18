import { Fragment, type ReactNode } from "react";

/**
 * The small slice of markdown the assistant actually emits.
 *
 * Hand-written rather than a library because the surface is tiny -
 * paragraphs, bullet and numbered lists, `**strong**`, `*emphasis*`
 * and backtick code - and because everything here becomes React
 * elements. Nothing is ever passed to `dangerouslySetInnerHTML`, so
 * model output cannot inject markup no matter what it writes.
 *
 * **Strong is not bold**, because this design system has no bold: only
 * weight 400 of Inter Tight is loaded, so `font-bold` has nothing to
 * resolve to and the browser would synthesise a smeared fake. The
 * site's own idiom for emphasis is a colour step - the timeline does
 * exactly this, setting the metric in one grey and its explanation in
 * another - so strong text takes ink-black against a mist-gray
 * paragraph.
 *
 * **Links are rendered as their label, not as anchors.** The model is
 * told to answer only from the profile document, but a URL it invents
 * would look identical to a real one, and sending a visitor to a
 * fabricated address is worse than showing them plain text.
 */

/** `**strong**`, `*em*` and `` `code` `` inside one block of text. */
function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  /* One pass, alternating between the marker patterns, so nested and
     unbalanced markers degrade to literal text rather than throwing. */
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\([^)]*\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${i++}`;

    if (match[1] !== undefined) {
      out.push(
        <span key={key} className="text-ink-black">
          {match[1]}
        </span>,
      );
    } else if (match[2] !== undefined) {
      out.push(
        <em key={key} className="italic">
          {match[2]}
        </em>,
      );
    } else if (match[3] !== undefined) {
      out.push(
        <code key={key} className="rounded-lg bg-veil-gray/40 px-4 text-ink-black">
          {match[3]}
        </code>,
      );
    } else if (match[4] !== undefined) {
      /* Label only - see the note above. */
      out.push(<Fragment key={key}>{match[4]}</Fragment>);
    }
    last = pattern.lastIndex;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}

type Block =
  | { type: "p"; lines: string[] }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function parse(source: string): Block[] {
  const blocks: Block[] = [];

  for (const raw of source.split("\n")) {
    const line = raw.trimEnd();
    const bullet = /^\s*[-*+]\s+(.*)$/.exec(line);
    const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    const last = blocks[blocks.length - 1];

    if (bullet) {
      if (last?.type === "ul") last.items.push(bullet[1]);
      else blocks.push({ type: "ul", items: [bullet[1]] });
    } else if (numbered) {
      if (last?.type === "ol") last.items.push(numbered[1]);
      else blocks.push({ type: "ol", items: [numbered[1]] });
    } else if (line.trim() === "") {
      /* A blank line closes whatever was open. */
      if (last?.type === "p") blocks.push({ type: "p", lines: [] });
    } else {
      /* Headings would out-size the answer they sit in, so `##` is
         stripped and the text joins the paragraph flow. */
      const text = line.replace(/^\s*#{1,6}\s+/, "");
      if (last?.type === "p" && last.lines.length > 0) last.lines.push(text);
      else if (last?.type === "p") last.lines.push(text);
      else blocks.push({ type: "p", lines: [text] });
    }
  }

  return blocks.filter(
    (b) =>
      (b.type === "p" && b.lines.length > 0) ||
      ((b.type === "ul" || b.type === "ol") && b.items.length > 0),
  );
}

export default function Markdown({ children }: { children: string }) {
  const blocks = parse(children);

  return (
    <div className="flex flex-col gap-12 text-body leading-body tracking-body text-mist-gray">
      {blocks.map((block, index) => {
        if (block.type === "p") {
          return <p key={index}>{inline(block.lines.join(" "), `p${index}`)}</p>;
        }

        const ordered = block.type === "ol";
        const items = block.items.map((item, i) => (
          <li key={i} className="flex gap-12">
            {ordered ? (
              <span className="shrink-0 tabular-nums text-smoke-gray">
                {i + 1}.
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="mt-8 block size-4 shrink-0 rounded-full bg-veil-gray"
              />
            )}
            <span>{inline(item, `i${index}-${i}`)}</span>
          </li>
        ));

        return ordered ? (
          <ol key={index} className="flex flex-col gap-8">
            {items}
          </ol>
        ) : (
          <ul key={index} className="flex flex-col gap-8">
            {items}
          </ul>
        );
      })}
    </div>
  );
}
