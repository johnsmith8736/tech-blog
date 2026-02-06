"use client";

import { useEffect } from "react";

const buttonClass = "code-copy-button";

export default function CodeCopyEnhancer() {
  useEffect(() => {
    const preBlocks = Array.from(document.querySelectorAll("pre"));

    preBlocks.forEach((pre) => {
      if (pre.querySelector(`.${buttonClass}`)) {
        return;
      }

      const code = pre.querySelector("code");
      if (!code) {
        return;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = buttonClass;
      button.setAttribute("data-code-copy", "true");
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy code to clipboard");
      pre.appendChild(button);
    });

    const handleClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest?.(`.${buttonClass}`) as HTMLButtonElement | null;
      if (!button) {
        return;
      }

      const pre = button.closest("pre");
      const code = pre?.querySelector("code");
      if (!code) {
        return;
      }

      const text = code.textContent || "";
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = "Copied!";
        button.setAttribute("data-copied", "true");
        window.setTimeout(() => {
          button.textContent = "Copy";
          button.removeAttribute("data-copied");
        }, 2000);
      } catch (error) {
        console.error("Failed to copy code:", error);
        button.textContent = "Failed";
        window.setTimeout(() => {
          button.textContent = "Copy";
        }, 2000);
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
