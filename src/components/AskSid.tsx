import AskChat from "@/components/AskChat";
import MeshGradient from "@/components/MeshGradient";
import { sections } from "@/content/site";

/**
 * The assistant section on the homepage: Arthur's context card beside
 * the chat, filling the viewport.
 *
 * **The scroll behaviour.** The panel fills the viewport, pins while
 * you scroll past it, then releases: `position: sticky` inside a
 * taller wrapper, where the wrapper's surplus height *is* the pin
 * duration. `svh` rather than `vh` throughout - `100vh` on mobile is
 * the height with browser chrome hidden, which would put the input
 * under the address bar.
 *
 * The chat itself lives in `AskChat`, because the floating launcher
 * renders the same thing without the context card. Two copies of a
 * component that owns a question allowance would be two allowances.
 */
export default function AskSid() {
  return (
    <section id="ask" aria-label={sections.ask.title} className="relative">
      {/* The wrapper's surplus height is the pin duration. */}
      <div className="h-[190svh]">
        <div className="sticky top-0 isolate flex h-svh flex-col overflow-hidden px-24 pb-32 pt-[104px] sm:px-40 sm:pb-40">
          <MeshGradient flip />

          <div className="mx-auto flex min-h-0 w-full max-w-[1080px] flex-1 items-center">
            <AskChat />
          </div>
        </div>
      </div>
    </section>
  );
}
