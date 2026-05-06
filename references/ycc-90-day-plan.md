# 90-Day Plan — schema & Yeast Coast Culture example

Use this file as the **format reference** for `inputs/90-day-plan.md`. The workshop demo business (Yeast Coast Culture) example below matches what ships in `portal/inputs/90-day-plan.md` for the live portal.

After editing the markdown, run:

```bash
node skills/sync-plan.js
```

(from the `portal/` demo folder **or** the `template/` starter folder — the script detects `data/ycc-data.js` vs `portal/data/portal-data.js` automatically.)

---

## Required markdown shape

| Section | Purpose |
|--------|---------|
| `# 90-Day Plan` | Title |
| `**Business:**` | Legal / trading name |
| `**Period:**` | Human-readable range (e.g. May 2026 – July 2026) |
| `**Updated:**` | ISO date `YYYY-MM-DD` |
| `## North Star` | One measurable outcome (markdown bold allowed) |
| `## Month N — Label` | Three blocks, `N` = 1..3 |
| `**Goal:**` | Under each month |
| `- [ ]` / `- [x]` | Milestones; optional `(owner: Name · due: YYYY-MM-DD)` |
| `## Bets` | Numbered list `1.` … |
| `## Risks` | Bullet list `-` … |

---

## Yeast Coast Culture — filled example

```markdown
# 90-Day Plan
**Business:** Yeast Coast Culture
**Period:** May 2026 – July 2026
**Updated:** 2026-05-01

## North Star
Hit **$55k MTD wholesale revenue** by end of July while keeping flagship dehydrated sourdough starter ≥40% of case mix.

## Month 1 — May
**Goal:** Lock distributor velocity + shore up seasonal ramp supply.
- [ ] Close case-pricing sheet with Atlantic Specialty for Q3 pouches (owner: Founder · due: 2026-05-15)
- [x] Ship Spring Ramp Ferment pilot to 3 active accounts (owner: Ops · due: 2026-05-08)
- [ ] Publish shelf-stable spec PDF for Shore Rise starter (owner: Ops · due: 2026-05-22)

## Month 2 — June
**Goal:** Expand Mid-Atlantic footprint without cold-chain breakage.
- [ ] Metro Foods Wholesale — first PO + delivery window (owner: Sales · due: 2026-06-12)
- [ ] Hudson Valley Bakehouse tasting → assortment decision (owner: Sales · due: 2026-06-20)
- [ ] Second dehydration run scheduled post–Memorial Day demand signal (owner: Ops · due: 2026-06-05)

## Month 3 — July
**Goal:** Repeatable seasonal pipeline + national pouch rhythm.
- [ ] Harbor Light pilot SKUs locked for NY specialty set (owner: Sales · due: 2026-07-10)
- [ ] Autumn Apple Chutney recipe lock + label draft (owner: Product · due: 2026-07-25)
- [ ] Wholesale newsletter: batch notes + facing checklist (owner: Brand · due: 2026-07-18)

## Bets
1. **Pouch-led bundle kits** — If grocers merch starter + kimchi together, basket size lifts without extra demos.
2. **Distributor-first NYC** — If Metro Foods moves first, we reduce founder-driven drives and protect margin.

## Risks
- **Cold-chain gaps** on jar SKUs — mitigate with consolidated weekly Philly/NYC drops until distributor steady-state.
- **Ingredient spike (cabbage/gochugaru)** — mitigate with alternate supplier quote locked by May 30.
```

Copy the block above into `inputs/90-day-plan.md` if you want the full demo narrative locally without cloning the YCC portal folder.
