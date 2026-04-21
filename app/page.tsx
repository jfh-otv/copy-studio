"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DraftInput } from "@/components/DraftInput";
import { DocumentDropzone } from "@/components/DocumentUpload";
import { ConfigPanel, type ConfigValue } from "@/components/ConfigPanel";
import { VariantCard } from "@/components/VariantCard";
import { TalkingPointsPanel } from "@/components/TalkingPointsPanel";
import { VariantSkeleton } from "@/components/VariantSkeleton";
import type { Variant } from "@/lib/pipeline";

type RemoteConfig = {
  voices: { key: string; name: string }[];
  frameworks: { key: string; name: string }[];
  defaultVoice: string;
  defaultPlatform: ConfigValue["platform"];
};

const EXTRACT_THRESHOLD = 2000;
const TOP_POINTS = 3;

const PLATFORM_LABELS: Record<ConfigValue["platform"], string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
};
function platformLabelFor(p: ConfigValue["platform"]) {
  return PLATFORM_LABELS[p] ?? p;
}

export default function Page() {
  const [remoteConfig, setRemoteConfig] = useState<RemoteConfig | null>(null);
  const [draft, setDraft] = useState("");
  const [extractedPoints, setExtractedPoints] = useState<string[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const [config, setConfig] = useState<ConfigValue>({
    voices: [],
    platform: "linkedin",
    variantCount: 3,
    frameworks: [],
    surpriseMe: false,
    intensity: 2,
  });
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);
  const [regeneratingIds, setRegeneratingIds] = useState<Set<string>>(new Set());
  const extractDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/config")
      .then(r => r.json())
      .then((data: RemoteConfig) => {
        setRemoteConfig(data);
        setConfig(prev => ({
          ...prev,
          voices: [data.defaultVoice ?? data.voices[0]?.key].filter(Boolean) as string[],
          platform: data.defaultPlatform ?? "linkedin",
        }));
      })
      .catch(console.error);
  }, []);

  const extractPoints = useCallback(async (text: string) => {
    if (text.length <= EXTRACT_THRESHOLD) {
      setExtractedPoints([]);
      return;
    }
    setExtracting(true);
    try {
      const res = await fetch("/api/extract-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: text }),
      });
      const data = await res.json();
      if (data.points) setExtractedPoints(data.points as string[]);
    } catch (e) {
      console.error(e);
    } finally {
      setExtracting(false);
    }
  }, []);

  function handleDraftChange(text: string) {
    setDraft(text);
    if (uploadedFilename) setUploadedFilename(null);
    if (extractDebounce.current) clearTimeout(extractDebounce.current);
    extractDebounce.current = setTimeout(() => extractPoints(text), 800);
  }

  function handleDocumentExtracted(text: string, filename: string) {
    setDraft(text);
    setUploadedFilename(filename);
    setExtractedPoints([]);
    if (extractDebounce.current) clearTimeout(extractDebounce.current);
    extractPoints(text);
  }

  function handleDocumentCleared() {
    setDraft("");
    setUploadedFilename(null);
    setExtractedPoints([]);
  }

  const perPointMode = extractedPoints.length >= 2;
  const plannedVariantCount = perPointMode
    ? Math.min(TOP_POINTS, extractedPoints.length)
    : config.variantCount;

  async function handleGenerate() {
    setLoading(true);
    setVariants([]);
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft: extractedPoints.length === 0 ? draft : undefined,
          points: extractedPoints.length > 0 ? extractedPoints : undefined,
          perPoint: perPointMode,
          voices: config.voices,
          platform: config.platform,
          frameworks: config.frameworks,
          surpriseMe: config.surpriseMe,
          variantCount: plannedVariantCount,
          intensity: config.intensity,
        }),
      });
      const data = await res.json();
      if (data.variants) setVariants(data.variants as Variant[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerate(variant: Variant, index: number) {
    setRegeneratingIds(prev => new Set(prev).add(variant.id));
    try {
      const pointsForRegen =
        perPointMode && variant.anchorPoint
          ? [variant.anchorPoint, ...extractedPoints.filter(p => p !== variant.anchorPoint)]
          : extractedPoints;
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft: extractedPoints.length === 0 ? draft : undefined,
          points: extractedPoints.length > 0 ? pointsForRegen : undefined,
          perPoint: perPointMode,
          voices: [variant.appliedVoiceKey],
          platform: config.platform,
          frameworks: config.surpriseMe ? [] : [variant.appliedFrameworkKey],
          surpriseMe: config.surpriseMe,
          variantCount: 1,
          intensity: config.intensity,
        }),
      });
      const data = await res.json();
      if (data.variants?.[0]) {
        const newVariant = data.variants[0] as Variant;
        setVariants(prev =>
          prev.map((v, i) => (i === index ? { ...newVariant, id: v.id } : v))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRegeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(variant.id);
        return next;
      });
    }
  }

  if (!remoteConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-ink-4">
        Loading…
      </div>
    );
  }

  const charCount = draft.length;

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-[1280px] px-8 pb-32">
        {/* Topbar */}
        <header className="flex items-center justify-between border-b border-line py-5">
          <div className="flex items-baseline gap-2.5">
            <span className="cs-serif text-[30px] leading-none text-ink">
              Copy Studio
            </span>
            <span className="text-ink-4 text-base leading-none">·</span>
            <span className="text-[14px] text-ink-3 tracking-[0.01em]">
              a rewriting tool
            </span>
          </div>
        </header>

        <main className="grid grid-cols-1 gap-14 pt-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Left column */}
          <div className="min-w-0 space-y-8">
            {/* Draft */}
            <section>
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <h2 className="cs-headline">Draft</h2>
                <span className="cs-meta shrink-0">
                  {charCount.toLocaleString()} chars
                </span>
              </div>
              <DraftInput value={draft} onChange={handleDraftChange} />
              {extracting && (
                <p className="mt-2 text-xs text-ink-4 animate-pulse">
                  Extracting talking points…
                </p>
              )}
              {perPointMode && !extracting && (
                <p className="mt-2 text-xs text-ink-3">
                  Long input detected — will generate {plannedVariantCount} variant
                  {plannedVariantCount !== 1 ? "s" : ""}, one per top talking point.
                </p>
              )}
            </section>

            {/* Dropzone */}
            <DocumentDropzone
              onExtracted={handleDocumentExtracted}
              onCleared={handleDocumentCleared}
              filename={uploadedFilename}
              draftHasContent={draft.length > 0 && !uploadedFilename}
              disabled={loading}
            />

            {/* Talking points */}
            {extractedPoints.length > 0 && (
              <TalkingPointsPanel
                points={extractedPoints}
                topN={perPointMode ? plannedVariantCount : 0}
              />
            )}

            {/* Variants — editorial heading */}
            {(loading || variants.length > 0) && (
              <section>
                <div className="mb-5 flex items-baseline justify-between gap-4 border-t border-line pt-8">
                  <h2 className="cs-headline">Variants</h2>
                  <span className="cs-meta shrink-0">
                    {loading
                      ? `generating ${plannedVariantCount}…`
                      : `${variants.length} of ${variants.length} · just now`}
                  </span>
                </div>

                {loading && (
                  <div className="space-y-5">
                    {Array.from({ length: plannedVariantCount }).map((_, i) => (
                      <VariantSkeleton key={i} index={i} />
                    ))}
                  </div>
                )}

                {!loading && variants.length > 0 && (
                  <div className="space-y-5">
                    {variants.map((v, i) => (
                      <VariantCard
                        key={v.id}
                        variant={v}
                        index={i}
                        platformLabel={platformLabelFor(config.platform)}
                        onCopy={() => {}}
                        onRegenerate={() => handleRegenerate(v, i)}
                        regenerating={regeneratingIds.has(v.id)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Right column — sticky settings */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <ConfigPanel
              voices={remoteConfig.voices}
              frameworks={remoteConfig.frameworks}
              value={config}
              onChange={setConfig}
              onGenerate={handleGenerate}
              loading={loading}
            />
          </aside>
        </main>
      </div>
    </div>
  );
}
