# Site / tenant

Source for `window.TenantConfig`, portal `site.name`, and sidebar navigation. After editing, run:

`node skills/sync-portal-data.js`

```json
{
  "tenantConfig": {
    "tenantId": "ycc",
    "placeholder": false,
    "site": {
      "name": "Yeast Coast Culture",
      "description": "Business OS — Yeast Coast Culture (fermentation & pickling demo)"
    },
    "branding": {
      "accent": "#C27A0A",
      "brandWordmark": "YCC"
    }
  },
  "portalSite": {
    "name": "Yeast Coast Culture"
  },
  "navSections": [
    {
      "id": "business",
      "label": "Business OS",
      "items": [
        { "id": "dashboard", "href": "index.html", "label": "Dashboard" },
        { "id": "planning", "href": "planning.html", "label": "Planning" },
        { "id": "products", "href": "products.html", "label": "Products" },
        { "id": "pipeline", "href": "pipeline.html", "label": "Pipeline" },
        { "id": "finance", "href": "finance.html", "label": "Finance" },
        { "id": "brand-voice", "href": "brand-voice.html", "label": "Brand Voice" }
      ]
    }
  ]
}
```
