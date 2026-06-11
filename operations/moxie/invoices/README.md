# Moxie invoice PDFs

Drop invoice PDFs here (from Moxie → invoice → Download PDF). Files are **gitignored** — they contain client billing data.

## Naming

Use the invoice number as the filename:

- `HF-2025-6.pdf`
- `HU-2025-1.pdf`
- `PC-2025-1.pdf`

## Phase 1 (recommended)

HelloFresh hourly series: all `HF-*.pdf` and `HU-*.pdf` files.

## Phase 2 (optional)

Fixed-fee client invoices (`PC-`, `TR-`, `TWM-`, `CE-`) — low dashboard impact but useful for a complete registry.

## Custom location

Point to a folder outside the repo:

```bash
MOXIE_INVOICES_DIR="/path/to/your/invoices" npm run sync:all
```

## Sync

From repo root:

```bash
npm run sync:all
```

Parses PDFs → `operations/moxie/invoice-detail.json` → merges into dashboard and pipeline inputs.
