"use client";

import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';

interface HighlightCodeProps {
  contentHtml: string;
}

export default function HighlightCode({ contentHtml }: HighlightCodeProps) {
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [contentHtml]);

  return (
    <div ref={codeRef} dangerouslySetInnerHTML={{ __html: contentHtml }} />
  );
}
