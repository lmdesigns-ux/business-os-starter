# Step 1 — Merge HelloFresh client records

**Goal:** One billing client for Grocery Delivery E-Services USA Inc. / HelloFresh US. Single invoice series **`HF-`**.

## Before you start

| Record | Invoices (from export) | Contact |
|--------|------------------------|---------|
| HelloFresh US | HU-2025-1 ($1,260), HU-2025-2 ($1,665) | James Villacci |
| Grocery Delivery E-Services USA Inc. | HF-2025-4 through HF-2026-13 | James Villacci |

Both point to the same organization. Keeping two clients splits revenue reporting and project history.

## Decisions (locked for Design Grove)

| Setting | Value |
|---------|--------|
| **Legal / billing name** | Grocery Delivery E-Services USA Inc. |
| **Display name** (if Moxie supports it) | HelloFresh US |
| **Website** | https://www.hellofresh.com |
| **Address** | 28 Liberty St., Floor 10, New York City, NY 10005 |
| **Invoice prefix** | `HF-` (retire `HU-` for new invoices) |
| **Primary contact** | James Villacci — James.Villacci@hellofresh.com |

## Checklist in Moxie

- [ ] Open **Clients** → choose **Grocery Delivery E-Services USA Inc.** as the **keeper** record (has HF-* invoices and active projects).
- [ ] Confirm contact **James Villacci** is on the keeper client.
- [ ] On **HelloFresh US** client: note any unique fields (none required beyond merge).
- [ ] **Merge or reassign** (per Moxie support/docs if no merge button):
  - [ ] Reassign all **projects** from duplicate → keeper: Competitor Tracker, DIY Program, Deep Dives, UX Research Ad Hoc
  - [ ] Reassign all **time entries** (227+ hours on keeper after merge)
  - [ ] Reassign **invoices** HU-2025-1 and HU-2025-2 to keeper client (historical PDFs stay valid)
  - [ ] Reassign **expenses** tagged to HelloFresh US if any
- [ ] **Archive or delete** the empty **HelloFresh US** client record once nothing points to it.
- [ ] In **Settings → Invoicing** (or client defaults): set next invoice number to continue **HF-** sequence (not HU-).
- [ ] Add internal note on client: `Merged HelloFresh US + GDES USA 2026-06. Use HF- prefix only.`

## DesignGrove client record

- [ ] **DesignGrove** should not be used for client billing. Options:
  - Archive the DesignGrove **client**, or
  - Keep only for internal testing; never invoice.
- [ ] Use project **Design Grove — Biz Dev 2026** (see [`03-pipeline-and-biz-dev.md`](03-pipeline-and-biz-dev.md)) instead.

## Volunqueer

- [ ] Client already **Archived** in export — leave archived.
- [ ] Mark projects **Front-End Development**, **UX & Service Design**, **UX Research** as **Complete** (see [`02-hellofresh-retainer-projects.md`](02-hellofresh-retainer-projects.md) archive list).

## Verification

After merge, run a new **Workspace export** and confirm:

- One client row for HelloFresh / Grocery Delivery
- All HF and HU invoices under that client
- No orphaned projects on a deleted client

**Next:** [`products-and-services.md`](products-and-services.md) → Accounting → Products & services.
