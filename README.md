# Business OS — Starter Kit

Fork or download this repo, open it in your AI-powered editor, type **`new-os`** in chat to onboard, and get a dashboard scaffold for your business.

## Start in 60 seconds (pick one)

### 1 — Open in Cursor / VS Code clone link (easiest if Git is installed)

Paste this into your browser address bar while Cursor or VS Code is installed — it opens the Git clone flow:

[`vscode://vscode.git/clone?url=https%3A%2F%2Fgithub.com%2Fluiscielak%2Fbusiness-os-starter.git`](vscode://vscode.git/clone?url=https%3A%2F%2Fgithub.com%2Fluiscielak%2Fbusiness-os-starter.git)

Choose a folder → after clone finishes, **File → Open Folder** if the editor doesn’t open it automatically.

*(Cursor inherits many VS Code URL handlers; if nothing happens, use step 2 or 3. Maintainer notes on deep links: `docs/cursor-deeplink.md` in the workshop monorepo.)*

### 2 — Download ZIP (no GitHub account)

1. Download **[main.zip](https://github.com/luiscielak/business-os-starter/archive/refs/heads/main.zip)**  
2. Unzip  
3. Drag the folder into **Cursor** (or **File → Open Folder**)

### 3 — `git clone` (terminal)

```bash
git clone https://github.com/luiscielak/business-os-starter.git
cd business-os-starter
```

Then open this folder in Cursor.

---

## Run onboarding

1. Open **chat** in Cursor (or your agent panel in Claude Code / Codex / Cline).
2. Type **`new-os`** (or say “start business os onboarding”).
3. Answer **five questions** — the agent reads [`AGENTS.md`](AGENTS.md) at repo root.
4. Open **`portal/index.html`** in a browser.

**Local preview**

```bash
python3 -m http.server 3333
```

Visit `http://localhost:3333/portal/index.html` (adjust path if you served from `portal/` directly).

---

## After onboarding

| Page | What it is |
|------|------------|
| `portal/index.html` | Dashboard |
| `portal/canvas.html` | Business overview — your single source of truth (from `inputs/business-model-canvas.md`) |
| `portal/planning.html` | 90-day planning view (compiled from markdown) |

### 90-day planning

In chat, say **`90-day plan`** — then run:

```bash
node skills/sync-plan.js
```

Reload `portal/planning.html`.

---

## Cursor rule picker

In Cursor you can also invoke **`@new-os`** — see [`.cursor/rules/new-os.mdc`](.cursor/rules/new-os.mdc) (thin shim → `AGENTS.md`).

---

## References

In the published **`business-os-starter`** repo these live under `references/` at repo root.  
If you’re inside the workshop monorepo, open **`../references/`** from `template/`.

- `bmc-template.md` — blank BMC
- `ycc-example-bmc.md` — fictional Yeast Coast Culture example
- `ycc-90-day-plan.md` — 90-day markdown schema + example

---

## Next steps

Add more markdown under `inputs/` and extend `portal/` — keep **markdown as source**, compile with small scripts, ship static HTML.
