interface VariantSkeletonProps {
  index?: number;
}

export function VariantSkeleton({ index = 0 }: VariantSkeletonProps) {
  const mono = String(index + 1).padStart(2, "0");
  return (
    <article className="overflow-hidden rounded-[14px] border border-line bg-card shadow-card">
      <header className="flex flex-wrap items-center gap-2 px-5 pt-4 pb-3">
        <span className="cs-mono mr-1 text-[11px] uppercase tracking-[0.04em] text-ink-4">
          {mono}
        </span>
        <span className="cs-shimmer h-[18px] w-[88px] rounded-full" />
        <span className="cs-shimmer h-[18px] w-[110px] rounded-full" />
        <span className="cs-shimmer h-[18px] w-[70px] rounded-full" />
      </header>
      <div className="flex flex-col gap-2.5 px-6 pb-5">
        <span className="cs-shimmer h-3.5 w-full rounded" />
        <span className="cs-shimmer h-3.5 w-[92%] rounded" />
        <span className="cs-shimmer h-3.5 w-[78%] rounded" />
        <span className="cs-shimmer h-3.5 w-[86%] rounded" />
      </div>
      <footer
        className="flex items-center justify-end gap-2 border-t border-line px-3 py-2"
        style={{ background: "#FCFBF7" }}
      >
        <span className="cs-shimmer h-6 w-[86px] rounded-md" />
        <span className="cs-shimmer h-6 w-[58px] rounded-md" />
      </footer>
    </article>
  );
}
