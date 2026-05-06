# Dashboard

Metrics, home-page nav cards, and recent activity feed. Run `node skills/sync-portal-data.js` after edits.

```json
{
  "metrics": {
    "revenue_mtd": 42800,
    "revenue_target": 55000,
    "active_accounts": 4,
    "top_sku": "Block Rise Dehydrated Sourdough Starter",
    "brand_score": 87
  },
  "navCards": [
    { "href": "products.html", "label": "Products", "detail": "4 core · 2 seasonal" },
    { "href": "pipeline.html", "label": "Pipeline", "detail": "4 active · 3 prospects" },
    { "href": "finance.html", "label": "Finance", "detail": "Revenue by batch" },
    { "href": "brand-voice.html", "label": "Brand Voice", "detail": "Tone · Channels · Don'ts" }
  ],
  "recentActivity": [
    { "label": "Garden State Growers Collective — account won", "href": "pipeline.html", "section": "Pipeline" },
    { "label": "Apr · Run 2 (Row House Classic Kraut) shipped", "href": "finance.html", "section": "Finance" },
    { "label": "Liberty Specialty Food Distributors — new SKU add", "href": "pipeline.html", "section": "Pipeline" },
    { "label": "Wissahickon Ramp Ferment — seasonal launch", "href": "products.html", "section": "Products" },
    { "label": "90-day plan — May–July north star set", "href": "planning.html", "section": "Planning" }
  ]
}
```
