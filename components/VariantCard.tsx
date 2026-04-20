"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import type { Variant } from "@/lib/pipeline";

interface VariantCardProps {
  variant: Variant;
  index: number;
  platformLabel: string;
  onCopy: () => void;
  onRegenerate: () => void;
  regenerating?: boolean;
}

export function VariantCard({
  variant,
  index,
  platformLabel,
  onCopy,
  onRegenerate,
  regenerating,
}: VariantCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(variant.text);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 1500);
  }

  const mono = String(index + 1).padStart(2, "0");

  return (
    <article className="cs-fade-in overflow-hidden rounded-[14px] border border-line bg-card shadow-card">
      {/* Head */}
      <header className="flex flex-wrap items-center gap-2 px-5 pt-4 pb-3">
        <span className="cs-mono text-[11px] uppercase tracking-[0.04em] text-ink-4 mr-1">
          {mono}
        </span>
        <Badge variant="accent">{variant.appliedVoice}</Badge>
        <Badge variant="default">{variant.appliedFramework}</Badge>
        <Badge variant="ghost">{platformLabel}</Badge>
      </header>

      {/* Body */}
      <div className="px-6 pb-5">
        {variant.anchorPoint && (
          <p className="mb-3 border-l-2 border-line-2 pl-3 font-serif text-[13px] italic leading-snug text-ink-3">
            Anchor point: {variant.anchorPoint}
          </p>
        )}
        <p
          className="whitespace-pre-wrap font-serif text-[17.5px] leading-[1.6] tracking-[-0.002em] text-ink"
          style={{ textWrap: "pretty" as never }}
        >
          {variant.text}
        </p>
      </div>

      {/* Footer */}
      <footer
        className="flex items-center justify-end gap-1 border-t border-line px-3 py-2"
        style={{ background: "#FCFBF7" }}
      >
        <IconButton onClick={onRegenerate} disabled={regenerating} label="Regenerate">
          <RefreshCw className={`h-[13px] w-[13px] ${regenerating ? "animate-spin" : ""}`} />
          <span>Regenerate</span>
        </IconButton>
        <IconButton
          onClick={handleCopy}
          label="Copy to clipboard"
          tone={copied ? "ok" : undefined}
        >
          {copied ? (
            <>
              <Check className="h-[13px] w-[13px]" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-[13px] w-[13px]" />
              <span>Copy</span>
            </>
          )}
        </IconButton>
      </footer>
    </article>
  );
}

/* ─── subcomponents ─────────────────────────────────────────── */

function Badge({
  variant = "default",
  children,
}: {
  variant?: "default" | "accent" | "ghost";
  children: React.ReactNode;
}) {
  const base =
    "inline-flex items-center gap-1 rounded-full border px-[9px] py-[3px] text-[11.5px] font-medium leading-[1.4]";
  const styles =
    variant === "accent"
      ? "bg-accent-tint text-accent border-accent-soft"
      : variant === "ghost"
        ? "bg-transparent text-ink-3 border-line-2 border-dashed"
        : "bg-paper-2 text-ink-2 border-line";
  return <span className={`${base} ${styles}`}>{children}</span>;
}

function IconButton({
  children,
  onClick,
  disabled,
  label,
  tone,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  label: string;
  tone?: "ok";
}) {
  const okTone = tone === "ok" ? "text-[color:hsl(var(--ok))] bg-[#EDF5EF]" : "";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`inline-flex items-center gap-1.5 rounded-[7px] border border-transparent bg-transparent px-2.5 py-1.5 text-[12.5px] font-medium text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink disabled:opacity-50 ${okTone}`}
    >
      {children}
    </button>
  );
}
