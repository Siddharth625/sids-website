import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { ImpactPill, PageShell, Section } from "@/components/Section";
import { work } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return work.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const role = work.find((r) => r.slug === slug);
  if (!role) return {};
  return {
    title: `${role.role}, ${role.company}`,
    description: role.blurb,
  };
}

export default async function RoleDetail({ params }: Params) {
  const { slug } = await params;
  const role = work.find((r) => r.slug === slug);
  if (!role) notFound();

  return (
    <>
      <PageShell>
        <Section>
          <Link
            href="/work"
            className="label link-underline inline-block text-smoke-gray"
          >
            ALL WORK
          </Link>

          <div className="mt-40 flex items-center gap-24">
            {role.logo && (
              <div className="size-[64px] shrink-0 overflow-hidden rounded-2xl bg-ink-black">
                <Image
                  src={role.logo}
                  alt=""
                  width={256}
                  height={256}
                  priority
                  className="size-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="label text-smoke-gray">{role.period}</p>
              <h1 className="mt-8 text-[24px] leading-heading tracking-heading text-ink-black sm:text-heading">
                {role.role}
              </h1>
            </div>
          </div>

          <p className="mt-24 label text-ink-black">
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
            {role.context ? ` · ${role.context}` : ""}
          </p>

          <p className="mt-24 max-w-[720px] text-body leading-body tracking-body text-ink-black">
            {role.blurb}
          </p>

          {role.impact && (
            <ul className="mt-32 flex flex-wrap gap-8">
              {role.impact.map((item) => (
                <li key={item.metric}>
                  <ImpactPill>{item.metric}</ImpactPill>
                </li>
              ))}
            </ul>
          )}

          {role.highlights && (
            <ul className="mt-40 flex max-w-[760px] flex-col gap-16">
              {role.highlights.map((point) => (
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
          )}
        </Section>
      </PageShell>

      <Footer />
    </>
  );
}
