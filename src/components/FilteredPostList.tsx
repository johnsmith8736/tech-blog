"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import PostList from "@/components/PostList";
import { PostData } from "@/lib/posts";

interface FilteredPostListProps {
  allPostsData: PostData[];
}

export default function FilteredPostList({ allPostsData }: FilteredPostListProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const filtered = useMemo(() => {
    if (!query) {
      return allPostsData;
    }

    const tokens = query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    if (tokens.length === 0) {
      return allPostsData;
    }

    const matchesAllTokens = (text: string) => {
      const lowered = text.toLowerCase();
      return tokens.every((token) => {
        const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`\\b${escaped}\\b`, "i");
        return regex.test(lowered);
      });
    };

    return allPostsData.filter((post) =>
      matchesAllTokens(post.title) || matchesAllTokens(post.excerpt)
    );
  }, [allPostsData, query]);

  return (
    <div className="space-y-6">
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
