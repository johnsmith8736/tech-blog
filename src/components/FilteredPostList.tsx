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

  return (
    <div className="space-y-6">
      {(sectionLabel || subsectionLabel) && (
        <div className="glass-panel edge-frame p-4">
          <p className="text-xs font-mono uppercase tracking-[0.16em] text-slate-300">
            Directory :: <span className="font-bold text-cyan-200">{sectionLabel}</span>
            {subsectionLabel && <> / <span className="font-bold text-amber-200">{subsectionLabel}</span></>}
          </p>
        </div>
      )}

      {query && (
        <div className="glass-panel edge-frame p-4">
          <p className="text-xs font-mono uppercase tracking-[0.16em] text-slate-300">
            Search Results For &quot;<span className="font-bold text-cyan-200">{query}</span>&quot; ::
            <span className="font-bold text-cyan-200"> {filtered.length}</span> Transmissions Found
          </p>
        </div>
      )}

      <PostList initialPosts={filtered} />

      {filtered.length === 0 && query && (
        <div className="glass-panel edge-frame py-16 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <h3 className="text-lg font-mono font-bold text-cyan-200">
              NO TRANSMISSIONS FOUND
            </h3>
            <p className="text-sm font-mono text-slate-400">
              SEARCH FOR &quot;<span className="font-bold text-cyan-200">{query}</span>&quot; RETURNED ZERO RESULTS
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
