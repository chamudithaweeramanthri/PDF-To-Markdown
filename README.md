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
 
