"use client";

import { useRef } from 'react';
import showdown from 'showdown';
import showdownHighlight from 'showdown-highlight';

interface HighlightCodeProps {
  content: string;
}

const converter = new showdown.Converter({
  extensions: [showdownHighlight],
  tables: true, // Enable tables if you use them in Markdown
  tasklists: true, // Enable task lists
});

export default function HighlightCode({ content }: HighlightCodeProps) {
  const codeRef = useRef<HTMLDivElement>(null);
  const htmlContent = converter.makeHtml(content); // Convert Markdown to HTML

  return (
    <div ref={codeRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}
