"use client";

import { useEffect } from 'react';
import hljs from 'highlight.js';

interface HighlightCodeProps {
  contentHtml: string;
}

export default function HighlightCode({ contentHtml }: HighlightCodeProps) {
  useEffect(() => {
    hljs.highlightAll();
  }, [contentHtml]);

  return (
    <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
  );
}
