"use client";

import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentDropzoneProps {
  onExtracted: (text: string, filename: string) => void;
  onCleared: () => void;
  filename: string | null;
  draftHasContent: boolean;
  disabled?: boolean;
}

export function DocumentDropzone({
  onExtracted,
  onCleared,
  filename,
  draftHasContent,
  disabled,
}: DocumentDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse-document", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }
      onExtracted(data.text as string, data.filename as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    if (disabled || uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  function handleClick() {
    if (disabled || uploading) return;
    inputRef.current?.click();
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onCleared();
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      onDragOver={e => {
        e.preventDefault();
        if (!disabled && !uploading) setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={cn(
        "group rounded-[10px] border border-dashed p-6 text-center text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-ink/20",
        dragActive
          ? "border-ink-2 bg-accent-tint/40 cursor-copy"
          : "border-line-2 bg-paper-2/50 hover:bg-paper-2 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
        disabled={disabled || uploading}
      />

      {uploading ? (
        <p className="font-serif italic text-ink-3 animate-pulse">Extracting text…</p>
      ) : filename ? (
        <div className="flex items-center justify-center gap-2">
          <FileText className="h-4 w-4 text-ink-3 shrink-0" />
          <span className="truncate max-w-[320px] text-ink text-[14px]">{filename}</span>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-ink-3 hover:bg-paper-2 hover:text-ink"
            aria-label="Remove file"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : draftHasContent ? (
        <p className="font-serif italic text-ink-3 text-[14px]">
          Drop a PDF or DOCX here to replace the draft.
        </p>
      ) : (
        <div className="flex flex-col items-center gap-1.5 text-ink-3">
          <Upload className="h-5 w-5" strokeWidth={1.75} />
          <p className="text-[14px]">
            <span className="font-medium text-ink">Drop a PDF or DOCX here</span>, or
            click to upload
          </p>
          <p className="font-serif italic text-[12.5px] text-ink-4">
            Or paste text into the draft field above.
          </p>
        </div>
      )}

      {error && <p className="mt-2 text-[12px] text-[hsl(var(--destructive))]">{error}</p>}
    </div>
  );
}
