export const PLATFORM_CONSTRAINTS = {
  linkedin:
    "Target 80–200 words. Hook in the very first line — no warmup. Short paragraphs (1–2 sentences) with blank lines between. Max 1–2 emoji total, only if organic. No hashtags unless truly integral. Professional register; the reader is scrolling a work feed.",
  instagram:
    "Format: caption for an Instagram feed post, not a story or reel script. Target 70–150 words. The first line is the hook — Instagram truncates after roughly the first sentence behind a 'more' link, so the first 125 characters must make the reader tap. Use short, visually scannable paragraphs separated by a blank line. Emoji are allowed where they add rhythm or signal a section break (2–5 total is the sweet spot, never decorative clusters). End with one clear line: a question, a soft CTA (save, share, comment), or a single punchy statement. Hashtags: 3–8 at the end, separated from the caption by a blank line or a line of dots; choose hashtags that match the content's topic, not trend-chasers. No @-mentions invented. Tone is more personal and visual than LinkedIn — write as if standing next to the image, not behind a lectern.",
} as const;

export type Platform = keyof typeof PLATFORM_CONSTRAINTS;
