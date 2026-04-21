"use client";

import { Info, SlidersHorizontal, Sparkles, Zap } from "lucide-react";

export type ConfigValue = {
  voices: string[];
  platform: "linkedin" | "instagram";
  variantCount: number;
  frameworks: string[];
  surpriseMe: boolean;
  intensity: 1 | 2 | 3;
};

const INTENSITY_HINTS: Record<1 | 2 | 3, string> = {
  1: "Close to original",
  2: "Balanced",
  3: "Strongly reshaped",
};

interface ConfigPanelProps {
  voices: { key: string; name: string }[];
  frameworks: { key: string; name: string }[];
  value: ConfigValue;
  onChange: (v: ConfigValue) => void;
  onGenerate: () => void;
  loading: boolean;
}

const PLATFORMS = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "instagram", label: "Instagram" },
] as const;

const NONE_VOICE_KEY = "__none__";

type FrameworkInfo = { summary: string; bestFor: string[] };

const FRAMEWORK_INFO: Record<string, FrameworkInfo> = {
  storybrand: {
    summary:
      "Donald Miller's BrandScript — the customer is the hero, your brand is the guide.",
    bestFor: [
      "Product-focused posts that need a clear call to action",
      "Landing page copy or solution explainers",
      "Customer-centric feature announcements",
    ],
  },
  positioning: {
    summary:
      "April Dunford's five components — makes what it is, who it's for, and what it beats obvious in one read.",
    bestFor: [
      "Category-defining launch posts",
      "Positioning pages and sales-enablement copy",
      "Posts where you're fighting a confusing comparison",
    ],
  },
  "strategic-narrative": {
    summary:
      "Andy Raskin's pitch shape — name a big change in the world, then show the product as the way to win it.",
    bestFor: [
      "Big-vision or manifesto posts",
      "Pitch decks and keynote-style narratives",
      "Category creation / 'why now' launch posts",
    ],
  },
  "save-the-cat": {
    summary:
      "Blake Snyder's story beats compressed for copy — ordinary world, disruption, commitment, payoff.",
    bestFor: [
      "Customer case studies and 'how we built X' posts",
      "Founder stories with a clear turning point",
      "Narrative-driven product walkthroughs",
    ],
  },
  "housel-analogy": {
    summary:
      "Morgan Housel's essay shape — anchor the topic in an analogy from a completely different domain.",
    bestFor: [
      "Thought-leadership essays and analytical takes",
      "Founder reflections on your category",
      "Newsletter or blog pieces that need an 'oh, that's how' moment",
    ],
  },
  munger: {
    summary:
      "Charlie Munger's two pillars — one central idea, engineered with 2–4 psychological tendencies.",
    bestFor: [
      "Sharp LinkedIn posts and hot takes",
      "Contrarian opinion pieces",
      "Short posts where the idea has to land fast on a tired reader",
    ],
  },
  "made-to-stick": {
    summary:
      "Heath brothers' SUCCESs principles — make the idea simple, unexpected, concrete, credible, emotional, story-driven.",
    bestFor: [
      "Announcements that need to be remembered and repeated",
      "Internal comms and rollout messaging",
      "Educational posts that explain a concept",
    ],
  },
  "seven-plots": {
    summary:
      "Christopher Booker's seven narrative arcs — pick the plot shape that fits the material.",
    bestFor: [
      "Customer stories and founder journeys",
      "Longer-form narrative content",
      "Posts where a dramatic arc will outperform an argument",
    ],
  },
};

