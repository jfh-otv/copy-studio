"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface TalkingPointsPanelProps {
  points: string[];
  topN?: number;
}

export function TalkingPointsPanel({ points, topN }: TalkingPointsPanelProps) {
  const [open, setOpen] = useState(true);
  const effectiveTopN = topN && topN > 0 ? Math.min(topN, points.length) : 0;

  return (
    <section className="overflow-hidden rounded-[10px] border border-line bg-paper-2/60">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left"
      >
        <div className="flex items-baseline gap-3">
          <h3 className="font-serif italic text-[20px] font-medium leading-none tracking-[-0.012em] text-ink">
            Extracted talking points
          </h3>
          <span className="cs-mono text-[11px] text-ink-4">
            {effectiveTopN
              ? `${points.length} found · top ${effectiveTopN} become variants`
              : `${points.length} found`}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-ink-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ol className="m-0 divide-y divide-dashed divide-line px-5 pb-4 pt-0 list-none">
          {points.map((p, i) => (
            <li
              key={i}
              className="grid grid-cols-[28px_1fr] gap-3 py-2.5 text-[14.5px] leading-[1.5] text-ink-2"
            >
              <span
                className={`cs-mono text-[11px] leading-[1.4] pt-0.5 ${
                  i < effectiveTopN ? "text-accent" : "text-ink-4"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                {i < effectiveTopN && (
                  <span className="mr-2 rounded-full border border-accent-soft bg-accent-tint px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent align-middle">
                    Top {i + 1}
                  </span>
                )}
                {p}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
