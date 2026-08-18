import Link from "next/link";
import SocialIcon from "@/components/SocialIcon";
import { profile, sections, socials } from "@/content/site";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="mx-auto w-full max-w-[var(--page-max-width)] px-24 pb-56 pt-56 sm:px-40 md:pb-100 md:pt-100"
    >
      <p className="label text-smoke-gray">{sections.contact.eyebrow}</p>

      <h2 className="mt-24 text-[24px] leading-heading tracking-heading text-ink-black sm:text-heading">
        {sections.contact.title}
      </h2>

      <p className="mt-16 max-w-[760px] text-body leading-body tracking-body text-mist-gray">
        {sections.contact.intro}
      </p>

      {/* Address left, marks right. The three icons carry the same
          three destinations the labelled list did - at this size the
          LinkedIn, X and envelope marks are unambiguous, and the words
          beside them were repeating what the logo already said. */}
      <div className="mt-40 flex flex-col gap-32 sm:flex-row sm:items-center sm:justify-between">
        {/* The address in full: the envelope opens a mail client, but
            plenty of people want to copy it rather than launch one. */}
        <a
          href={`mailto:${profile.email}`}
          className="link-underline inline-block text-subheading leading-subheading tracking-subheading text-ink-black"
        >
          {profile.email}
        </a>

        <ul className="flex items-center gap-16">
          {socials.map((s) => (
            <li key={s.label}>
              <Link
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  s.href.startsWith("http") ? "noreferrer noopener" : undefined
                }
                /* The label moves to `aria-label`: dropping the text
                   would otherwise leave a link whose only accessible
                   name is an icon. */
                aria-label={s.label}
                /* size-[48px], not size-48: 48 is not one of the declared
                   spacing steps, so `size-48` falls through to
                   Tailwind's own scale and renders at 192px. */
                className="flex size-[48px] items-center justify-center rounded-full border border-veil-gray text-ink-black transition-colors duration-200 hover:border-ink-black"
              >
                <SocialIcon name={s.icon} size={20} />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="label mt-100 text-smoke-gray">
        © {new Date().getFullYear()} {profile.fullName.toUpperCase()}
      </p>
    </footer>
  );
}
