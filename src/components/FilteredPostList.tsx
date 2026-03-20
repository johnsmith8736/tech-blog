"use client";

import { useMemo } from "react";
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

  const filtered = useMemo(
    () => filterPosts(allPostsData, { query, section, subsection }),
    [allPostsData, query, section, subsection],
  );

  const sectionLabel = section ? getSectionLabel(section) : "";
  const subsectionLabel = section && subsection ? getSubsectionLabel(section, subsection) : "";
  const hasActiveFilters = Boolean(query || section || subsection);

  return (
    <div className="space-y-6">
      {(sectionLabel || subsectionLabel) && (
        <div className="glass-panel edge-frame p-4 md:p-5">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-400">
            Browsing
          </p>
          <p className="mt-2 text-sm text-slate-200">
            <span className="font-medium text-white">{sectionLabel}</span>
            {subsectionLabel && <><span className="text-slate-500"> / </span><span className="text-cyan-100">{subsectionLabel}</span></>}
          </p>
        </div>
      )}

      {query && (
        <div className="glass-panel edge-frame p-4 md:p-5">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-400">
            Search results
          </p>
          <p className="mt-2 text-sm text-slate-200">
            For &ldquo;<span className="text-white">{query}</span>&rdquo; we found{' '}
            <span className="font-medium text-cyan-100">{filtered.length}</span> posts.
          </p>
        </div>
      )}

      {filtered.length > 0 ? (
        <PostList initialPosts={filtered} />
      ) : hasActiveFilters ? (
        <div className="glass-panel edge-frame py-16 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="font-display text-xl font-semibold text-white">
              No matches found
            </h3>
            <p className="text-sm text-slate-400">
              {query ? (
                <>
                  Search for &ldquo;<span className="text-slate-100">{query}</span>&rdquo; returned zero results.
                </>
              ) : (
                <>No posts matched the current filters.</>
              )}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
