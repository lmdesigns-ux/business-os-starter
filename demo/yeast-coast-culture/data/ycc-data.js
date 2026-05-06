/**
 * Yeast Coast Culture — Business OS demo data.
 * Fictional content for workshop demonstration purposes only.
 * Generated from portal/inputs/*.md — run: node skills/sync-portal-data.js
 */

window.TenantConfig = {
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
};

window.PortalData = {
  "site": {
    "name": "Yeast Coast Culture"
  },
  "navSections": [
    {
      "id": "business",
      "label": "Business OS",
      "items": [
        {
          "id": "dashboard",
          "href": "index.html",
          "label": "Dashboard"
        },
        {
          "id": "planning",
          "href": "planning.html",
          "label": "Planning"
        },
        {
          "id": "products",
          "href": "products.html",
          "label": "Products"
        },
        {
          "id": "pipeline",
          "href": "pipeline.html",
          "label": "Pipeline"
        },
        {
          "id": "finance",
          "href": "finance.html",
          "label": "Finance"
        },
        {
          "id": "brand-voice",
          "href": "brand-voice.html",
          "label": "Brand Voice"
        }
      ]
    }
  ],
  "metrics": {
    "revenue_mtd": 42800,
    "revenue_target": 55000,
    "active_accounts": 4,
    "top_sku": "Block Rise Dehydrated Sourdough Starter",
    "brand_score": 87
  },
  "navCards": [
    {
      "href": "products.html",
      "label": "Products",
      "detail": "4 core · 2 seasonal"
    },
    {
      "href": "pipeline.html",
      "label": "Pipeline",
      "detail": "4 active · 3 prospects"
    },
    {
      "href": "finance.html",
      "label": "Finance",
      "detail": "Revenue by batch"
    },
    {
      "href": "brand-voice.html",
      "label": "Brand Voice",
      "detail": "Tone · Channels · Don'ts"
    }
  ],
  "products": [
    {
      "id": "block-rise",
      "name": "Block Rise Dehydrated Sourdough Starter",
      "category": "Flagship · heirloom strain · 10g pouch",
      "shelf_months": 24,
      "status": "core",
      "distribution": "National",
      "margin_pct": 48,
      "sku": "YCC-001"
    },
    {
      "id": "curb-cut",
      "name": "Curb Cut Kosher Dill Pickles",
      "category": "Lacto-fermented cucumbers · quart jar",
      "shelf_months": 12,
      "status": "core",
      "distribution": "Regional",
      "margin_pct": 40,
      "sku": "YCC-002"
    },
    {
      "id": "crosstown-kimchi",
      "name": "Crosstown Kimchi",
      "category": "Napa cabbage · gochugaru · pint",
      "shelf_months": 6,
      "status": "core",
      "distribution": "Regional",
      "margin_pct": 42,
      "sku": "YCC-003"
    },
    {
      "id": "row-house-kraut",
      "name": "Row House Classic Kraut",
      "category": "Caraway kraut · pint",
      "shelf_months": 12,
      "status": "core",
      "distribution": "Local",
      "margin_pct": 38,
      "sku": "YCC-004"
    },
    {
      "id": "wissahickon-ramp",
      "name": "Wissahickon Ramp Ferment",
      "category": "Seasonal allium ferment · half-pint",
      "shelf_months": 6,
      "status": "seasonal",
      "distribution": "Local",
      "margin_pct": 46,
      "sku": "YCC-S01",
      "season": "Spring"
    },
    {
      "id": "reading-terminal-chutney",
      "name": "Reading Terminal Apple Chutney",
      "category": "Slow fermented · half-pint",
      "shelf_months": 18,
      "status": "seasonal",
      "distribution": "Regional",
      "margin_pct": 44,
      "sku": "YCC-S02",
      "season": "Fall"
    }
  ],
  "accounts": [
    {
      "id": "broad-st-provisions",
      "name": "Broad Street Provisions",
      "type": "specialty grocer",
      "state": "PA",
      "status": "active",
      "contact": "Jamie M.",
      "last_contact": "2026-04-22",
      "skus": [
        "YCC-001",
        "YCC-003"
      ]
    },
    {
      "id": "fishtown-ferment-market",
      "name": "Fishtown Ferment Market",
      "type": "specialty grocer",
      "state": "PA",
      "status": "active",
      "contact": "Rena K.",
      "last_contact": "2026-04-18",
      "skus": [
        "YCC-001",
        "YCC-002",
        "YCC-003"
      ]
    },
    {
      "id": "riverline-cafe",
      "name": "Riverline Cafe",
      "type": "cafe",
      "state": "NJ",
      "status": "active",
      "contact": "Marco D.",
      "last_contact": "2026-04-10",
      "skus": [
        "YCC-003",
        "YCC-004"
      ]
    },
    {
      "id": "liberty-specialty-dist",
      "name": "Liberty Specialty Food Distributors",
      "type": "distributor",
      "state": "PA",
      "status": "active",
      "contact": "Leah V.",
      "last_contact": "2026-04-25",
      "skus": [
        "YCC-001",
        "YCC-003",
        "YCC-004"
      ]
    },
    {
      "id": "garden-state-growers-collective",
      "name": "Garden State Growers Collective",
      "type": "farmers market",
      "state": "NJ",
      "status": "won",
      "contact": "Sam T.",
      "last_contact": "2026-04-20",
      "skus": [
        "YCC-001",
        "YCC-002"
      ]
    },
    {
      "id": "hoboken-bakehouse",
      "name": "Hoboken Bakehouse",
      "type": "bakery",
      "state": "NJ",
      "status": "prospect",
      "contact": "Alec F.",
      "last_contact": "2026-04-05",
      "skus": []
    },
    {
      "id": "metro-foods-wholesale",
      "name": "Metro Foods Wholesale",
      "type": "distributor",
      "state": "NY",
      "status": "prospect",
      "contact": "Pat S.",
      "last_contact": "2026-03-28",
      "skus": []
    },
    {
      "id": "bowery-ferment-supply",
      "name": "Bowery Ferment Supply",
      "type": "distributor",
      "state": "NY",
      "status": "prospect",
      "contact": "Dana R.",
      "last_contact": "2026-04-30",
      "skus": [
        "YCC-001",
        "YCC-004"
      ]
    }
  ],
  "revenue": [
    {
      "batch": "Jan · Run 1",
      "product": "Block Rise Dehydrated Sourdough Starter",
      "units": 280,
      "revenue": 8400,
      "month": "2026-01"
    },
    {
      "batch": "Jan · Run 2",
      "product": "Curb Cut Kosher Dill Pickles",
      "units": 240,
      "revenue": 7200,
      "month": "2026-01"
    },
    {
      "batch": "Feb · Run 1",
      "product": "Crosstown Kimchi",
      "units": 200,
      "revenue": 6800,
      "month": "2026-02"
    },
    {
      "batch": "Feb · Run 2",
      "product": "Row House Classic Kraut",
      "units": 220,
      "revenue": 7700,
      "month": "2026-02"
    },
    {
      "batch": "Mar · Run 1",
      "product": "Block Rise Dehydrated Sourdough Starter",
      "units": 360,
      "revenue": 10800,
      "month": "2026-03"
    },
    {
      "batch": "Mar · Run 2",
      "product": "Curb Cut Kosher Dill Pickles",
      "units": 280,
      "revenue": 8960,
      "month": "2026-03"
    },
    {
      "batch": "Apr · Run 1",
      "product": "Wissahickon Ramp Ferment",
      "units": 160,
      "revenue": 5600,
      "month": "2026-04"
    },
    {
      "batch": "Apr · Run 2",
      "product": "Row House Classic Kraut",
      "units": 260,
      "revenue": 9100,
      "month": "2026-04"
    }
  ],
  "brand": {
    "mission": "Philly-born ferments for the urban hustle — tangy, crunchy, no sea-spray nostalgia. Every jar earns its keep between the row-house stoop and the deli case.",
    "audience": "Home cooks, deli operators, and Mid-Atlantic pantry-stockers, 28–50, who'd rather hear 'tangy' than 'artisanal' — sourdough curious to fermentation regulars.",
    "tone": [
      "Plainspoken",
      "Direct",
      "Tangy and crunchy",
      "Philly-blunt",
      "Never corporate"
    ],
    "channels": {
      "email": "Conversational, no hype. Lead with what's in the jar this week. Short.",
      "social": "Process-first: starters waking up on row-house stoops, SEPTA-ride taste tests, jar burps, shelf shots. Hashtags: #YeastCoast + Philly tags only.",
      "events": "First-person tasting notes. Invite people to crunch. No jargon.",
      "press": "Factual, confident. Let batch notes and lab-style specs do the talking. No superlatives."
    },
    "avoid": [
      "gut health miracle",
      "probiotic powerhouse",
      "secret family recipe",
      "artisanal",
      "small batch magic",
      "mommy blogger tone",
      "coastal vibes",
      "salt air",
      "sea spray"
    ]
  },
  "recentActivity": [
    {
      "label": "Garden State Growers Collective — account won",
      "href": "pipeline.html",
      "section": "Pipeline"
    },
    {
      "label": "Apr · Run 2 (Row House Classic Kraut) shipped",
      "href": "finance.html",
      "section": "Finance"
    },
    {
      "label": "Liberty Specialty Food Distributors — new SKU add",
      "href": "pipeline.html",
      "section": "Pipeline"
    },
    {
      "label": "Wissahickon Ramp Ferment — seasonal launch",
      "href": "products.html",
      "section": "Products"
    },
    {
      "label": "90-day plan — May–July north star set",
      "href": "planning.html",
      "section": "Planning"
    }
  ],
  "plan": {
    "business": "Yeast Coast Culture",
    "period": "May 2026 – July 2026",
    "updated": "2026-05-01",
    "northStar": "Hit **$55k MTD wholesale revenue** by end of July while keeping flagship dehydrated sourdough starter ≥40% of case mix.",
    "months": [
      {
        "monthNum": 1,
        "monthLabel": "May",
        "goal": "Lock distributor velocity + shore up seasonal ramp supply.",
        "milestones": [
          {
            "text": "Close case-pricing sheet with Liberty Specialty for Q3 pouches",
            "owner": "Founder",
            "due": "2026-05-15",
            "done": false
          },
          {
            "text": "Ship Wissahickon Ramp Ferment pilot to 3 active accounts",
            "owner": "Ops",
            "due": "2026-05-08",
            "done": true
          },
          {
            "text": "Publish shelf-stable spec PDF for Block Rise starter",
            "owner": "Ops",
            "due": "2026-05-22",
            "done": false
          }
        ]
      },
      {
        "monthNum": 2,
        "monthLabel": "June",
        "goal": "Expand Mid-Atlantic footprint without cold-chain breakage.",
        "milestones": [
          {
            "text": "Metro Foods Wholesale — first PO + delivery window",
            "owner": "Sales",
            "due": "2026-06-12",
            "done": false
          },
          {
            "text": "Hoboken Bakehouse tasting → assortment decision",
            "owner": "Sales",
            "due": "2026-06-20",
            "done": false
          },
          {
            "text": "Second dehydration run scheduled post–Memorial Day demand signal",
            "owner": "Ops",
            "due": "2026-06-05",
            "done": false
          }
        ]
      },
      {
        "monthNum": 3,
        "monthLabel": "July",
        "goal": "Repeatable seasonal pipeline + national pouch rhythm.",
        "milestones": [
          {
            "text": "Bowery Ferment pilot SKUs locked for NY specialty set",
            "owner": "Sales",
            "due": "2026-07-10",
            "done": false
          },
          {
            "text": "Reading Terminal Apple Chutney recipe lock + label draft",
            "owner": "Product",
            "due": "2026-07-25",
            "done": false
          },
          {
            "text": "Wholesale newsletter: batch notes + facing checklist",
            "owner": "Brand",
            "due": "2026-07-18",
            "done": false
          }
        ]
      }
    ],
    "bets": [
      "Pouch-led bundle kits — If grocers merch starter + kimchi together, basket size lifts without extra demos.",
      "Distributor-first NYC — If Metro Foods moves first, we reduce founder-driven drives and protect margin."
    ],
    "risks": [
      "Cold-chain gaps on jar SKUs — mitigate with consolidated weekly Philly/NYC drops until distributor steady-state.",
      "Ingredient spike (cabbage/gochugaru) — mitigate with alternate supplier quote locked by May 30."
    ],
    "stats": {
      "total": 9,
      "done": 1
    }
  }
};
