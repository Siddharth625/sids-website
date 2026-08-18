import Image from "next/image";
import Link from "next/link";
import { Row, Tag } from "@/components/Section";
import Sphere from "@/components/Sphere";
import type { Post } from "@/content/site";
import { formatDate } from "@/lib/format";

/**
 * One entry in the writing list: thumbnail, title, summary and meta.
 *
 * Shared by the homepage preview and /writing so the two can't drift.
 * External posts open in a new tab; internal ones don't.
 */
export default function PostRow({
  post,
  index,
  headingLevel: Heading = "h3",
}: {
  post: Post;
  index: number;
  headingLevel?: "h2" | "h3";
}) {
  const external = post.href.startsWith("http");

  return (
    <Row>
      <Link
        href={post.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        className="group flex flex-col gap-24 sm:flex-row"
      >
        {/* Thumbnail. Falls back to the brand sphere on an ink card -
            the same treatment the project features use - so a post
            without a cover image still looks deliberate. */}
        <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden rounded-feature bg-ink-black sm:w-[180px]">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt=""
              fill
              sizes="180px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Sphere className="w-[62%]" variant={index + 1} />
            </div>
          )}
        </div>

        {/* flex-1 matters: without it this column shrink-to-fits its
            content, so a post with a short blurb ends up narrower than
            its neighbours and its right-aligned date stops lining up
            with theirs. */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-x-24 gap-y-8 md:flex-row md:items-baseline md:justify-between">
            <Heading className="text-subheading leading-subheading tracking-subheading text-ink-black transition-colors duration-200 group-hover:text-smoke-gray">
              {post.title}
            </Heading>
            <p className="label shrink-0 text-smoke-gray md:text-right">
              {formatDate(post.date)}
              {post.readingTime ? ` · ${post.readingTime}` : ""}
            </p>
          </div>

          <p className="mt-12 text-body leading-body tracking-body text-mist-gray">
            {post.blurb}
          </p>

          {post.source && (
            <div className="mt-16">
              <Tag>{post.source}</Tag>
            </div>
          )}
        </div>
      </Link>
    </Row>
  );
}
