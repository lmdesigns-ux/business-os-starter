# Step 2 — Products & services library

**Where in Moxie:** Accounting (left nav) → **Products & services** → Add each item.

Copy rates from [`products-and-services.csv`](products-and-services.csv). Adjust dollar amounts to match your live proposals; placeholders reflect export patterns (e.g. HF ~$135/hr effective, landing pages ~$150–$249–$1500 range).

## Nonprofit / Design Grove core

| SKU | Name | Type | Default rate | Notes |
|-----|------|------|--------------|-------|
| DG-DISC-30 | Discovery call (30 min) | Fixed | $0 | Calendar only — not a project |
| DG-WKS-HALF | Process clarity workshop — half day | Fixed | $2,500 | 90-day plan teaser offer |
| DG-MAP-STD | Service mapping engagement — standard | Fixed | $7,500 | 2–4 sessions + blueprint |
| DG-MAP-EXT | Service mapping engagement — extended | Fixed | $12,000 | Multi-program orgs |
| DG-OH-MONTH | Post-workshop office hours (monthly) | Retainer | $600/mo | Post-engagement support |
| DG-FACIL-DAY | Additional facilitation day | Fixed | $1,800 | Add-on line on proposals |

## Legacy delivery (keep while you still sell them)

| SKU | Name | Type | Default rate | Past client |
|-----|------|------|--------------|-------------|
| DG-LP-FIXED | Landing page — design + build | Fixed | $1,500 | Top Realty, Talk With Marie |
| DG-MERCH-SPRINT | Brand / merch strategy sprint | Fixed | $3,200 | PhilanthroCulture (proposal value) |
| DG-WEB-5 | Website — up to 5 pages | Fixed | $3,500 | Coach Evelt |
| DG-BOOK-COVER | Book cover design | Fixed | $400 | Coach Evelt |
| DG-UX-HR | UX research — hourly | Hourly | $135/hr | HelloFresh only |

## Moxie setup checklist

- [ ] Create each SKU with **name**, **type** (fixed / hourly / retainer), and **default rate**
- [ ] Paste **description** from CSV into the product detail field
- [ ] For hourly SKU **DG-UX-HR**, enable on HelloFresh projects only
- [ ] Use **per-item** project fee type when a single project mixes SKUs (e.g. mapping + extra facilitation day)

## Proposal wiring

- [ ] In each **agreement template**, insert blocks from the library instead of one-off line items
- [ ] Map closed-won opportunities to SKU names (see [`03-pipeline-and-biz-dev.md`](03-pipeline-and-biz-dev.md))

**Next:** [`02-hellofresh-retainer-projects.md`](02-hellofresh-retainer-projects.md)
