"use client";

import { useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/content/site";

/**
 * The filter bar under the quote on /projects, plus the list it
 * filters.
 *
 * Filtering is OR *within* a group and AND *across* groups: picking
 * B2B and two industries means "B2B, and in either of those
 * industries". That is the behaviour people expect from faceted
 * filters, and it is the only combination where adding a second value
 * to a group widens rather than narrows the result.
 *
 * Facet values are derived from the projects themselves rather than
 * hardcoded, so a filter can never offer something that matches
 * nothing - and a new project's skill appears in the bar for free.
 */

type Group = "icp" | "industry" | "skill";

function FilterGroup({
  label,
  values,
  active,
  onToggle,
}: {
  label: string;
  values: readonly string[];
  active: ReadonlySet<string>;
  onToggle: (value: string) => void;
}) {
  if (values.length === 0) return null;

  return (
    <div className="flex flex-col gap-12 sm:flex-row sm:items-baseline sm:gap-24">
      <p className="label shrink-0 text-smoke-gray sm:w-[104px]">{label}</p>
      {/* One scrolling row per group below `sm`, wrapping above it.
          Stacked, the eight skill pills alone pushed the first project
          about 1100px down a 390px screen. The negative margin lets
          the row bleed to the page edge so it reads as scrollable
          rather than as a clipped box. */}
      <div className="flex items-center gap-8 max-sm:-mx-24 max-sm:overflow-x-auto max-sm:px-24 max-sm:[scrollbar-width:none] sm:flex-wrap">
        {values.map((value) => {
          const on = active.has(value);
          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggle(value)}
              aria-pressed={on}
              className={[
                "label shrink-0 rounded-button border px-16 py-8 transition-colors",
                on
                  ? "border-ink-black bg-ink-black text-paper-white"
                  : "border-veil-gray text-smoke-gray hover:border-ink-black hover:text-ink-black",
              ].join(" ")}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProjectFilters({
  projects,
}: {
  projects: readonly Project[];
}) {
  const [selected, setSelected] = useState<Record<Group, ReadonlySet<string>>>({
    icp: new Set(),
    industry: new Set(),
    skill: new Set(),
  });

  const facets = useMemo(() => {
    const icp = new Set<string>();
    const industry = new Set<string>();
    const skill = new Set<string>();
    projects.forEach((project) => {
      icp.add(project.icp);
      project.industries.forEach((value) => industry.add(value));
      project.skills.forEach((value) => skill.add(value));
    });
    return {
      /* B2B before B2C; the rest alphabetical so the bar does not
         reshuffle when a project is added. */
      icp: [...icp].sort(),
      industry: [...industry].sort(),
      skill: [...skill].sort(),
    };
  }, [projects]);

  const toggle = (group: Group) => (value: string) =>
    setSelected((current) => {
      const next = new Set(current[group]);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...current, [group]: next };
    });

  const activeCount =
    selected.icp.size + selected.industry.size + selected.skill.size;

  const visible = useMemo(
    () =>
      projects.filter((project) => {
        if (selected.icp.size && !selected.icp.has(project.icp)) return false;
        if (
          selected.industry.size &&
          !project.industries.some((value) => selected.industry.has(value))
        )
          return false;
        if (
          selected.skill.size &&
          !project.skills.some((value) => selected.skill.has(value))
        )
          return false;
        return true;
      }),
    [projects, selected],
  );

  return (
    <>
      <div className="mt-40 flex flex-col gap-24 border-y border-veil-gray py-32">
        <FilterGroup
          label="ICP TYPE"
          values={facets.icp}
          active={selected.icp}
          onToggle={toggle("icp")}
        />
        <FilterGroup
          label="INDUSTRY"
          values={facets.industry}
          active={selected.industry}
          onToggle={toggle("industry")}
        />
        <FilterGroup
          label="SKILLS"
          values={facets.skill}
          active={selected.skill}
          onToggle={toggle("skill")}
        />

        {activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-24 sm:pl-[128px]">
            {/* Live region: the list below can move a long way off
                screen, so the count is announced rather than only
                seen. */}
            <p aria-live="polite" className="label text-smoke-gray">
              {visible.length} of {projects.length} shown
            </p>
            <button
              type="button"
              onClick={() =>
                setSelected({
                  icp: new Set(),
                  industry: new Set(),
                  skill: new Set(),
                })
              }
              className="label link-underline text-ink-black"
            >
              CLEAR
            </button>
          </div>
        )}
      </div>

      {visible.length > 0 ? (
        <div className="mt-56 flex flex-col gap-y-56 md:gap-y-100">
          {visible.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      ) : (
        <p className="mt-56 text-body leading-body tracking-body text-mist-gray">
          Nothing matches that combination.
        </p>
      )}
    </>
  );
}
