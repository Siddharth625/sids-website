import Image from "next/image";
import Link from "next/link";
import BriefcaseIcon from "@/components/BriefcaseIcon";
import PostLogo from "@/components/PostLogo";
import { CasedLabel } from "@/components/Section";
import { education, work } from "@/content/site";

/**
 * Vertical timeline, most recent first: the roles from `work`, then
 * the studies from `education`.
 *
 * The roles are read straight out of `work` rather than restated here,
 * so editing a role in one place updates both the Work section and
 * this one.
 *
 * The rail is a single absolutely positioned hairline behind the
 * markers rather than a border on each row, which keeps it unbroken
 * through rows of different heights.
 */

function Marker({ accent = false }: { accent?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-0 top-4 block size-12 rounded-full ring-4 ring-paper-white ${
        accent ? "bg-klein-blue" : "bg-veil-gray"
      }`}
    />
  );
}

export default function Timeline() {
  return (
    <ol className="relative">
      {/* The rail. Inset by half the marker so it runs through their
          centres, and stopped short at the bottom so it fades out on
          the last entry rather than dangling. */}
      <span
        aria-hidden="true"
        className="absolute bottom-32 left-[5px] top-8 w-px bg-veil-gray"
      />

      {work.map((role, i) => (
        <li
          key={`${role.company}-${role.period}`}
          className="relative pb-56 pl-40"
        >
          <Marker accent={i === 0} />

          <p className="label text-smoke-gray">{role.period}</p>

          <div className="mt-12 flex items-center gap-16">
            {role.logo && (
              <div className="size-[40px] shrink-0 overflow-hidden rounded-2xl bg-ink-black">
                <Image
                  src={role.logo}
                  alt=""
                  width={256}
                  height={256}
                  className="size-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-subheading leading-subheading tracking-subheading text-ink-black">
                {role.href ? (
                  <Link
                    href={role.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline"
                  >
                    {role.company}
                  </Link>
                ) : (
                  role.company
                )}
              </h3>
              <p className="mt-4">
                <CasedLabel className="text-smoke-gray">
                  {role.role}
                </CasedLabel>
              </p>
            </div>
          </div>

          {/* Bullets rather than chips here. The timeline has the room
              to say what each number actually means, and a row of bare
              figures reads as decoration without it. */}
          {role.impact && (
            <ul className="mt-16 flex max-w-[760px] flex-col gap-12">
              {role.impact.map((item) => (
                <li key={item.metric} className="flex gap-12">
                  <span
                    aria-hidden="true"
                    className="mt-8 block size-4 shrink-0 rounded-full bg-veil-gray"
                  />
                  <p className="text-body leading-body tracking-body text-mist-gray">
                    {/* Grey, not green: in a paragraph the coloured lead read as a
                        link. The chips elsewhere keep the green, where the
                        figure stands alone. */}
                    <span className="text-smoke-gray">{item.metric}</span>{" "}
                    {item.note}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}

      {education.map((study) => (
        <li key={study.id} className="relative pb-56 pl-40 last:pb-0">
          <Marker />

          {study.period && (
            <p className="label text-smoke-gray">{study.period}</p>
          )}

          <div className="mt-4 flex items-center gap-16">
            {study.logo && (
              /* Light chip, unlike the work marks: these crests sit on
                 white or pale grounds, so an ink chip would frame them
                 in a dark box rather than blend. */
              <div className="size-[40px] shrink-0 overflow-hidden rounded-2xl border border-veil-gray bg-paper-white">
                <Image
                  src={study.logo}
                  alt=""
                  width={256}
                  height={256}
                  className="size-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-subheading leading-subheading tracking-subheading text-ink-black">
                {study.institution}
              </h3>
              {study.stream && (
                <p className="label mt-4 text-smoke-gray">{study.stream}</p>
              )}
            </div>
          </div>

          {study.note && (
            <p className="mt-12 text-body leading-body tracking-body text-mist-gray">
              {study.note}
            </p>
          )}

          {study.achievements && (
            <ul className="mt-16 flex flex-col gap-8">
              {study.achievements.map((item) => (
                <li key={item} className="flex gap-12">
                  <span
                    aria-hidden="true"
                    className="mt-8 block size-4 shrink-0 rounded-full bg-veil-gray"
                  />
                  <span className="text-body leading-body tracking-body text-mist-gray">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Sub-entries sit inside their parent's row, indented and
              boxed, so the rail is not interrupted by a second track. */}
          {/* Nested activities collapse by default. Manipal carries a
              four-post IAESTE progression plus RevX, which expanded
              would bury the rest of the timeline, and on a phone would
              be several screens of scrolling before the next entry.
              <details> gives that for free: no JS, keyboard operable,
              and findable by in-page search when open. */}
          {study.children?.map((child) => (
            <details
              key={child.id}
              className="group mt-24 rounded-card border border-veil-gray"
            >
              <summary className="flex cursor-pointer list-none items-center gap-16 p-24 [&::-webkit-details-marker]:hidden">
                {child.icon === "briefcase" && (
                  <div className="flex size-[40px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-veil-gray bg-paper-white">
                    <BriefcaseIcon />
                  </div>
                )}

                {child.logo && (
                  <div className="size-[40px] shrink-0 overflow-hidden rounded-2xl border border-veil-gray bg-paper-white">
                    <Image
                      src={child.logo}
                      alt=""
                      width={256}
                      height={256}
                      className="size-full object-cover"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  {/* Not the `label` utility: that uppercases, which would turn
                      "RevX, Manipal Incubation Center" into shouting and
                      lose the intended capitalisation. */}
                  <h4 className="text-caption leading-caption tracking-caption text-ink-black">
                    {child.institution}
                  </h4>
                  {child.stream && (
                    <p className="label mt-4 text-smoke-gray">{child.stream}</p>
                  )}
                </div>

                {/* Rotates into a cross when open. */}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-subheading leading-none text-smoke-gray transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>

              <div className="px-24 pb-24">
                {child.href && (
                  <Link
                    href={child.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="label link-underline inline-block text-ink-black"
                  >
                    {child.linkLabel ?? "VISIT"}
                  </Link>
                )}

                {child.note && (
                  <p className="mt-16 text-body leading-body tracking-body text-mist-gray">
                    {child.note}
                  </p>
                )}

                {child.achievements && (
                  <ul className="mt-16 flex flex-col gap-8">
                    {child.achievements.map((item) => (
                      <li key={item} className="flex gap-12">
                        <span
                          aria-hidden="true"
                          className="mt-8 block size-4 shrink-0 rounded-full bg-veil-gray"
                        />
                        <span className="text-body leading-body tracking-body text-mist-gray">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {child.posts && (
                  <ol className="relative mt-24">
                    <span
                      aria-hidden="true"
                      className="absolute bottom-24 left-[3px] top-8 w-px bg-veil-gray"
                    />
                    {child.posts.map((post) => (
                      <li
                        key={post.title}
                        className="relative pb-24 pl-32 last:pb-0"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-8 block size-8 rounded-full bg-veil-gray ring-4 ring-paper-white"
                        />
                        {post.period && (
                          <p className="label text-smoke-gray">{post.period}</p>
                        )}
                        {/* The logo sits with the title rather than in
                            the left gutter: that column already holds
                            the progression's rail and node, and a mark
                            there would compete with them. Smaller than
                            the 40px organisation chip above, so a list
                            of employers still reads as one nested
                            progression rather than as a second list of
                            top-level entries. */}
                        <div className="mt-4 flex items-center gap-12">
                          {/* The slot is reserved for every post in a
                              progression as soon as one of them has a
                              mark, so a single employer without a logo
                              doesn't pull its title out of line with
                              the rest. */}
                          {child.posts?.some((entry) => entry.logo || entry.icon) && (
                            <div className="size-32 shrink-0">
                              {post.logo ? (
                                <PostLogo src={post.logo} />
                              ) : post.icon === "briefcase" ? (
                                <div className="flex size-full items-center justify-center rounded-lg border border-veil-gray bg-paper-white">
                                  <BriefcaseIcon size={18} />
                                </div>
                              ) : null}
                            </div>
                          )}
                          <p className="text-body leading-body tracking-body text-ink-black">
                            {post.title}
                          </p>
                        </div>
                        <ul className="mt-12 flex flex-col gap-8">
                          {post.points.map((point) => (
                            <li key={point} className="flex gap-12">
                              <span
                                aria-hidden="true"
                                className="mt-8 block size-4 shrink-0 rounded-full bg-veil-gray"
                              />
                              <span className="text-body leading-body tracking-body text-mist-gray">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </details>
          ))}
        </li>
      ))}
    </ol>
  );
}
