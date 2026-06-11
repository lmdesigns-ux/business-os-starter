# Design Grove — Moxie implementation kit

Step-by-step artifacts to apply the **Better Moxie structure** plan in [withmoxie.com](https://www.withmoxie.com). Work through these files in order in the Moxie UI, then refresh the Business OS portal from exports (no live API in this repo).

**Baseline export:** `Workspace-Export.xlsx` (2026-06-04) — summarized in [`export-baseline.json`](export-baseline.json).

## Implementation order

| Step | File | Est. time | Todo |
|------|------|-----------|------|
| 1 | [`01-client-merge-hellofresh.md`](01-client-merge-hellofresh.md) | 30 min | `merge-hellofresh` |
| 2 | [`products-and-services.csv`](products-and-services.csv) + [`products-and-services.md`](products-and-services.md) | 1 hr | `product-library` |
| 3 | [`02-hellofresh-retainer-projects.md`](02-hellofresh-retainer-projects.md) | 45 min | `hf-retainer` |
| 4 | [`project-templates/`](project-templates/) | 1 hr | `project-templates` |
| 5 | [`03-pipeline-and-biz-dev.md`](03-pipeline-and-biz-dev.md) | 20 min | `pipeline-cleanup` |
| 6 | [`04-invoice-project-linkage.md`](04-invoice-project-linkage.md) | 30 min + ongoing | `invoice-linkage` |
| 7 | [`exports/README.md`](exports/README.md) + [`invoices/README.md`](invoices/README.md) + portal sync | 5 min | `portal-sync` |

## Portal sync (step 7)

After Moxie cleanup, export your workspace and update the dashboard:

1. Export **Workspace-Export.xlsx** from Moxie (Data import/export).
2. Save it to [`exports/`](exports/) (gitignored).
3. Drop HelloFresh invoice PDFs in [`invoices/`](invoices/) named like `HF-2025-6.pdf` (gitignored). See [`invoices/README.md`](invoices/README.md).
4. From repo root:

```bash
npm install
npm run sync:all
```

(`sync:all` = parse invoice PDFs → Moxie export → portal compile.)

5. Reload [`portal/index.html`](../../portal/index.html) and [`portal/pipeline.html`](../../portal/pipeline.html).

`parse-invoice-pdfs.js` writes `invoice-detail.json` (gitignored). `sync-moxie-export.js` merges PDF line items into [`inputs/dashboard.md`](../../inputs/dashboard.md) and [`inputs/pipeline.md`](../../inputs/pipeline.md). `sync-portal-data.js` compiles them plus [`inputs/90-day-plan.md`](../../inputs/90-day-plan.md) into [`portal/data/portal-data.js`](../../portal/data/portal-data.js).

## Target end state

- **One** HelloFresh client record; invoice prefix **`HF-`** only
- **Products & services** library matches Design Grove nonprofit offers + legacy delivery SKUs
- HelloFresh: **one active retainer project per quarter** (or single 2026 retainer), not four perpetual buckets
- **Three project templates** in Moxie: Service mapping, Landing page, HelloFresh quarterly retainer
- **Opportunities** = qualified deals only; **Design Grove — Biz Dev 2026** project for 90-day outreach
- **Every new invoice** linked to a project with correct fee type

## Lead sources (standard list)

Use only these in Moxie client/opportunity fields:

`Referral` · `LinkedIn` · `Warm intro` · `Outbound` · `Partner` · `Event`

## Related repo inputs

- [inputs/business-model-canvas.md](../../inputs/business-model-canvas.md) — revenue streams → product SKUs
- [inputs/90-day-plan.md](../../inputs/90-day-plan.md) — biz-dev tasks and prospects
