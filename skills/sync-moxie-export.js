#!/usr/bin/env node
/**
 * sync-moxie-export.js
 *
 * Parses Moxie Workspace-Export.xlsx (or newest *.xlsx in operations/moxie/exports/)
 * → updates inputs/dashboard.md and inputs/pipeline.md
 * → writes operations/moxie/export-snapshot.json
 *
 * Sheet names (flexible match): Clients, Projects, Invoices, Opportunities, Time / Timesheets
 * Column headers are matched case-insensitively (see pickCol below).
 *
 * Merges operations/moxie/invoice-detail.json when present (run parse-invoice-pdfs.js first).
 *
 * Usage (repo root):
 *   npm run sync:all
 *   # or: node skills/sync-moxie-export.js
 */

const fs = require('fs');
const path = require('path');
const { updateJsonFence, readJsonFence } = require('./lib/markdown-json');
const { aggregateInvoiceDetails, normalizeInvoiceNumber } = require('./lib/invoice-pdf');

const ROOT = path.join(__dirname, '..');
const EXPORTS_DIR = path.join(ROOT, 'operations', 'moxie', 'exports');
const BASELINE_PATH = path.join(ROOT, 'operations', 'moxie', 'export-baseline.json');
const INVOICE_DETAIL_PATH = path.join(ROOT, 'operations', 'moxie', 'invoice-detail.json');
const DASHBOARD_PATH = path.join(ROOT, 'inputs', 'dashboard.md');
const PIPELINE_PATH = path.join(ROOT, 'inputs', 'pipeline.md');
const SNAPSHOT_PATH = path.join(ROOT, 'operations', 'moxie', 'export-snapshot.json');
const BUSINESS_PATH = path.join(ROOT, 'inputs', 'business.json');

const HELLOFRESH_NAMES = new Set([
  'hellofresh us',
  'grocery delivery e-services usa inc.',
  'grocery delivery e-services usa inc',
  'hellofresh'
]);

const OPEN_STAGES = new Set(['meeting', 'proposal', 'open', 'qualified', 'negotiation']);
const WON_STAGES = new Set(['closed won', 'won', 'closed-won']);
const LOST_STAGES = new Set(['closed lost', 'lost', 'closed-lost']);

