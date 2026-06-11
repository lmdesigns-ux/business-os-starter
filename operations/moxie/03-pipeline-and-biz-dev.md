# Step 4 — Pipeline cleanup & biz dev project

Aligns with [inputs/90-day-plan.md](../../inputs/90-day-plan.md) (10 nonprofit prospects by August 2026).

## Opportunity hygiene rules

| Rule | Action |
|------|--------|
| Name format | `[Organization] — [Product SKU] — [phase]` |
| Stages | Use **Meeting** only before qualification; **Proposal** when SOW sent; **Closed won** only with signed agreement or deposit |
| $0 meetings | Do **not** mark Closed won; use **calendar** |
| Duplicates | Delete extra rows; keep one source of truth |

## Export → recommended changes

| Current opportunity | Action | New name (if kept) |
|---------------------|--------|-------------------|
| Carrol Franklyn / 45 minute meeting | Link **Client:** Carrol Franklyn · keep stage **Meeting** · Value $0 | `Carrol Franklyn — Discovery — TBD` |
| Leonette Henderson / 15 minute consult | **Delete** or archive (duplicate touchpoint) | — |
| Leonette Henderson / 30 minute meeting | **Keep** as historical Closed won · Value $1,200 | `PhilanthroCulture — Merch strategy sprint — 2025` |
| Leonette Henderson / 45 Minute Project Update (×3 Closed won) | **Delete 2 duplicates**; delete or merge 4th **Meeting** with wrong email | Keep **one** row if needed for history |
| Leonette Henderson / 45 Minute Project Update (no client, Meeting) | **Delete** (typo email @myphilanthropy.com) | — |
| Leonette Henderson / 45 minute meeting · Proposal $3,200 | **Rename** · stage per reality | `PhilanthroCulture — Merch strategy — Phase 2` OR pivot to `PhilanthroCulture — Service mapping — 2026` |

## Moxie checklist — opportunities

- [ ] Delete duplicate **Leonette Henderson / 45 Minute Project Update** rows (keep at most one)
- [ ] Delete orphan Meeting with wrong email domain
- [ ] Set **Carrol Franklyn** on Carrol Franklyn opportunity
- [ ] Rename open **$3,200** proposal to SKU-based name
- [ ] Move future discovery calls to calendar, not Opportunities

---

## Internal project: Design Grove — Biz Dev 2026

**Client:** None (internal) OR archived DesignGrove record — **do not invoice**.

**Project name:** `Design Grove — Biz Dev 2026`

**Fee type:** No fee / internal

**Start:** 2026-06-01 · **Due:** 2026-08-31 (matches 90-day plan)

### Tasks from 90-day plan

| Task | Owner | Due | 90-day milestone |
|------|-------|-----|------------------|
| Write one-page ICP | You | 2026-06-15 | Month 1 |
| Research 15–20 nonprofit prospects | You | 2026-06-22 | Month 1 |
| Draft outreach + discovery call offer | You | 2026-06-28 | Month 1 |
| Outreach — first 5 prospects | You | 2026-07-10 | Month 2 |
| Hold 2+ discovery calls; capture notes | You | 2026-07-25 | Month 2 |
| Publish process clarity post / mini case | You | 2026-07-31 | Month 2 |
| Outreach — reach 10 prospects total | You | 2026-08-15 | Month 3 |
| Score top 3 prospects for proposal | You | 2026-08-22 | Month 3 |
| Book 1 paid workshop or scoped engagement | You | 2026-08-31 | Month 3 |

### Per-prospect sub-tasks (add as you go)

Template sub-task under **Research 15–20 nonprofit prospects**:

- `[Org name] — status: researched | contacted | call held | proposal`

**Carrol Franklyn** — add sub-task: `Carrol Franklyn — discovery call` under outreach when ready.

---

## Automation (Moxie settings)

- [ ] **Settings → Projects:** Signed agreement **creates project** from template
- [ ] Map agreement templates:
  - Nonprofit mapping → `DG — Service mapping (standard)`
  - Landing page → `DG — Landing page (design + build)`
  - HelloFresh SOW → `DG — HelloFresh quarterly retainer`

**Next:** [`04-invoice-project-linkage.md`](04-invoice-project-linkage.md)
