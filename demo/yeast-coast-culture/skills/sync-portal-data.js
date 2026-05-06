#!/usr/bin/env node
/**
 * sync-portal-data.js
 *
 * Compiles portal/inputs/*.md (JSON fenced blocks + 90-day-plan.md) → data/ycc-data.js.
 *
 * Usage (from portal/):  node skills/sync-portal-data.js
 *
 * Inputs:
 *   inputs/site.md, dashboard.md, products.md, pipeline.md, finance.md, brand-voice.md
 *   inputs/90-day-plan.md (prose + checklist schema — parsed by sync-plan.js)
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = __dirname;
const ROOT = path.join(SKILLS_DIR, '..');
const INPUTS = path.join(ROOT, 'inputs');
const OUT_FILE = path.join(ROOT, 'data', 'ycc-data.js');

const PLAN_PATH = path.join(INPUTS, '90-day-plan.md');

function readJsonFence(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error('Missing input file: ' + filePath);
  }
  const md = fs.readFileSync(filePath, 'utf8');
  const m = md.match(/```(?:json)?\s*\n([\s\S]*?)```/);
  if (!m) {
    throw new Error('No ```json fenced block in ' + filePath);
  }
  return JSON.parse(m[1].trim());
}

function buildPortalData() {
  const site = readJsonFence(path.join(INPUTS, 'site.md'));
  const dashboard = readJsonFence(path.join(INPUTS, 'dashboard.md'));
  const products = readJsonFence(path.join(INPUTS, 'products.md'));
  const pipeline = readJsonFence(path.join(INPUTS, 'pipeline.md'));
  const finance = readJsonFence(path.join(INPUTS, 'finance.md'));
  const brandVoice = readJsonFence(path.join(INPUTS, 'brand-voice.md'));

  if (!fs.existsSync(PLAN_PATH)) {
    throw new Error('Missing ' + PLAN_PATH);
  }
  const planMd = fs.readFileSync(PLAN_PATH, 'utf8');
  const { parse90DayPlan } = require('./sync-plan');
  const plan = parse90DayPlan(planMd);

  return {
    tenantConfig: site.tenantConfig,
    portalData: {
      site: site.portalSite,
      navSections: site.navSections,
      metrics: dashboard.metrics,
      navCards: dashboard.navCards,
      products: products.products,
      accounts: pipeline.accounts,
      revenue: finance.revenue,
      brand: brandVoice.brand,
      recentActivity: dashboard.recentActivity,
      plan
    }
  };
}

function renderDataJs(tenantConfig, portalData) {
  const header =
    '/**\n' +
    ' * Yeast Coast Culture — Business OS demo data.\n' +
    ' * Fictional content for workshop demonstration purposes only.\n' +
    ' * Generated from portal/inputs/*.md — run: node skills/sync-portal-data.js\n' +
    ' */\n\n';

  const tc = JSON.stringify(tenantConfig, null, 2);
  const pd = JSON.stringify(portalData, null, 2);
  return header + 'window.TenantConfig = ' + tc + ';\n\nwindow.PortalData = ' + pd + ';\n';
}

function syncPortalData() {
  const { tenantConfig, portalData } = buildPortalData();
  fs.writeFileSync(OUT_FILE, renderDataJs(tenantConfig, portalData), 'utf8');
}

/**
 * Replace the JSON fence body in pipeline.md (preserves title / intro lines).
 * @param {object} pipelinePayload — e.g. { accounts: [...] }
 */
function writePipelineInputs(pipelinePayload) {
  const pipelinePath = path.join(INPUTS, 'pipeline.md');
  const md = fs.readFileSync(pipelinePath, 'utf8');
  const inner = JSON.stringify(pipelinePayload, null, 2);
  const next = md.replace(/```(?:json)?\s*\n[\s\S]*?```/, '```json\n' + inner + '\n```');
  fs.writeFileSync(pipelinePath, next, 'utf8');
}

if (require.main === module) {
  try {
    syncPortalData();
    console.log('✅  Portal data synced to', path.relative(process.cwd(), OUT_FILE));
    console.log('   Sources:', path.relative(process.cwd(), INPUTS) + '/*.md');
    console.log('');
    console.log('   Reload any portal HTML page to see updates.');
  } catch (e) {
    console.error('❌ ', e.message || e);
    process.exit(1);
  }
}

module.exports = {
  syncPortalData,
  buildPortalData,
  readJsonFence,
  writePipelineInputs,
  INPUTS,
  OUT_FILE
};
