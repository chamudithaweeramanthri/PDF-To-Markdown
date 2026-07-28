import * as pdfjsLib from 'pdfjs-dist';
// Vite-native worker import — bundles the pdf.js worker, no CDN needed.
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker';

pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker();

export interface ConversionResult {
  markdown: string;
  /** Raw extracted text with no cleanup — the "before" baseline for token counts. */
  rawText: string;
  pages: number;
}

interface Line {
  text: string;
  size: number;
  x: number;
}

type Block =
  | { type: 'h'; level: number; text: string }
  | { type: 'li'; ordered: boolean; text: string }
  | { type: 'p'; text: string };

/**
 * Extract text from a PDF and turn it into clean Markdown, entirely in the browser.
 *
 * Heuristics:
 *  - Text items are clustered into lines by baseline (y), sorted left-to-right.
 *  - The most common line height is treated as body size; larger lines become
 *    headings (#, ##, ###) by their size ratio.
 *  - Bulleted / numbered lines become Markdown lists.
 *  - Lines repeated on many pages (running headers/footers) and bare page
 *    numbers are dropped — this is where most of the token savings come from.
 *  - Consecutive body lines are merged back into paragraphs.
 */
export async function pdfToMarkdown(
  file: File,
  onProgress?: (fraction: number) => void,
): Promise<ConversionResult> {
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const numPages = pdf.numPages;

  const pageLines: Line[][] = [];
  const rawParts: string[] = [];

  for (let p = 1; p <= numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const items = content.items as Array<{
      str: string;
      transform: number[];
      height: number;
    }>;

    // Cluster items into rows by baseline.
    const rows: { y: number; parts: { x: number; str: string; h: number }[] }[] = [];
    for (const it of items) {
      if (!('str' in it)) continue;
      const tr = it.transform;
      const y = tr[5];
      const h = Math.hypot(tr[2], tr[3]) || it.height || 0;
      let row = rows.find((r) => Math.abs(r.y - y) < h * 0.5 + 1);
      if (!row) {
        row = { y, parts: [] };
        rows.push(row);
      }
      row.parts.push({ x: tr[4], str: it.str, h });
    }
    rows.sort((a, b) => b.y - a.y);

    const lines: Line[] = [];
    for (const r of rows) {
      r.parts.sort((a, b) => a.x - b.x);
      const text = r.parts.map((q) => q.str).join('').replace(/\s+/g, ' ').trim();
      if (!text) continue;
      const size = Math.max(...r.parts.map((q) => q.h));
      const x = Math.min(...r.parts.map((q) => q.x));
      lines.push({ text, size, x });
    }

    pageLines.push(lines);
    rawParts.push(lines.map((l) => l.text).join('\n'));
    onProgress?.(p / numPages);
    // Yield to the event loop so progress can paint.
    await new Promise((r) => setTimeout(r, 0));
  }

  const rawText = rawParts.join('\n\n');
  const markdown = buildMarkdown(pageLines, numPages);
  return { markdown, rawText, pages: numPages };
}

function buildMarkdown(pageLines: Line[][], numPages: number): string {
  // Body font size = most common rounded line height.
  const sizeFreq = new Map<number, number>();
  pageLines.forEach((ls) =>
    ls.forEach((l) => {
      const k = Math.round(l.size);
      sizeFreq.set(k, (sizeFreq.get(k) || 0) + 1);
    }),
  );
  let body = 12;
  let best = 0;
  sizeFreq.forEach((count, size) => {
    if (count > best) {
      best = count;
      body = size;
    }
  });

  // Detect running headers/footers: first & last line of each page.
  const edgeFreq = new Map<string, number>();
  pageLines.forEach((ls) => {
    const edges = [ls[0], ls[ls.length - 1]].filter(Boolean) as Line[];
    for (const l of edges) {
      const key = norm(l.text);
      edgeFreq.set(key, (edgeFreq.get(key) || 0) + 1);
    }
  });
  const repeated = new Set<string>();
  const threshold = Math.max(3, numPages * 0.4);
  edgeFreq.forEach((count, key) => {
    if (count >= threshold) repeated.add(key);
  });

  // Turn lines into typed blocks.
  const blocks: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) {
      blocks.push({ type: 'p', text: para.join(' ') });
      para = [];
    }
  };

  for (const ls of pageLines) {
    for (const l of ls) {
      const t = l.text;
      if (repeated.has(norm(t))) continue;
      if (/^\d{1,4}$/.test(t)) continue; // bare page number
      if (/^page\s+\d+(\s+of\s+\d+)?$/i.test(t)) continue;

      const bullet = /^[•▪◦‣·–—*]\s+/.test(t) || /^-\s+/.test(t);
      const numbered = /^\d+[.)]\s+/.test(t);
      const ratio = l.size / body;

      if (bullet) {
        flush();
        blocks.push({ type: 'li', ordered: false, text: t.replace(/^[•▪◦‣·–—*-]\s+/, '') });
      } else if (numbered) {
        flush();
        blocks.push({ type: 'li', ordered: true, text: t.replace(/^\d+[.)]\s+/, '') });
      } else if (ratio >= 1.7) {
        flush();
        blocks.push({ type: 'h', level: 1, text: t });
      } else if (ratio >= 1.35) {
        flush();
        blocks.push({ type: 'h', level: 2, text: t });
      } else if (ratio >= 1.15) {
        flush();
        blocks.push({ type: 'h', level: 3, text: t });
      } else {
        para.push(t);
        // End the paragraph when the line looks like a sentence end.
        if (/[.!?:]["')\]]?$/.test(t)) flush();
      }
    }
    flush(); // page boundary ends a paragraph
  }
  flush();

  // Render blocks to Markdown.
  const out: string[] = [];
  blocks.forEach((b, i) => {
    if (b.type === 'h') {
      out.push('#'.repeat(b.level) + ' ' + b.text);
    } else if (b.type === 'li') {
      const prev = blocks[i - 1];
      const glue = prev && prev.type === 'li' ? '' : '\uE000'; // marker for tight list start
      out.push(glue + (b.ordered ? '1. ' : '- ') + b.text);
    } else {
      out.push(b.text);
    }
  });

  let md = '';
  for (let i = 0; i < out.length; i++) {
    const cur = out[i];
    const tightStart = cur.startsWith('\uE000');
    const clean = cur.replace('\uE000', '');
    if (i === 0) {
      md += clean;
      continue;
    }
    const prev = out[i - 1];
    const bothList = /^(-|\d+\.)\s/.test(prev.replace('\uE000', '')) && /^(-|\d+\.)\s/.test(clean);
    md += (bothList && !tightStart ? '\n' : '\n\n') + clean;
  }

  return md.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function norm(s: string): string {
  return s.toLowerCase().replace(/\d+/g, '#').replace(/\s+/g, ' ').trim();
}
