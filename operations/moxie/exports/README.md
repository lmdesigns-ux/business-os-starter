# Moxie workspace exports

Drop your latest **Workspace-Export.xlsx** here (from Moxie → workspace menu → Data import/export, or your workspace export flow).

Add HelloFresh invoice PDFs to [`../invoices/`](../invoices/) if you need project-level billing detail (see [`../invoices/README.md`](../invoices/README.md)).

Then from the repo root:

```bash
npm install
npm run sync:all
```

Raw `.xlsx` and `.csv` files in this folder are gitignored. Only processed inputs under `inputs/` are committed.
