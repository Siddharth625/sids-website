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

      {/* The address in full: the EMAIL icon below opens a mail client,
          but plenty of people want to copy it rather than launch one. */}
      <a
        href={`mailto:${profile.email}`}
        className="link-underline mt-40 inline-block text-subheading leading-subheading tracking-subheading text-ink-black"
      >
        {profile.email}
      </a>

      <ul className="mt-56 flex flex-wrap items-center gap-x-24 gap-y-16">
        {socials.map((s) => (
          <li key={s.label}>
            <Link
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noreferrer noopener" : undefined}
              className="label inline-flex items-center gap-8 text-ink-black transition-colors duration-200 hover:text-smoke-gray"
            >
              <SocialIcon name={s.icon} />
              {s.label}
            </Link>
          </li>
        ))}
      </ul>

      <p className="label mt-100 text-smoke-gray">
        © {new Date().getFullYear()} {profile.fullName.toUpperCase()}
      </p>
    </footer>
  );
}
