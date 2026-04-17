"use client";

import Link from "next/link";
import { useDeferredValue, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import PostList from "@/components/PostList";
import { PostData } from "@/lib/posts";
import { filterPosts } from "@/lib/post-search";
import { getSectionLabel, getSubsectionLabel } from "@/lib/site-structure";

interface FilteredPostListProps {
  allPostsData: PostData[];
}

export default function FilteredPostList({ allPostsData }: FilteredPostListProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const section = searchParams.get("section") || "";
  const subsection = searchParams.get("sub") || "";
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(
    () => filterPosts(allPostsData, { query: deferredQuery, section, subsection }),
    [allPostsData, deferredQuery, section, subsection],
  );

  const sectionLabel = section ? getSectionLabel(section) : "";
  const subsectionLabel = section && subsection ? getSubsectionLabel(section, subsection) : "";
  const hasActiveFilters = Boolean(query || section || subsection);

  return (
    <div className="space-y-6">
      {(sectionLabel || subsectionLabel) && (
        <div className="glass-panel edge-frame p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="data-label text-[10px] text-slate-400">
                active sector
              </p>
              <p className="mt-2 text-sm text-slate-200">
                <span className="font-medium text-white">{sectionLabel}</span>
                {subsectionLabel && <><span className="text-slate-500"> / </span><span className="text-yellow-100">{subsectionLabel}</span></>}
              </p>
            </div>

            <Link
              href={query ? `/?q=${encodeURIComponent(query)}` : "/"}
              className="data-label text-[10px] text-slate-400 transition-colors hover:text-yellow-100"
            >
              clear_sector
            </Link>
          </div>
        </div>
      )}

      {query && (
        <div className="glass-panel edge-frame p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="data-label text-[10px] text-slate-400">
                datastream scan
              </p>
              <p className="mt-2 text-sm text-slate-200">
                For &ldquo;<span className="text-white">{query}</span>&rdquo; we found{' '}
                <span className="font-medium text-yellow-100">{filtered.length}</span> packets.
              </p>
            </div>

            <Link
              href={section ? `/?section=${encodeURIComponent(section)}${subsection ? `&sub=${encodeURIComponent(subsection)}` : ""}` : "/"}
              className="data-label text-[10px] text-slate-400 transition-colors hover:text-yellow-100"
            >
              reset_scan
            </Link>
          </div>
        </div>
      )}

      {filtered.length > 0 ? (
        <PostList initialPosts={filtered} />
      ) : hasActiveFilters ? (
        <div className="glass-panel edge-frame py-16 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="font-display text-xl font-semibold text-white">
              Transmission not found
            </h3>
            <p className="text-sm text-slate-400">
              {query ? (
                <>
                  Scan for &ldquo;<span className="text-slate-100">{query}</span>&rdquo; returned zero packets.
                </>
              ) : (
                <>No transmissions matched the current routing filters.</>
              )}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
