/**
 * Moxie invoice PDF text parsing and HelloFresh project mapping.
 */

const HF_PROJECTS = [
  'DIY Program',
  'UX Research Ad Hoc',
  'Competitor Tracker',
  'Deep Dives'
];

function parseMoney(v) {
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

function parseMoxieDate(raw) {
  if (!raw) return null;
  const d = new Date(String(raw).trim());
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function durationToHours(duration) {
  const m = String(duration || '').match(/(\d+):(\d+):(\d+)/);
  if (!m) return 0;
  return parseInt(m[1], 10) + parseInt(m[2], 10) / 60 + parseInt(m[3], 10) / 3600;
}

function mapHfProject(description) {
  const d = String(description || '').trim().toLowerCase();
  if (!d) return null;
  for (const name of HF_PROJECTS) {
    if (d === name.toLowerCase() || d.includes(name.toLowerCase())) return name;
  }
  if (/diy/i.test(d)) return 'DIY Program';
  if (/ux research|ad hoc/i.test(d)) return 'UX Research Ad Hoc';
  if (/competitor/i.test(d)) return 'Competitor Tracker';
  if (/deep dive/i.test(d)) return 'Deep Dives';
  return String(description || '').trim() || null;
}

function isHelloFreshInvoice(num, client) {
  const n = String(num || '').toUpperCase();
  const c = String(client || '').toLowerCase();
  return /^H[FU]-/.test(n) || /hellofresh|grocery delivery/.test(c);
}

function normalizeInvoiceNumber(raw) {
  const s = String(raw || '').trim();
  const m = s.match(/[A-Z]{2,}-\d{4}-\d+/i);
  return m ? m[0].toUpperCase() : s.toUpperCase();
}

function parseMoxieInvoiceText(text, filename) {
  const lines = String(text)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const joined = lines.join('\n');
  const fromFilename = (filename || '').replace(/\.pdf$/i, '');
  const invoiceMatch = joined.match(/Invoice:\s*(\S+)/i);
  const invoice_number = normalizeInvoiceNumber(invoiceMatch ? invoiceMatch[1] : fromFilename);

  const totalMatch = joined.match(/^Total:\s*\$?([\d,]+\.?\d*)/im);
  const issuedMatch = joined.match(/Issued:\s*(.+)/i);
  const dueMatch = joined.match(/Due:\s*(.+)/i);

  let client = '';
  const billToIdx = lines.findIndex((l) => /^bill to:?$/i.test(l));
  if (billToIdx >= 0 && lines[billToIdx + 1]) {
    client = lines[billToIdx + 1];
  }

  const headerIdx = lines.findIndex((l) => /^description\s+qty\s+rate\s+total$/i.test(l));
  const line_items = [];
  let currentItem = null;

  const lineItemRe = /^(.+?)\s+(\d+(?:\.\d+)?)\s+\$?([\d,]+\.?\d*)\s+\$?([\d,]+\.?\d*)$/;
  const timeEntryRe = /^([A-Za-z]{3}\s+\d{1,2})\s*[•·]\s*(\d{2}:\d{2}:\d{2})\s*[•·]\s*(.+)$/;

  const stopRe = /^(sub\s*total|total|payment instructions|thank you)/i;

  for (let i = headerIdx >= 0 ? headerIdx + 1 : 0; i < lines.length; i++) {
    const line = lines[i];
    if (stopRe.test(line)) break;

    const timeMatch = line.match(timeEntryRe);
    if (timeMatch && currentItem) {
      const year = issuedMatch ? new Date(issuedMatch[1].trim()).getFullYear() : new Date().getFullYear();
      const dateStr = parseMoxieDate(timeMatch[1] + ' ' + year);
      currentItem.time_entries.push({
        date: dateStr,
        duration_hrs: Math.round(durationToHours(timeMatch[2]) * 100) / 100,
        note: timeMatch[3].trim()
      });
      continue;
    }

    const itemMatch = line.match(lineItemRe);
    if (itemMatch && headerIdx >= 0) {
      currentItem = {
        project_or_description: itemMatch[1].trim(),
        project: mapHfProject(itemMatch[1]),
        qty_hours: parseFloat(itemMatch[2]),
        rate: parseMoney(itemMatch[3]),
        amount: parseMoney(itemMatch[4]),
        time_entries: []
      };
      line_items.push(currentItem);
      continue;
    }
  }

  const total = totalMatch ? parseMoney(totalMatch[1]) : line_items.reduce((s, li) => s + li.amount, 0);

  return {
    invoice_number,
    client,
    issued: issuedMatch ? parseMoxieDate(issuedMatch[1]) : null,
    due: dueMatch ? parseMoxieDate(dueMatch[1]) : null,
    total,
    line_items,
    is_hellofresh: isHelloFreshInvoice(invoice_number, client)
  };
}

function aggregateInvoiceDetails(invoicesByNumber, options = {}) {
  const now = options.now || new Date();
  const qStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

  const revenue_by_project = {};
  for (const name of HF_PROJECTS) revenue_by_project[name] = 0;

  let billed_hours_qtd = 0;
  let hf_revenue_qtd = 0;
  const recentHfTotals = [];

  for (const inv of Object.values(invoicesByNumber)) {
    if (!inv.is_hellofresh) continue;

    const invDate = inv.issued ? new Date(inv.issued) : null;
    const inQtd = invDate && !Number.isNaN(invDate.getTime()) && invDate >= qStart;

    for (const li of inv.line_items || []) {
      const project = li.project || mapHfProject(li.project_or_description);
      if (project && HF_PROJECTS.includes(project)) {
        if (inQtd) revenue_by_project[project] = (revenue_by_project[project] || 0) + li.amount;
      }
      if (inQtd) {
        billed_hours_qtd += li.qty_hours || 0;
        hf_revenue_qtd += li.amount || 0;
      }
    }

    if (invDate && !Number.isNaN(invDate.getTime()) && invDate >= threeMonthsAgo) {
      recentHfTotals.push({ date: invDate, total: inv.total || 0 });
    }
  }

  recentHfTotals.sort((a, b) => b.date - a.date);
  const last3 = recentHfTotals.slice(0, 3);
  const hf_forecast_monthly =
    last3.length > 0
      ? Math.round(last3.reduce((s, x) => s + x.total, 0) / last3.length)
      : null;

  const effective_rate =
    billed_hours_qtd > 0 ? Math.round((hf_revenue_qtd / billed_hours_qtd) * 100) / 100 : null;

  return {
    revenue_by_project,
    billed_hours_qtd: Math.round(billed_hours_qtd * 10) / 10,
    hf_revenue_qtd: Math.round(hf_revenue_qtd),
    effective_rate,
    hf_forecast_monthly
  };
}

module.exports = {
  HF_PROJECTS,
  mapHfProject,
  isHelloFreshInvoice,
  normalizeInvoiceNumber,
  parseMoxieInvoiceText,
  aggregateInvoiceDetails,
  parseMoney
};
