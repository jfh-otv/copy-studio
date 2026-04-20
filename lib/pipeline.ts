import { loadVoice, loadFrameworks } from "./config";
import { applyVoiceAndFramework, NONE_VOICE_KEY } from "./prompts/apply";
import { pickSurpriseFramework } from "./prompts/surprise-me";
import type { Platform } from "./prompts/platform-constraints";
import type { Intensity } from "./prompts/principles";

export type EnhanceRequest = {
  draft?: string;
  points?: string[];
  perPoint?: boolean;
  voices: string[];
  platform: Platform;
  frameworks: string[];
  surpriseMe: boolean;
  variantCount: number;
  intensity?: Intensity;
};

export type Variant = {
  id: string;
  text: string;
  appliedVoice: string;
  appliedVoiceKey: string;
  appliedFramework: string;
  appliedFrameworkKey: string;
  anchorPoint?: string;
};

const MAX_PER_POINT_VARIANTS = 3;

export async function enhance(req: EnhanceRequest): Promise<{ variants: Variant[] }> {
  if (!req.voices.length) throw new Error("At least one voice is required");
  const uniqueVoiceKeys = Array.from(new Set(req.voices));
  const loadableVoiceKeys = uniqueVoiceKeys.filter(k => k !== NONE_VOICE_KEY);
  const voiceCards = await Promise.all(loadableVoiceKeys.map(loadVoice));
  const voiceByKey = new Map(loadableVoiceKeys.map((k, i) => [k, voiceCards[i]]));

  const allFrameworks = await loadFrameworks();
  const allKeys = allFrameworks.map(f => f.key);

  const perPoint = req.perPoint === true && (req.points?.length ?? 0) > 0;
  const topPoints = perPoint
    ? (req.points ?? []).slice(0, MAX_PER_POINT_VARIANTS)
    : null;

  const defaultInputBody = req.points?.length
    ? req.points.map((p, i) => `${i + 1}. ${p}`).join("\n")
    : (req.draft ?? "");

  const variantTotal = perPoint ? topPoints!.length : req.variantCount;

  const plan: Array<{
    voiceKey: string;
    primary: string;
    secondary?: string;
    plotHint?: string;
    inputBody: string;
    anchor?: string;
  }> = [];
  for (let i = 0; i < variantTotal; i++) {
    const voiceKey = req.voices[i % req.voices.length];
    let framework: { primary: string; secondary?: string; plotHint?: string };
    if (req.surpriseMe) {
      framework = pickSurpriseFramework(allKeys);
    } else {
      const key = req.frameworks[i % req.frameworks.length];
      framework = {
        primary: key,
        plotHint: key === "seven-plots" ? randomPlot() : undefined,
      };
    }

    if (perPoint) {
      const anchor = topPoints![i];
      const supporting = (req.points ?? []).filter((_, j) => j !== i);
      plan.push({
        voiceKey,
        ...framework,
        anchor,
        inputBody: `# CORE POINT (anchor the piece here)\n${anchor}\n\n# SUPPORTING POINTS (use as background, do NOT equal-weight)\n${supporting.map((p, k) => `${k + 1}. ${p}`).join("\n")}`,
      });
    } else {
      plan.push({ voiceKey, ...framework, inputBody: defaultInputBody });
    }
  }

  const results = await Promise.allSettled(
    plan.map(async (p, idx) => {
      const isNoneVoice = p.voiceKey === NONE_VOICE_KEY;
      const voice = isNoneVoice ? undefined : voiceByKey.get(p.voiceKey);
      if (!isNoneVoice && !voice) throw new Error(`Voice not found: ${p.voiceKey}`);
      const primaryFramework = allFrameworks.find(f => f.key === p.primary);
      if (!primaryFramework) throw new Error(`Framework not found: ${p.primary}`);
      const secondaryFramework = p.secondary
        ? allFrameworks.find(f => f.key === p.secondary)
        : undefined;

      const text = await applyVoiceAndFramework({
        voice,
        framework: primaryFramework,
        extraFramework: secondaryFramework,
        platform: req.platform,
        inputBody: p.inputBody,
        plotHint: p.plotHint,
        intensity: req.intensity,
      });

      const frameworkLabel = p.plotHint
        ? `${primaryFramework.name}: ${p.plotHint}`
        : primaryFramework.name;
      const combined = secondaryFramework
        ? `${frameworkLabel} + ${secondaryFramework.name}`
        : frameworkLabel;

      return {
        id: `v${idx}-${Date.now()}`,
        text,
        appliedVoice: voice ? voice.name : "No voice",
        appliedVoiceKey: p.voiceKey,
        appliedFramework: combined,
        appliedFrameworkKey: p.primary,
        anchorPoint: p.anchor,
      } as Variant;
    })
  );

  results
    .filter(r => r.status === "rejected")
    .forEach(r => console.error("Variant generation failed:", (r as PromiseRejectedResult).reason));

  const variants = results
    .filter((r): r is PromiseFulfilledResult<Variant> => r.status === "fulfilled")
    .map(r => r.value);

  return { variants };
}

function randomPlot() {
  const plots = [
    "Overcoming the Monster",
    "Rags to Riches",
    "The Quest",
    "Voyage and Return",
    "Comedy",
    "Rebirth",
  ];
  return plots[Math.floor(Math.random() * plots.length)];
}
