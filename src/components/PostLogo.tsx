"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Logo chip for a single post in a nested progression.
 *
 * Its own component, and a client one, purely so it can handle a
 * missing file. Logos are referenced by path rather than imported, so
 * one that hasn't landed yet is a runtime 404, and the browser draws
 * its broken-image glyph in the middle of the timeline. Rendering
 * nothing is the better failure: the entry still reads correctly, and
 * the mark appears on its own once the file exists.
 */
export default function PostLogo({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    /* `object-contain`, not `object-cover`: these are separate
       employers' marks rather than a curated set, so they arrive at
       whatever aspect ratio the company uses. UNESP's is a wide
       wordmark, and cover-cropping it to a square cuts the name off
       at both ends. */
    <div className="size-full overflow-hidden rounded-lg border border-veil-gray bg-paper-white p-[2px]">
      <Image
        src={src}
        alt=""
        width={256}
        height={256}
        className="size-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
