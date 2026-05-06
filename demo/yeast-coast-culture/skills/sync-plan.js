#!/usr/bin/env node
/**
 * sync-plan.js
 * Parses inputs/90-day-plan.md (parse90DayPlan).
 *
 * Usage:
 *   From `portal/`:  node skills/sync-plan.js → delegates to sync-portal-data.js (full compile).
 *   From `template/`: node skills/sync-plan.js → writes only the plan region in portal-data.js.
 *
 * Input path is always `inputs/90-day-plan.md` relative to that folder.
 *
 * Markdown schema: see references/ycc-90-day-plan.md (template + example) or template/AGENTS.md.
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = __dirname;
const ROOT = path.join(SKILLS_DIR, '..');
const INPUT_PATH = path.join(ROOT, 'inputs', '90-day-plan.md');

const PORTAL_DATA = path.join(ROOT, 'portal', 'data', 'portal-data.js');
const YCC_DATA = path.join(ROOT, 'data', 'ycc-data.js');
const DATA_PATH = fs.existsSync(PORTAL_DATA) ? PORTAL_DATA : YCC_DATA;

const MARK_START = '/* BEGIN_COMPILED_PLAN */';
const MARK_END = '/* END_COMPILED_PLAN */';

function parse90DayPlan(md) {
  const plan = {
    business: '',
    period: '',
    updated: '',
    northStar: '',
    months: [],
    bets: [],
    risks: []
  };

  function lineMeta(re) {
    const m = md.match(re);
    return m ? m[1].trim() : '';
  }
  plan.business = lineMeta(/\*\*Business:\*\*\s*(.+)/);
  plan.period = lineMeta(/\*\*Period:\*\*\s*(.+)/);
  plan.updated = lineMeta(/\*\*Updated:\*\*\s*(.+)/);

  const ns = md.match(/## North Star\s*\n([\s\S]*?)(?=\n## |\s*$)/);
  plan.northStar = ns ? ns[1].trim().replace(/\n+/g, ' ').trim() : '';

  const monthRe = /## Month (\d+) — ([^\n]+)/g;
  const headers = [];
  let m;
  while ((m = monthRe.exec(md)) !== null) {
    headers.push({ index: m.index, num: m[1], label: m[2].trim() });
  }

  for (let i = 0; i < headers.length; i++) {
    const start = headers[i].index;
    const end = headers[i + 1] ? headers[i + 1].index : md.length;
    const chunk = md.slice(start, end);
    const goalMatch = chunk.match(/\*\*Goal:\*\*\s*(.+)/);
    const goal = goalMatch ? goalMatch[1].trim() : '';
    const milestones = [];
    const lines = chunk.split('\n');
    for (const line of lines) {
      const mile = line.match(/^\s*-\s*\[([ xX])\]\s*(.+)$/);
      if (!mile) continue;
      const done = mile[1].toLowerCase() === 'x';
      let text = mile[2].trim();
      let owner = '';
      let due = '';
      const om = text.match(/^(.+?)\s*\(\s*owner:\s*([^·]+)\s*·\s*due:\s*([^)]+)\)\s*$/);
      if (om) {
        text = om[1].trim();
        owner = om[2].trim();
        due = om[3].trim();
      }
      milestones.push({ text, owner, due, done });
    }
    plan.months.push({
      monthNum: parseInt(headers[i].num, 10),
      monthLabel: headers[i].label,
      goal,
      milestones
    });
  }

  const betsSec = md.match(/## Bets\s*\n([\s\S]*?)(?=\n## Risks|\s*$)/);
  if (betsSec) {
    plan.bets = betsSec[1]
      .split('\n')
      .filter((l) => /^\s*\d+\./.test(l))
      .map((l) => l.replace(/^\s*\d+\.\s*/, '').replace(/\*\*/g, '').trim())
      .filter(Boolean);
  }

  const risksSec = md.match(/## Risks\s*\n([\s\S]*?)$/);
  if (risksSec) {
    plan.risks = risksSec[1]
      .split('\n')
      .filter((l) => /^\s*-\s+/.test(l))
      .map((l) => l.replace(/^\s*-\s*/, '').replace(/\*\*/g, '').trim())
      .filter(Boolean);
  }

  let total = 0;
  let done = 0;
  plan.months.forEach((mo) => {
    mo.milestones.forEach((ms) => {
      total += 1;
      if (ms.done) done += 1;
    });
  });
  plan.stats = { total, done };

  return plan;
}

function formatPlanBlock(plan) {
  const json = JSON.stringify(plan, null, 2);
  const indented = json.split('\n').map((line) => '    ' + line).join('\n');
  return `  ${MARK_START}\n  plan:\n${indented},\n  ${MARK_END}`;
}

function injectPlanIntoDataJs(content, plan) {
  const block = formatPlanBlock(plan);
  const re = new RegExp(
    `\\s*${MARK_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${MARK_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`,
    'm'
  );
  if (re.test(content)) {
    return content.replace(re, '\n' + block + '\n');
  }
  // Fallback: insert before closing }; of PortalData (last occurrence pattern)
  const insertRe = /(\n\s*recentActivity:\s*\[[\s\S]*?\]\s*)(\n\};)/;
  if (insertRe.test(content)) {
    return content.replace(insertRe, '$1\n' + block + '$2');
  }
  throw new Error('Could not find plan markers or recentActivity block in data file. Add /* BEGIN_COMPILED_PLAN */ ... /* END_COMPILED_PLAN */.');
}

module.exports = {
  parse90DayPlan,
  injectPlanIntoDataJs,
  formatPlanBlock,
  MARK_START,
  MARK_END
};

/* ── Run ── */
if (require.main === module) {
  const fullPortalSync = path.join(__dirname, 'sync-portal-data.js');
  if (fs.existsSync(fullPortalSync)) {
    try {
      require(fullPortalSync).syncPortalData();
    } catch (e) {
      console.error('❌ ', e.message || e);
      process.exit(1);
    }
    process.exit(0);
  }

  if (!fs.existsSync(INPUT_PATH)) {
    console.error('❌  Missing', INPUT_PATH);
    console.error('    Create inputs/90-day-plan.md first (see references/ycc-90-day-plan.md).');
    process.exit(1);
  }

  if (!fs.existsSync(DATA_PATH)) {
    console.error('❌  Data file not found:', DATA_PATH);
    process.exit(1);
  }

  const rawMd = fs.readFileSync(INPUT_PATH, 'utf8');
  const plan = parse90DayPlan(rawMd);

  if (!plan.business && !plan.northStar && plan.months.length === 0) {
    console.error('❌  Parsed plan is empty — check markdown format.');
    process.exit(1);
  }

  let dataJs = fs.readFileSync(DATA_PATH, 'utf8');
  dataJs = injectPlanIntoDataJs(dataJs, plan);
  fs.writeFileSync(DATA_PATH, dataJs, 'utf8');

  console.log('✅  Plan synced to', path.relative(process.cwd(), DATA_PATH));
  console.log('   Business:', plan.business || '(—)');
  console.log('   Period:  ', plan.period || '(—)');
  console.log('   Milestones:', plan.stats.done + '/' + plan.stats.total, 'complete');
  console.log('');
  console.log('   Reload planning.html or index.html to see updates.');
}
