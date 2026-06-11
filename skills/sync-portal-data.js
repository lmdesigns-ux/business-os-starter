#!/usr/bin/env node
/**
 * sync-portal-data.js
 *
 * Compiles inputs/dashboard.md, inputs/pipeline.md, inputs/90-day-plan.md
 * → portal/data/portal-data.js
 *
 * Usage (repo root):  node skills/sync-portal-data.js
 */

const fs = require('fs');
const path = require('path');
const { readJsonFence } = require('./lib/markdown-json');
const { parse90DayPlan } = require('./sync-plan');
const { scanArtefacts } = require('./lib/parse-artefact');

const ROOT = path.join(__dirname, '..');
const DASHBOARD_PATH = path.join(ROOT, 'inputs', 'dashboard.md');
const PIPELINE_PATH = path.join(ROOT, 'inputs', 'pipeline.md');
const PLAN_PATH = path.join(ROOT, 'inputs', '90-day-plan.md');
const BUSINESS_PATH = path.join(ROOT, 'inputs', 'business.json');
const OUT_FILE = path.join(ROOT, 'portal', 'data', 'portal-data.js');
const EXISTING_DATA = OUT_FILE;

function loadTenantConfig() {
  let name = 'Your Business';
  let description = '';
  let wordmark = 'OS';
  let accent = '#C27A0A';

  if (fs.existsSync(BUSINESS_PATH)) {
    const biz = JSON.parse(fs.readFileSync(BUSINESS_PATH, 'utf8'));
    name = biz.business_name || name;
    description = biz.pitch_one_liner || description;
    wordmark = name
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 4)
      .toUpperCase();
  }

  if (fs.existsSync(EXISTING_DATA)) {
    const content = fs.readFileSync(EXISTING_DATA, 'utf8');
    const start = content.indexOf('window.TenantConfig = ');
    const end = content.indexOf('window.PortalData = ');
    if (start !== -1 && end !== -1) {
      const jsonStr = content.slice(start + 'window.TenantConfig = '.length, end).trim().replace(/;\s*$/, '');
      try {
        const existing = JSON.parse(jsonStr);
        if (existing.site?.name) name = existing.site.name;
        if (existing.site?.description) description = existing.site.description;
        if (existing.branding?.brandWordmark) wordmark = existing.branding.brandWordmark;
        if (existing.branding?.accent) accent = existing.branding.accent;
      } catch (_) {
        /* keep defaults */
      }
    }
  }

  return {
    tenantId: 'starter',
    placeholder: false,
    site: { name, description },
    branding: { accent, brandWordmark: wordmark }
  };
}

function loadSite(tenantConfig) {
  let goal90 = '';
  if (fs.existsSync(EXISTING_DATA)) {
    const content = fs.readFileSync(EXISTING_DATA, 'utf8');
    const m = content.match(/goal90:\s*'([^']*)'/);
    if (m) goal90 = m[1];
  }
  if (!goal90 && fs.existsSync(BUSINESS_PATH)) {
    const biz = JSON.parse(fs.readFileSync(BUSINESS_PATH, 'utf8'));
    goal90 = biz.goal_90d || '';
  }
  return {
    name: tenantConfig.site?.name || 'Your Business',
    goal90
  };
}

function buildPortalData() {
  const dashboard = readJsonFence(DASHBOARD_PATH);
  const pipeline = readJsonFence(PIPELINE_PATH);

  if (!fs.existsSync(PLAN_PATH)) {
    throw new Error('Missing ' + PLAN_PATH);
  }
  const planMd = fs.readFileSync(PLAN_PATH, 'utf8');
  const plan = parse90DayPlan(planMd);

  const tenantConfig = loadTenantConfig();
  const siteInfo = loadSite(tenantConfig);
  const site = {
    name: siteInfo.name,
    goal90: siteInfo.goal90
  };

  const navSections = [
    {
      id: 'business',
      label: 'Business OS',
      items: [
        { id: 'dashboard', href: 'index.html', label: 'Dashboard' },
        { id: 'pipeline', href: 'pipeline.html', label: 'Pipeline' },
        { id: 'canvas', href: 'canvas.html', label: 'Canvas' },
        { id: 'planning', href: 'planning.html', label: 'Planning' }
      ]
    },
    {
      id: 'practice',
      label: 'Practice',
      items: [{ id: 'artefacts', href: 'artefacts.html', label: 'Workshop' }]
    }
  ];

  const artefacts = scanArtefacts(ROOT);

  const navCards = [...(dashboard.navCards || [])];
  if (!navCards.some((c) => c.href === 'artefacts.html')) {
    navCards.push({
      href: 'artefacts.html',
      label: 'Workshop',
      detail: 'Outlines & process maps'
    });
  }

  return {
    tenantConfig,
    portalData: {
      site,
      navSections,
      metrics: dashboard.metrics,
      opportunities: pipeline.opportunities || [],
      clients: pipeline.clients || [],
      retainer: pipeline.retainer || null,
      navCards,
      recentActivity: dashboard.recentActivity || [],
      artefacts,
      plan
    }
  };
}

function renderDataJs(tenantConfig, portalData) {
  const header =
    '/**\n' +
    ' * Portal data — generated from inputs/*.md\n' +
    ' * Run: node skills/sync-portal-data.js (after sync-moxie-export.js when refreshing Moxie)\n' +
    ' */\n\n';

  const tc = JSON.stringify(tenantConfig, null, 2);
  const pd = JSON.stringify(portalData, null, 2);
  const indentedPlan = JSON.stringify(portalData.plan, null, 2)
    .split('\n')
    .map((line) => '    ' + line)
    .join('\n');

  const withoutPlan = { ...portalData };
  delete withoutPlan.plan;
  const body = JSON.stringify(withoutPlan, null, 2);
  const bodyNoClose = body.slice(0, -2);

  return (
    header +
    'window.TenantConfig = ' +
    tc +
    ';\n\nwindow.PortalData = ' +
    bodyNoClose +
    ',\n  /* BEGIN_COMPILED_PLAN */\n  plan:\n' +
    indentedPlan +
    ',\n  /* END_COMPILED_PLAN */\n};\n'
  );
}

function syncPortalData() {
  const { tenantConfig, portalData } = buildPortalData();
  fs.writeFileSync(OUT_FILE, renderDataJs(tenantConfig, portalData), 'utf8');
}

if (require.main === module) {
  try {
    syncPortalData();
    console.log('✅  Portal data synced to', path.relative(process.cwd(), OUT_FILE));
    console.log('   Sources: inputs/dashboard.md, pipeline.md, 90-day-plan.md, artefacts/');
    console.log('');
    console.log('   Reload index.html and pipeline.html in your browser.');
  } catch (e) {
    console.error('❌ ', e.message || e);
    process.exit(1);
  }
}

module.exports = { syncPortalData, buildPortalData };
