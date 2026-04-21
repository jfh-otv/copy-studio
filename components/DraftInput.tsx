"use client";

import { useRef, useEffect } from "react";

interface DraftInputProps {
  value: string;
  onChange: (v: string) => void;
}

export function DraftInput({ value, onChange }: DraftInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!value) {
      el.style.height = "";
      return;
    }
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 200)}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Paste your draft, slide text, or raw notes here…"
      className="cs-textarea w-full resize-none overflow-hidden rounded-[10px] border border-line bg-card px-6 py-[22px] font-serif text-[19px] leading-[1.6] text-ink outline-none transition-colors placeholder:italic placeholder:text-ink-4 focus:border-ink-2"
      style={{ minHeight: 200 }}
    />
  );
}