function findExportFile() {
  const preferred = path.join(EXPORTS_DIR, 'Workspace-Export.xlsx');
  if (fs.existsSync(preferred)) return preferred;
  if (!fs.existsSync(EXPORTS_DIR)) return null;
  const files = fs
    .readdirSync(EXPORTS_DIR)
    .filter((f) => /\.xlsx$/i.test(f))
    .map((f) => ({ name: f, mtime: fs.statSync(path.join(EXPORTS_DIR, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  return files.length ? path.join(EXPORTS_DIR, files[0].name) : null;
}

function normalizeHeader(h) {
  return String(h || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_');
}

function sheetToRows(wb, namePatterns) {
  const names = wb.SheetNames || [];
  const sheetName = names.find((n) => {
    const low = n.toLowerCase();
    return namePatterns.some((p) => low.includes(p));
  });
  if (!sheetName) return [];
  const XLSX = require('xlsx');
  const sheet = wb.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet, { defval: '' });
}

function pickCol(row, aliases) {
  const keys = Object.keys(row);
  for (const alias of aliases) {
    const hit = keys.find((k) => normalizeHeader(k) === alias || normalizeHeader(k).includes(alias));
    if (hit != null && row[hit] !== '') return row[hit];
  }
  return '';
}

function parseMoney(v) {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

function parseHours(v) {
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

function normalizeStage(raw) {
  const s = String(raw || '').trim().toLowerCase();
  if (WON_STAGES.has(s)) return 'won';
  if (LOST_STAGES.has(s)) return 'lost';
  if (s.includes('proposal')) return 'proposal';
  if (s.includes('meeting') || s === 'open') return 'meeting';
  return s.replace(/\s+/g, '_') || 'meeting';
}

function normalizeClientName(name) {
  const n = String(name || '').trim();
  if (HELLOFRESH_NAMES.has(n.toLowerCase())) return 'HelloFresh US';
  return n;
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
}

function parseSkuFromName(name) {
  const n = String(name);
  if (/service mapping|DG-MAP/i.test(n)) return 'DG-MAP-STD';
  if (/merch|DG-MERCH/i.test(n)) return 'DG-MERCH-SPRINT';
  if (/landing page|DG-LP/i.test(n)) return 'DG-LP-FIXED';
  if (/discovery|DG-DISC/i.test(n)) return 'DG-DISC-30';
  if (/workshop|DG-WKS/i.test(n)) return 'DG-WKS-HALF';
  if (/UX|research|hourly/i.test(n)) return 'DG-UX-HR';
  return '—';
}

function loadInvoiceDetails() {
  if (!fs.existsSync(INVOICE_DETAIL_PATH)) return {};
  try {
    const data = JSON.parse(fs.readFileSync(INVOICE_DETAIL_PATH, 'utf8'));
    const raw = data.invoices || {};
    const out = {};
    for (const [k, v] of Object.entries(raw)) {
      const key = normalizeInvoiceNumber(k);
      out[key] = { ...v, invoice_number: normalizeInvoiceNumber(v.invoice_number || k) };
    }
    return out;
  } catch (_) {
    return {};
  }
}

function projectsFromInvoiceDetail(detail) {
  if (!detail || !detail.line_items) return [];
  return [...new Set(detail.line_items.map((li) => li.project).filter(Boolean))];
}

function isGenericUpdateTitle(name) {
  return /45\s*minute\s*project\s*update/i.test(name);
}

function dedupeOpportunities(rows) {
  const byKey = new Map();
  for (const row of rows) {
    const key = [
      normalizeClientName(row.client).toLowerCase(),
      row.stage,
      row.value
    ].join('|');
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, row);
      continue;
    }
    if (isGenericUpdateTitle(existing.name) && !isGenericUpdateTitle(row.name)) {
      byKey.set(key, row);
    }
  }
  return [...byKey.values()];
}

function parseWorkbook(filePath, invoiceDetails) {
  const XLSX = require('xlsx');
  const wb = XLSX.readFile(filePath);
  const pdfInvoices = invoiceDetails || loadInvoiceDetails();

  const oppRows = sheetToRows(wb, ['opportunit', 'pipeline', 'deal']);
  const clientRows = sheetToRows(wb, ['client']);
  const invoiceRows = sheetToRows(wb, ['invoice']);
  const projectRows = sheetToRows(wb, ['project']);
  const timeRows = sheetToRows(wb, ['time', 'timesheet']);

  const opportunities = dedupeOpportunities(
    oppRows
      .map((r, i) => {
        const name = String(
          pickCol(r, ['name', 'opportunity', 'title', 'opportunity_name']) || ''
        ).trim();
        if (!name) return null;
        const client = normalizeClientName(
          pickCol(r, ['client', 'account', 'company', 'client_name', 'organization'])
        );
        const stage = normalizeStage(pickCol(r, ['stage', 'status', 'pipeline_stage']));
        const value = parseMoney(pickCol(r, ['value', 'amount', 'deal_value', 'total']));
        const lead = String(pickCol(r, ['lead_source', 'source', 'lead']) || '').trim();
        const last = String(
          pickCol(r, ['last_activity', 'updated', 'modified', 'date', 'last_modified']) || ''
        ).trim();
        return {
          id: slugify(name) || 'opp-' + i,
          name,
          client: client || '—',
          stage,
          value,
          sku: parseSkuFromName(name),
          lead_source: lead || '—',
          last_activity: last || '—'
        };
      })
      .filter(Boolean)
  );

  const clientMap = new Map();
  for (const r of clientRows) {
    const name = normalizeClientName(
      pickCol(r, ['name', 'client', 'client_name', 'company', 'display_name'])
    );
    if (!name) continue;
    const archived = /true|yes|1|archived/i.test(
      String(pickCol(r, ['archive', 'archived', 'status']) || '')
    );
    clientMap.set(name.toLowerCase(), {
      id: slugify(name),
      name,
      status: archived ? 'archived' : 'active',
      type: String(pickCol(r, ['type', 'client_type', 'segment']) || 'client').toLowerCase(),
      active_projects: 0,
      revenue_ytd: 0,
      primary_sku: '—'
    });
  }

  for (const r of projectRows) {
    const client = normalizeClientName(
      pickCol(r, ['client', 'client_name', 'account', 'company'])
    );
    if (!client) continue;
    const status = String(pickCol(r, ['status', 'project_status', 'state']) || '').toLowerCase();
    const active = !/complete|completed|archived|closed/i.test(status);
    if (!clientMap.has(client.toLowerCase())) {
      clientMap.set(client.toLowerCase(), {
        id: slugify(client),
        name: client,
        status: 'active',
        type: 'client',
        active_projects: 0,
        revenue_ytd: 0,
        primary_sku: '—'
      });
    }
    const c = clientMap.get(client.toLowerCase());
    if (active) c.active_projects += 1;
  }

  const now = new Date();
  const ytdStart = new Date(now.getFullYear(), 0, 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let revenueMtd = 0;
  const skuTotals = new Map();

  for (const r of invoiceRows) {
    const client = normalizeClientName(
      pickCol(r, ['client', 'client_name', 'account', 'company'])
    );
    const amount = parseMoney(pickCol(r, ['amount', 'total', 'subtotal', 'invoice_amount']));
    const status = String(pickCol(r, ['status', 'invoice_status', 'payment_status']) || '').toLowerCase();
    const paid = /paid|complete/i.test(status);
    const dateRaw = pickCol(r, ['paid_date', 'date_paid', 'date', 'invoice_date', 'due_date']);
    const date = dateRaw ? new Date(dateRaw) : null;
    const lineSku = String(pickCol(r, ['sku', 'product', 'service', 'item']) || '—').trim() || '—';

    if (client && clientMap.has(client.toLowerCase())) {
      const c = clientMap.get(client.toLowerCase());
      if (paid && date && !Number.isNaN(date.getTime()) && date >= ytdStart) {
        c.revenue_ytd += amount;
      }
    } else if (client) {
      clientMap.set(client.toLowerCase(), {
        id: slugify(client),
        name: client,
        status: 'active',
        type: 'client',
        active_projects: 0,
        revenue_ytd: paid && date && date >= ytdStart ? amount : 0,
        primary_sku: lineSku
      });
    }

    if (paid && date && !Number.isNaN(date.getTime()) && date >= monthStart) {
      revenueMtd += amount;
    }
    if (lineSku !== '—') {
      skuTotals.set(lineSku, (skuTotals.get(lineSku) || 0) + amount);
    }
  }

  for (const c of clientMap.values()) {
    c.revenue_ytd = Math.round(c.revenue_ytd);
  }

  let retainerHoursQtd = 0;
  const qStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
  for (const r of timeRows) {
    const client = normalizeClientName(
      pickCol(r, ['client', 'client_name', 'account'])
    );
    const project = String(pickCol(r, ['project', 'project_name']) || '');
    const hours = parseHours(pickCol(r, ['hours', 'time', 'duration', 'quantity']));
    const dateRaw = pickCol(r, ['date', 'work_date', 'entry_date']);
    const date = dateRaw ? new Date(dateRaw) : null;
    const isHf =
      HELLOFRESH_NAMES.has((client || '').toLowerCase()) ||
      /hellofresh|diy program|ux research|competitor tracker|deep dives/i.test(project);
    if (!isHf) continue;
    if (date && !Number.isNaN(date.getTime()) && date < qStart) continue;
    retainerHoursQtd += hours;
  }

  if (!retainerHoursQtd && fs.existsSync(BASELINE_PATH)) {
    const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
    const hrs = baseline.hellofresh_hours_by_project || {};
    retainerHoursQtd = Object.values(hrs).reduce((a, b) => a + Number(b || 0), 0);
  }

  const pipelineValue = opportunities
    .filter((o) => OPEN_STAGES.has(o.stage) && o.value > 0)
    .reduce((s, o) => s + o.value, 0);

  const prospectStages = new Set(['meeting', 'proposal', 'researched', 'contacted', 'call_held']);
  const prospectsCount = opportunities.filter(
    (o) => prospectStages.has(o.stage) || (o.stage === 'meeting' && o.client !== '—')
  ).length;

  let revenueTarget = 10000;
  try {
    const existing = readJsonFence(DASHBOARD_PATH);
    if (existing.metrics && existing.metrics.revenue_target) {
      revenueTarget = existing.metrics.revenue_target;
    }
  } catch (_) {
    /* keep default */
  }

  let prospectsGoal = 10;
  try {
    const biz = JSON.parse(fs.readFileSync(BUSINESS_PATH, 'utf8'));
    if (biz.goal_90d && /10/.test(biz.goal_90d)) prospectsGoal = 10;
  } catch (_) {
    /* ignore */
  }

  const activeProjects = [...clientMap.values()].reduce((s, c) => s + (c.active_projects || 0), 0);

  const pdfAgg = aggregateInvoiceDetails(pdfInvoices, { now });
  const hoursLoggedQtd = Math.round(retainerHoursQtd * 10) / 10;
  const hoursBilledQtd = pdfAgg.billed_hours_qtd > 0 ? pdfAgg.billed_hours_qtd : null;
  let hoursDivergencePct = null;
  if (hoursLoggedQtd > 0 && hoursBilledQtd != null) {
    hoursDivergencePct = Math.round(((hoursLoggedQtd - hoursBilledQtd) / hoursLoggedQtd) * 1000) / 10;
  }

  const metrics = {
    revenue_mtd: Math.round(revenueMtd),
    revenue_target: revenueTarget,
    pipeline_value: Math.round(pipelineValue),
    prospects_count: prospectsCount,
    prospects_goal: prospectsGoal,
    active_projects: activeProjects,
    retainer_hours_qtd: hoursLoggedQtd,
    hf_forecast_monthly: pdfAgg.hf_forecast_monthly,
    hf_revenue_qtd: pdfAgg.hf_revenue_qtd || null,
    invoice_pdf_count: Object.keys(pdfInvoices).length
  };

  const retainer = {
    hours_logged_qtd: hoursLoggedQtd,
    hours_billed_qtd: hoursBilledQtd,
    revenue_by_project: pdfAgg.revenue_by_project,
    effective_rate: pdfAgg.effective_rate,
    hf_revenue_qtd: pdfAgg.hf_revenue_qtd || null,
    hours_divergence_pct: hoursDivergencePct,
    source: Object.keys(pdfInvoices).length ? 'Moxie export + invoice PDFs' : 'Moxie export only'
  };

  const openCount = opportunities.filter((o) => OPEN_STAGES.has(o.stage)).length;
  const navCards = [
    {
      href: 'pipeline.html',
      label: 'Pipeline',
      detail:
        openCount +
        ' open · $' +
        (pipelineValue >= 1000 ? (pipelineValue / 1000).toFixed(1) + 'k' : pipelineValue)
    },
    { href: 'planning.html', label: 'Planning', detail: '90-day milestones & bets' },
    { href: 'canvas.html', label: 'Canvas', detail: 'Business model canvas' },
    {
      href: 'https://create.withmoxie.com/',
      label: 'Moxie',
      detail: 'Clients · projects · invoices',
      external: true
    }
  ];

  const recentActivity = buildRecentActivity(invoiceRows, opportunities, projectRows, pdfInvoices);

  return {
    exportedAt: new Date().toISOString().slice(0, 10),
    source: path.basename(filePath),
    metrics,
    navCards,
    recentActivity,
    opportunities,
    clients: [...clientMap.values()],
    retainer
  };
}

function buildRecentActivity(invoiceRows, opportunities, projectRows, invoiceDetails) {
  const items = [];
  const pdfMap = invoiceDetails || {};

  for (const r of invoiceRows.slice(0, 20)) {
    const numRaw = pickCol(r, ['invoice_number', 'number', 'invoice', 'id']);
    const num = normalizeInvoiceNumber(numRaw);
    const client = normalizeClientName(pickCol(r, ['client', 'client_name']));
    const amount = parseMoney(pickCol(r, ['amount', 'total']));
    const status = String(pickCol(r, ['status']) || '');
    if (!numRaw && !client) continue;
    const detail = pdfMap[num];
    const projects = projectsFromInvoiceDetail(detail);
    const projectSuffix = projects.length ? ' · ' + projects.join(', ') : '';
    const label = status.toLowerCase().includes('paid')
      ? (numRaw || num || 'Invoice') + ' paid · $' + amount.toLocaleString('en-US') + projectSuffix
      : 'Invoice sent · ' + (client || 'Client') + ' · $' + amount.toLocaleString('en-US') + projectSuffix;
    items.push({ label, href: 'pipeline.html', section: 'Finance', sort: pickCol(r, ['date', 'paid_date']) });
  }

  for (const o of opportunities.filter((x) => OPEN_STAGES.has(x.stage) || x.stage === 'won').slice(0, 10)) {
    items.push({
      label: o.name + (o.value ? ' · $' + o.value.toLocaleString('en-US') : ''),
      href: 'pipeline.html',
      section: 'Pipeline',
      sort: o.last_activity
    });
  }

  for (const r of projectRows.slice(0, 10)) {
    const name = pickCol(r, ['name', 'project', 'project_name']);
    const status = String(pickCol(r, ['status']) || '');
    if (!name || !/complete/i.test(status)) continue;
    items.push({
      label: 'Project complete · ' + name,
      href: 'pipeline.html',
      section: 'Delivery',
      sort: pickCol(r, ['completed', 'date', 'updated'])
    });
  }

  items.sort((a, b) => String(b.sort || '').localeCompare(String(a.sort || '')));
  return items.slice(0, 8).map(({ label, href, section }) => ({ label, href, section }));
}

function main() {
  const exportFile = findExportFile();
  if (!exportFile) {
    console.error('❌  No Moxie export found.');
    console.error('    Drop Workspace-Export.xlsx in:', path.relative(ROOT, EXPORTS_DIR));
    console.error('    Keeping existing inputs/dashboard.md and inputs/pipeline.md.');
    process.exit(1);
  }

  let parsed;
  try {
    parsed = parseWorkbook(exportFile);
  } catch (e) {
    console.error('❌  Failed to parse export:', e.message || e);
    process.exit(1);
  }

  const dashboardPayload = {
    metrics: parsed.metrics,
    navCards: parsed.navCards,
    recentActivity: parsed.recentActivity
  };

  updateJsonFence(DASHBOARD_PATH, dashboardPayload);
  updateJsonFence(PIPELINE_PATH, {
    opportunities: parsed.opportunities,
    clients: parsed.clients,
    retainer: parsed.retainer
  });

  const snapshot = {
    exported: parsed.exportedAt,
    source: parsed.source,
    metrics: parsed.metrics,
    opportunity_count: parsed.opportunities.length,
    client_count: parsed.clients.length
  };
  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');

  console.log('✅  Moxie export synced from', path.relative(ROOT, exportFile));
  console.log('   →', path.relative(ROOT, DASHBOARD_PATH));
  console.log('   →', path.relative(ROOT, PIPELINE_PATH));
  console.log('   →', path.relative(ROOT, SNAPSHOT_PATH));
  console.log('');
  console.log('   Revenue MTD: $' + parsed.metrics.revenue_mtd);
  console.log('   Pipeline:    $' + parsed.metrics.pipeline_value);
  console.log('   Prospects:   ' + parsed.metrics.prospects_count + '/' + parsed.metrics.prospects_goal);
  console.log('');
  console.log('   Next: node skills/sync-portal-data.js');
}

if (require.main === module) {
  main();
}

module.exports = {
  parseWorkbook,
  findExportFile,
  normalizeClientName,
  dedupeOpportunities,
  loadInvoiceDetails,
  normalizeInvoiceNumber
};
