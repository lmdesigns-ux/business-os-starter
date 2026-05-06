# Business OS — agent instructions

Single source of truth for onboarding in **Cursor**, **Claude Code**, **Codex CLI**, **Cline**, and similar tools that read `AGENTS.md`.

## Triggers

| User says | Run |
|-----------|-----|
| `New OS`, `Build OS`, `new-os`, “start business os”, “onboard me”, “scaffold my portal” | **new-os** workflow |
| `90-day plan`, “add my quarterly plan”, “sync milestones” | **90-day plan** workflow |

After **new-os** completes, suggest: *“Want to add milestones next? Say **`90-day plan`**.”*

---

## Workflow: `new-os`

### Rules

1. Ask **one question at a time**. Wait for an answer before the next.
2. Default sample-data mode is **`Inferred`** if the user doesn’t choose (see step 5).
3. Keep language plain; attendees may be non-technical.

### Questions (in order)

1. **Business name** — What’s the name of your business?
2. **What you do** — In one sentence: what do you do, and for whom?
3. **Revenue** — How do you make money today? (1–3 short bullets.)
4. **90-day goal** — What single outcome in the next ~90 days would matter most if you hit it?
5. **Sample data** — Choose one:
   - **Minimum** — Only use what they typed; leave other BMC sections sparse (`—` or empty bullets).
   - **Inferred** *(default)* — Sensibly fill all nine BMC blocks + suggest a draft `inputs/90-day-plan.md` outline they can refine later (do **not** overwrite an existing 90-day file unless they ask).
   - **Demo seed** — Replace portal narrative with the fictional **Yeast Coast Culture** example from `references/ycc-example-bmc.md` + `references/ycc-90-day-plan.md` so they see a full portal pattern first; tell them to personalize afterward.

### Outputs (write files)

1. **`inputs/business-model-canvas.md`** — Use exactly this shape:

```markdown
# Business Model Canvas
**Business:** [name]
**Date:** [today's date]

## Value Propositions
[built from answers + mode]

## Customer Segments
…

## Channels
…

## Customer Relationships
[infer from answers]

## Revenue Streams
…

## Key Resources
…

## Key Activities
…

## Key Partners
…

## Cost Structure
[note fixed vs variable where possible]
```

2. **`portal/data/portal-data.js`** — Update in place:
   - `window.TenantConfig.site.name` = business name  
   - `window.TenantConfig.branding.brandWordmark` = short initials (≤4 chars) derived from name  
   - `window.PortalData.site.name` = same  
   - `window.PortalData.site.goal90` = their 90-day goal sentence  
   - Leave `plan` as `null` inside the `/* BEGIN_COMPILED_PLAN */` … `/* END_COMPILED_PLAN */` block unless they chose **Inferred** and explicitly want you to also draft the markdown plan (then create `inputs/90-day-plan.md` only — still run `node skills/sync-plan.js` yourself or tell them to run it).

3. **`inputs/business.json`** *(optional but recommended)* — Raw capture:

```json
{
  "business_name": "",
  "pitch_one_liner": "",
  "revenue_bullets": [],
  "goal_90d": "",
  "sample_data_mode": "minimum|inferred|demo_seed"
}
```

### Optional deepening

If they say **full canvas**, **`new-os --deep`**, or “ask me all BMC questions”:

- Walk the **nine-block** Business Model Canvas interview (classic Strategyzer prompts).
- Still write `inputs/business-model-canvas.md` in the same format as above.

### Demo seed note

If **Demo seed**: copy content from `references/ycc-example-bmc.md` into `inputs/business-model-canvas.md`, and copy the example block from `references/ycc-90-day-plan.md` into `inputs/90-day-plan.md`, then run **`node skills/sync-plan.js`** from this repo root (`template/` folder when published as standalone starter).

### Completion message

Tell them:

1. Open **`portal/index.html`** in a browser (local server recommended: `python3 -m http.server 3333` from the folder that contains `portal/`).
2. **`portal/canvas.html`** shows the BMC; **`portal/planning.html`** shows the compiled plan after sync.
3. Next step for milestones: say **`90-day plan`**.

---

## Workflow: `90-day plan`

### Questions (one at a time)

1. **Period** — Start month / end month (default: this month → +3 months).
2. **North star** — One measurable outcome for that window.
3. **Monthly shape** — For each of the three months: one **goal** sentence + 1–3 **milestones** (who owns it, due date optional).
4. **Bets** — 1–3 experiments that might **not** work.
5. **Risks** — Top risks + mitigations.

### Output

Write **`inputs/90-day-plan.md`** using this schema:

```markdown
# 90-Day Plan
**Business:** [name]
**Period:** [Start month] – [End month] [Year]
**Updated:** [YYYY-MM-DD]

## North Star
[Measurable outcome]

## Month 1 — [Month]
**Goal:** [sentence]
- [ ] [milestone] (owner: [name] · due: [YYYY-MM-DD])

## Month 2 — [Month]
…

## Month 3 — [Month]
…

## Bets
1. [bet]

## Risks
- [risk — mitigation]
```

Then run from the starter root (the folder that contains `skills/` and `portal/`):

```bash
node skills/sync-plan.js
```

That compiles markdown → `portal/data/portal-data.js` inside the `/* BEGIN_COMPILED_PLAN */` region.

Confirm success and ask them to reload **`portal/planning.html`** and **`portal/index.html`**.

---

## Operational reminders

- **Never** commit real customer data; workshop content stays fictional unless the user explicitly pastes their own.
- Prefer editing **`portal/data/portal-data.js`** only inside the marked `BEGIN_COMPILED_PLAN` / `END_COMPILED_PLAN` region for plan data (sync script owns that block).
- If `sync-plan.js` errors, check that `inputs/90-day-plan.md` still has three `## Month N —` sections.