export function ConfigPanel({
  voices,
  frameworks,
  value,
  onChange,
  onGenerate,
  loading,
}: ConfigPanelProps) {
  const canGenerate =
    value.voices.length > 0 && (value.surpriseMe || value.frameworks.length > 0);

  function toggleFramework(key: string) {
    const next = value.frameworks.includes(key)
      ? value.frameworks.filter(k => k !== key)
      : [...value.frameworks, key];
    onChange({ ...value, frameworks: next });
  }

  function toggleVoice(key: string) {
    const isNone = key === NONE_VOICE_KEY;
    const hasNone = value.voices.includes(NONE_VOICE_KEY);
    const alreadyChecked = value.voices.includes(key);

    let next: string[];
    if (isNone) {
      // Clicking None: either select only None, or uncheck it.
      next = alreadyChecked ? [] : [NONE_VOICE_KEY];
    } else if (hasNone) {
      // Clicking a real voice while None is active: replace None with that voice.
      next = [key];
    } else {
      next = alreadyChecked ? value.voices.filter(k => k !== key) : [...value.voices, key];
    }
    onChange({ ...value, voices: next });
  }

  return (
    <div className="rounded-[14px] border border-line bg-card px-[22px] pt-[22px] pb-5 shadow-card">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2 text-ink-3">
        <SlidersHorizontal className="h-[15px] w-[15px]" strokeWidth={1.75} />
        <h2 className="cs-eyebrow m-0">Configure</h2>
      </div>

      {/* Voices */}
      <Section label="Voice" hint="Multi-select">
        <div className="space-y-0.5">
          <CheckRow
            key={NONE_VOICE_KEY}
            id={`voice-${NONE_VOICE_KEY}`}
            label="None"
            hint="skip voice layer"
            checked={value.voices.includes(NONE_VOICE_KEY)}
            onToggle={() => toggleVoice(NONE_VOICE_KEY)}
          />
          {voices.map(v => (
            <CheckRow
              key={v.key}
              id={`voice-${v.key}`}
              label={v.name}
              checked={value.voices.includes(v.key)}
              onToggle={() => toggleVoice(v.key)}
            />
          ))}
        </div>
      </Section>

      {/* Platform */}
      <Section label="Platform">
        <div className="relative">
          <select
            value={value.platform}
            onChange={e =>
              onChange({ ...value, platform: e.target.value as ConfigValue["platform"] })
            }
            className="h-9 w-full appearance-none rounded-lg border border-line-2 bg-card px-3 pr-8 text-[14px] text-ink transition-colors hover:border-ink-2 focus:border-ink-2 focus:outline-none focus:ring-2 focus:ring-ink/5"
          >
            {PLATFORMS.map(p => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-3"
            viewBox="0 0 20 20"
            fill="none"
            strokeWidth={1.75}
            stroke="currentColor"
          >
            <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Section>

      {/* Variants */}
      <Section
        label="Variants"
        valueRight={<span className="cs-mono text-[12px] text-ink-2">{value.variantCount}</span>}
      >
        <TickSlider
          min={1}
          max={5}
          value={value.variantCount}
          onChange={v => onChange({ ...value, variantCount: v })}
        />
      </Section>

      {/* Intensity */}
      <Section
        label="Intensity"
        valueRight={
          <span className="font-serif italic text-[12px] text-ink-3">
            {INTENSITY_HINTS[value.intensity]}
          </span>
        }
      >
        <TickSlider
          min={1}
          max={3}
          value={value.intensity}
          onChange={v => onChange({ ...value, intensity: v as 1 | 2 | 3 })}
        />
      </Section>

      {/* Frameworks */}
      <Section
        label="Frameworks"
        valueRight={
          <label className="inline-flex cursor-pointer items-center gap-1.5 text-[12.5px] font-medium text-ink-2">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Surprise
            <PillToggle
              on={value.surpriseMe}
              onChange={on => onChange({ ...value, surpriseMe: on })}
            />
          </label>
        }
      >
        {!value.surpriseMe && (
          <div className="space-y-0.5">
            {frameworks.map(f => (
              <CheckRow
                key={f.key}
                id={`fw-${f.key}`}
                label={f.name}
                checked={value.frameworks.includes(f.key)}
                onToggle={() => toggleFramework(f.key)}
                info={FRAMEWORK_INFO[f.key]}
              />
            ))}
          </div>
        )}
        {value.surpriseMe && (
          <p className="font-serif italic text-[12px] text-accent">
            Random framework per variant.
          </p>
        )}
      </Section>

      {/* Generate */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={!canGenerate || loading}
        className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 text-[14px] font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-line-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⟳</span> Generating…
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            Generate
          </>
        )}
      </button>

      {value.voices.length === 0 && (
        <p className="mt-2 text-center text-[11px] text-[hsl(var(--destructive))]">
          Select at least one voice.
        </p>
      )}
      {!value.surpriseMe && value.frameworks.length === 0 && (
        <p className="mt-2 text-center text-[11px] text-[hsl(var(--destructive))]">
          Select at least one framework or enable Surprise.
        </p>
      )}
    </div>
  );
}

/* ─── subcomponents ─────────────────────────────────────────── */

function Section({
  label,
  hint,
  valueRight,
  children,
}: {
  label: string;
  hint?: string;
  valueRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-line-3 py-4 first-of-type:border-t-0 first-of-type:pt-0">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span className="text-[12.5px] font-semibold tracking-[0.01em] text-ink">
          {label}
          {hint && (
            <span className="ml-2 font-serif italic text-[12px] font-normal text-ink-4">
              {hint}
            </span>
          )}
        </span>
        {valueRight}
      </div>
      {children}
    </div>
  );
}

function CheckRow({
  id,
  label,
  hint,
  checked,
  onToggle,
  info,
}: {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onToggle: () => void;
  info?: FrameworkInfo;
}) {
  return (
    <div className="group relative grid grid-cols-[16px_1fr_auto] items-center gap-2.5 rounded-md px-1 py-1.5 hover:bg-paper-2/60">
      <label
        htmlFor={id}
        className="col-span-2 grid cursor-pointer select-none grid-cols-subgrid items-center gap-2.5"
      >
        <span
          className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
            checked ? "border-ink bg-ink text-white" : "border-line-2 bg-card text-transparent"
          }`}
        >
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6.5 5 9l4.5-5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="text-[14px] text-ink">
          {label}
          {hint && (
            <span className="ml-2 font-serif italic text-[12px] text-ink-4">{hint}</span>
          )}
        </span>
      </label>
      <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={onToggle} />
      {info && <InfoTooltip info={info} />}
    </div>
  );
}

function InfoTooltip({ info }: { info: FrameworkInfo }) {
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        tabIndex={-1}
        aria-label="About this framework"
        className="peer inline-flex h-[18px] w-[18px] items-center justify-center rounded-full text-ink-4 transition-colors hover:text-ink"
      >
        <Info className="h-[13px] w-[13px]" strokeWidth={1.75} />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute right-0 top-[24px] z-20 w-[260px] rounded-lg border border-line bg-card p-3 text-left opacity-0 shadow-card transition-opacity duration-150 peer-hover:opacity-100 peer-focus:opacity-100"
      >
        <span className="block font-serif text-[13px] italic leading-snug text-ink">
          {info.summary}
        </span>
        <span className="mt-2 block cs-eyebrow !text-[10px] text-ink-3">Best for</span>
        <ul className="mt-1 space-y-0.5 text-[12.5px] leading-snug text-ink-2">
          {info.bestFor.map((item, i) => (
            <li key={i} className="flex gap-1.5">
              <span className="cs-mono text-ink-4">·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </span>
    </span>
  );
}

function TickSlider({
  value,
  onChange,
  min = 1,
  max = 5,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  const span = Math.max(max - min, 1);
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={e => onChange(parseInt(e.target.value, 10))}
        className="cs-range h-6 w-full"
        style={{ "--fill": `${((value - min) / span) * 100}%` } as React.CSSProperties}
      />
      <div className="cs-mono mt-1.5 flex justify-between px-0.5 text-[10.5px] text-ink-4">
        {ticks.map(n => (
          <span key={n} className={n === value ? "text-ink" : ""}>
            {n}
          </span>
        ))}
      </div>
      <style jsx>{`
        .cs-range {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        .cs-range::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(
            to right,
            hsl(var(--ink)) 0,
            hsl(var(--ink)) var(--fill, 50%),
            hsl(var(--line)) var(--fill, 50%),
            hsl(var(--line)) 100%
          );
        }
        .cs-range::-moz-range-track {
          height: 6px;
          border-radius: 999px;
          background: hsl(var(--line));
        }
        .cs-range::-moz-range-progress {
          height: 6px;
          border-radius: 999px;
          background: hsl(var(--ink));
        }
        .cs-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid hsl(var(--ink));
          margin-top: -5px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
        }
        .cs-range::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid hsl(var(--ink));
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
}

function PillToggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative inline-block h-[18px] w-[30px] rounded-full transition-colors ${
        on ? "bg-accent" : "bg-line-2"
      }`}
    >
      <span
        className="absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white transition-transform"
        style={{ left: 2, transform: on ? "translateX(12px)" : "none" }}
      />
    </button>
  );
}
