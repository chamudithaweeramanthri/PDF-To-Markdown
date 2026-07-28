import { useCallback, useState } from 'react';
import { pdfToMarkdown } from '../lib/pdfToMarkdown';
import { countTokens } from '../lib/tokenizer';

export type Status = 'idle' | 'working' | 'done' | 'error';

export interface Result {
  name: string;
  size: number;
  pages: number;
  markdown: string;
  rawText: string;
  inputTokens: number;
  outputTokens: number;
}

export function useConversion() {
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string>('');

  const convert = useCallback(async (file: File) => {
    setStatus('working');
    setProgress(0);
    setError(null);
    setResult(null);
    setPendingName(file.name);

    try {
      const { markdown, rawText, pages } = await pdfToMarkdown(file, setProgress);
      const inputTokens = countTokens(rawText);
      const outputTokens = countTokens(markdown);
      setResult({
        name: file.name,
        size: file.size,
        pages,
        markdown,
        rawText,
        inputTokens,
        outputTokens,
      });
      setStatus('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
    setProgress(0);
  }, []);

  return { status, progress, result, error, pendingName, convert, reset };
}
