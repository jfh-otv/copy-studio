import { anthropic, MODEL, withRetry } from "@/lib/anthropic";
import { PLATFORM_CONSTRAINTS } from "./platform-constraints";
import {
  DIRECT_RESPONSE_PRINCIPLES,
  INTENSITY_INSTRUCTIONS,
  INTENSITY_TEMPERATURE,
  type Intensity,
} from "./principles";
import type { ContentCard } from "@/lib/config";
import type { Platform } from "./platform-constraints";

export const NONE_VOICE_KEY = "__none__";

export type ApplyInput = {
  voice?: ContentCard;
  framework: ContentCard;
  extraFramework?: ContentCard;
  platform: Platform;
  inputBody: string;
  plotHint?: string;
  intensity?: Intensity;
};

const SYSTEM = `You rewrite draft content into polished, ready-to-publish copy.

You MUST apply, in this order of precedence:
1. The VOICE CARD — governs tone, vocabulary, syntax, structural rules. Non-negotiable. (May be omitted; if there is no Voice Card in this conversation, the framework governs tone choices too.)
2. The FRAMEWORK — governs the narrative/persuasive structure.
3. The COPY-QUALITÄT PRINCIPLES — minimal hygiene layer (specificity, no fabricated facts, anti-AI phrases). Section 5 (Anti-KI-Phrasen) and Section 4 (nichts erfinden) are binding regardless of voice or framework. Everything else in this block yields to voice and framework.
4. The PLATFORM CONSTRAINTS — governs length and format.

Output ONLY the rewritten copy. No preamble. No "Here's your post:". No explanation. No markdown code fences. Just the copy itself, ready to paste.`;

export async function applyVoiceAndFramework(input: ApplyInput): Promise<string> {
  let frameworkText = `# FRAMEWORK\n\n${input.framework.content}`;
  if (input.extraFramework) {
    frameworkText += `\n\n---\n\n# SECOND FRAMEWORK (apply both simultaneously — find the synthesis)\n\n${input.extraFramework.content}`;
  }
  if (input.plotHint) {
    frameworkText += `\n\n---\n**For this variant, use specifically the "${input.plotHint}" plot from the framework.**`;
  }

  const intensity: Intensity = input.intensity ?? 2;

  const voiceBlockText = input.voice
    ? `# VOICE CARD\n\n${input.voice.content}`
    : `# VOICE CARD\n\n(none — no voice selected for this variant. The framework governs structure; for tone, default to clear, unadorned prose in the language of the input. Do not invent a named persona, do not imitate any specific author, and do not over-style. Let the framework's shape carry the piece.)`;

  const response = await withRetry(() =>
    anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      temperature: INTENSITY_TEMPERATURE[intensity],
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: voiceBlockText,
              cache_control: { type: "ephemeral" },
            },
            {
              type: "text",
              text: frameworkText,
              cache_control: { type: "ephemeral" },
            },
            {
              type: "text",
              text: DIRECT_RESPONSE_PRINCIPLES,
              cache_control: { type: "ephemeral" },
            },
            {
              type: "text",
              text: INTENSITY_INSTRUCTIONS[intensity],
            },
            {
              type: "text",
              text: `# PLATFORM CONSTRAINTS\n\n${PLATFORM_CONSTRAINTS[input.platform]}`,
            },
            {
              type: "text",
              text: `# INPUT TO REWRITE\n\n${input.inputBody}\n\n---\n\nWrite ONE version applying the voice card + framework + platform constraints. Output only the rewritten copy.`,
            },
          ],
        },
      ],
    })
  );

  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");
  return block.text.trim();
}
