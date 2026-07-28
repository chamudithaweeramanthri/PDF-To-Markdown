import { encode } from 'gpt-tokenizer';

/**
 * Count tokens the way an LLM API would bill them, using the GPT (cl100k / o200k)
 * BPE tokenizer. Runs fully client-side. Falls back to a ~4-chars-per-token
 * estimate if encoding ever throws.
 */
export function countTokens(text: string): number {
  if (!text) return 0;
  try {
    return encode(text).length;
  } catch {
    return Math.ceil(text.length / 4);
  }
}
