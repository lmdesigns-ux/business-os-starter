# Step 5 — Invoice ↔ project linkage & fee types

**Problem (export):** All 18 invoices had **empty Project** field — no margin or utilization per engagement in Moxie.

## Fee type by client / engagement

| Client | Project pattern | Fee type | Product SKU |
|--------|-----------------|----------|-------------|
| Grocery Delivery / HelloFresh US | `HelloFresh US — Q[N] YYYY` | **Hourly** | DG-UX-HR |
| PhilanthroCulture | `[Client] — Merch strategy — YYYY` | **Fixed** | DG-MERCH-SPRINT |
| Talk With Marie | `[Client] — Landing page — YYYY` | **Fixed** | DG-LP-FIXED |
| Top Realty | `[Client] — Landing page — YYYY` | **Fixed** | DG-LP-FIXED |
| Coach Evelt | `[Client] — Website` or Book cover | **Fixed** | DG-WEB-5 / DG-BOOK-COVER |
| Nonprofit (future) | `[Client] — Service mapping — YYYY` | **Fixed** | DG-MAP-STD |

## Ongoing habit (every invoice)

- [ ] Select **Project** before sending
- [ ] Line items from **Products & services** library (not free-text)
- [ ] For HelloFresh: generate from **time tracked** on current quarter project
- [ ] For fixed engagements: line items match proposal SKUs

## Backfill — historical invoices (export mapping)

Re-open each invoice in Moxie and attach **Project** where still editable:

| Invoice | Client (export) | Suggested project |
|---------|-----------------|-------------------|
| HU-2025-1 | HelloFresh US | `HelloFresh US — Q1 2025` (create retrospective project marked Complete if needed) |
| HU-2025-2 | HelloFresh US | Same quarter project |
| HF-2025-4 … HF-2025-8 | Grocery Delivery… | `HelloFresh US — Q2/Q3/Q4 2025` by invoice date |
| HF-2026-9 … HF-2026-13 | Grocery Delivery… | `HelloFresh US — Q1 2026` / `Q2 2026` by date |
| PC-2025-1, PC-2025-2 | PhilanthroCulture | `PhilanthroCulture — Merch Strategy & Re-design` |
| TR-2025-2 | Top Realty | `Top Realty Landing Page` |
| TWM-2025-1 | Talk With Marie | `TalkWithDrMarie Landing Page` |
| CE-2025-1 | Coach Evelt | `Coach Evelt Book Cover` or New Website |

If Moxie blocks editing paid invoices, note linkage in client **Notes** for your own reporting.

## PDF backfill when Moxie Project field is empty

The workspace export often omits **project-level line items** on invoices. Use Moxie PDFs to backfill HelloFresh attribution in the Business OS portal:

1. Download each paid invoice PDF from Moxie.
2. Save to [`invoices/`](invoices/) as `{invoice-number}.pdf` (e.g. `HF-2025-6.pdf`).
3. Run `npm run sync:all` from the repo root.

The parser extracts project buckets (`DIY Program`, `UX Research Ad Hoc`, etc.), billed hours, and rates. The **Pipeline** page shows logged vs billed hours and revenue by project for the current quarter.

**Phase 1:** HelloFresh `HF-` / `HU-` series (~11 invoices). Fixed-fee PDFs are optional.

**Going forward:** Link new invoices to projects in Moxie so exports stay clean; keep dropping PDFs until historical backfill is done.

## Quarterly invoice ↔ project alignment

| Invoice period (approx) | Project name |
|-------------------------|--------------|
| Jan–Mar 2026 | HelloFresh US — Q1 2026 |
| Apr–Jun 2026 | HelloFresh US — Q2 2026 |
| Jul–Sep 2026 | HelloFresh US — Q3 2026 |

## Verification

- [ ] Create test draft invoice → confirm project appears on export
- [ ] Run **Workspace export** after one billing cycle; **Invoices** sheet should show Project populated

## Project settings checklist (all active projects)

- [ ] HelloFresh current quarter: **Hourly** + DG-UX-HR
- [ ] Talk With Marie landing page: **Fixed** + DG-LP-FIXED
- [ ] Design Grove Biz Dev: **No fee** / internal
- [ ] Completed projects: **Set complete** so they drop off active views

---

**Implementation complete** when all checkboxes in [`README.md`](README.md) steps 1–6 are done in Moxie.
