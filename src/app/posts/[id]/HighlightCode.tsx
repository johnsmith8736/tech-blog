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

        const preElement = block.parentElement;
        if (preElement && preElement.tagName === 'PRE') {
          const copyButton = document.createElement('button');
          copyButton.textContent = 'Copy';
          copyButton.className = 'copy-button';

          copyButton.style.position = 'absolute';
          copyButton.style.top = '0.5em';
          copyButton.style.right = '0.5em';
          copyButton.style.background = '#333';
          copyButton.style.color = '#fff';
          copyButton.style.padding = '0.3em 0.6em';
          copyButton.style.borderRadius = '4px';
          copyButton.style.border = 'none';
          copyButton.style.cursor = 'pointer';
          copyButton.style.fontSize = '0.8em';
          copyButton.style.opacity = '0';
          copyButton.style.transition = 'opacity 0.3s ease-in-out';

          preElement.style.position = 'relative';
          preElement.addEventListener('mouseenter', () => {
            copyButton.style.opacity = '1';
          });
          preElement.addEventListener('mouseleave', () => {
            copyButton.style.opacity = '0';
          });

          copyButton.onclick = () => {
            const codeToCopy = block.textContent || '';
            navigator.clipboard.writeText(codeToCopy).then(() => {
              copyButton.textContent = 'Copied!';
              setTimeout(() => {
                copyButton.textContent = 'Copy';
              }, 2000);
            }).catch(err => {
              console.error('Failed to copy text: ', err);
            });
          };

          preElement.appendChild(copyButton);
        }
      });
    }
  }, [contentHtml]);

  return (
    <div ref={codeRef} dangerouslySetInnerHTML={{ __html: contentHtml }} />
  );
}
