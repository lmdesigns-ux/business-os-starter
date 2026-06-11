# Workshop artefacts

Draft workshop outlines and process maps here. Markdown is the source of truth; the portal compiles an index and fetches full content at runtime.

## Folder layout

```
inputs/artefacts/
├── README.md              ← you are here
├── workshops/             ← workshop outlines (type: workshop)
└── process-maps/          ← process maps (type: process_map)
```

## Add a new artefact

1. Copy a template from `references/workshop-outline-template.md` or `references/process-map-template.md`.
2. Save under `workshops/` or `process-maps/` with a kebab-case filename.
3. Fill in the ` ```json ` metadata block (unique `id`, `status`, etc.).
4. Run from repo root:

```bash
node skills/sync-portal-data.js
```

5. Open `portal/artefacts.html` in the browser (local server required).

## Metadata fields

| Field | Required | Notes |
|-------|----------|-------|
| `id` | yes | Unique kebab-case slug; used in portal URLs |
| `title` | yes | Display name |
| `type` | yes | `workshop` or `process_map` |
| `status` | yes | `draft`, `review`, or `ready` |
| `updated` | yes | ISO date `YYYY-MM-DD` |
| `tags` | no | Array of strings for filtering |
| `sku` | no | Moxie product SKU (e.g. `DG-WKS-HALF`) |
| `duration` | workshops | e.g. `4 hours` |
| `audience` | workshops | Who the session is for |
| `scope` | process maps | What the map covers |
| `externalUrl` | no | FigJam, Miro, slides, or PDF link |

## Review notes

Every artefact should end with a `## Review notes` section. Use this for captured feedback from Cursor (`review artefact` workflow) or your own iteration notes.

## Portal pages

| Page | Purpose |
|------|---------|
| `portal/artefacts.html` | Library — browse and filter all artefacts |
| `portal/artefact.html?id=<id>` | Detail — full content, Mermaid maps, external links |
