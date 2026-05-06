/**
 * Starter portal data — replaced / extended by the `new-os` and `90-day plan` flows in AGENTS.md.
 * Fictional placeholders only until you run onboarding.
 */

window.TenantConfig = {
  tenantId: 'starter',
  placeholder: true,
  site: {
    name: 'Your Business',
    description: 'Business OS starter kit'
  },
  branding: {
    accent: '#C27A0A',
    brandWordmark: 'OS'
  }
};

window.PortalData = {
  site: {
    name: 'Your Business',
    /** Set by `new-os` flow — shown on the dashboard. */
    goal90: ''
  },

  navSections: [
    {
      id: 'business',
      label: 'Business OS',
      items: [
        { id: 'dashboard', href: 'index.html', label: 'Dashboard' },
        { id: 'canvas', href: 'canvas.html', label: 'Canvas' },
        { id: 'planning', href: 'planning.html', label: 'Planning' }
      ]
    }
  ],

  metrics: {
    revenue_mtd: 0,
    revenue_target: 0,
    active_accounts: 0,
    top_sku: '—',
    brand_score: 0
  },

  recentActivity: [],

  /* BEGIN_COMPILED_PLAN */
  plan: null,
  /* END_COMPILED_PLAN */
};
