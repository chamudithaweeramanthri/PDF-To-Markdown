# PDF → Markdown Converter

A **fully functional** web app that converts uploaded PDFs into clean, token-efficient
Markdown — entirely in the browser. Built to relieve LLM context-window pressure when
feeding documents into chat.

Styled with the **Nocturne** design system (dark ground, blurple accent, Inter, outlined
buttons); tokens are baked into `tailwind.config.ts`.

## What actually works

- **Real PDF parsing** — `pdfjs-dist` extracts text page by page (bundled worker, no CDN).
- **Real conversion** — a heuristic engine clusters text into lines, infers headings from
  font size, detects lists, and strips running headers / footers / page numbers.
- **Real token counts** — `gpt-tokenizer` (GPT BPE) counts before/after tokens client-side.
- **Live preview** — `react-markdown` + `remark-gfm` renders the output; Raw tab shows source.
- **Copy** to clipboard and **Download .md**.
- Nothing is uploaded anywhere — all processing is local.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS 3
- pdfjs-dist, gpt-tokenizer, react-markdown, remark-gfm

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

## Structure

```
src/
  App.tsx                    # status machine: idle -> working -> done / error
  index.css                  # Tailwind layers + Nocturne base + .md prose styles
  hooks/useConversion.ts     # runs conversion, holds progress + result + errors
  lib/
    pdfToMarkdown.ts         # pdf.js extraction + heuristic Markdown engine
    tokenizer.ts             # gpt-tokenizer token counting
    format.ts                # byte formatting
  components/
    Header.tsx               # nav + New conversion
    UploadView.tsx           # hero + drag-drop dropzone + error banner
    Converting.tsx           # progress state
    ResultView.tsx           # file meta + token hero + output panel
    TokenHero.tsx            # before / after / reduction, from real counts
    OutputPanel.tsx          # Preview/Raw toggle, copy + download
    icons.tsx                # inline SVG icons
```

## Tuning the conversion

The engine in `lib/pdfToMarkdown.ts` is heuristic and self-contained. Knobs you may want
to adjust for your documents:

- Heading size ratios (`1.7 / 1.35 / 1.15` × body size -> `h1 / h2 / h3`).
- The repeated-line threshold for header/footer removal (`numPages * 0.4`).
- Paragraph break rule (currently sentence-ending punctuation + page boundaries).

For scanned/image-only PDFs you would add an OCR pass (e.g. Tesseract.js) before the
line-clustering step — pdf.js only reads embedded text.

## Notes

- `gpt-tokenizer` ships GPT (cl100k/o200k) encodings. Swap the import if you target a
  different model family.
- Token "reduction" is genuine: it compares raw extracted text against the cleaned
  Markdown, so the savings come from dropping page furniture and collapsing whitespace.
