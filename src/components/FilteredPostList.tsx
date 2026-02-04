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
        <div className="p-3 border border-neon-cyan/20 bg-background/30">
          <p className="text-xs font-mono text-muted-foreground">
            SEARCH RESULTS FOR &quot;<span className="text-neon-cyan font-bold">{query}</span>&quot; ::
            <span className="text-neon-cyan font-bold"> {filtered.length}</span> TRANSMISSIONS FOUND
          </p>
        </div>
      )}

      <PostList initialPosts={filtered} />

      {filtered.length === 0 && query && (
        <div className="text-center py-16 border border-neon-cyan/20 bg-background/30">
          <div className="max-w-md mx-auto space-y-4">
            <h3 className="text-lg font-mono font-bold text-neon-cyan">
              NO TRANSMISSIONS FOUND
            </h3>
            <p className="text-sm font-mono text-muted-foreground">
              SEARCH FOR &quot;<span className="text-neon-cyan font-bold">{query}</span>&quot; RETURNED ZERO RESULTS
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
