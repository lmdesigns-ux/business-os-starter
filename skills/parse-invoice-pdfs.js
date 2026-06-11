#!/usr/bin/env node
/**
 * parse-invoice-pdfs.js
 *
 * Parses Moxie invoice PDFs from operations/moxie/invoices/
 * → operations/moxie/invoice-detail.json
 *
 * Usage (repo root):
 *   npm install
 *   node skills/parse-invoice-pdfs.js
 *
 * Optional: MOXIE_INVOICES_DIR=/path/to/pdfs
 */

const fs = require('fs');
const path = require('path');
const { parseMoxieInvoiceText } = require('./lib/invoice-pdf');
const { normalizeClientName } = require('./sync-moxie-export');

const ROOT = path.join(__dirname, '..');
const DEFAULT_INVOICES_DIR = path.join(ROOT, 'operations', 'moxie', 'invoices');
const OUT_PATH = path.join(ROOT, 'operations', 'moxie', 'invoice-detail.json');

function findInvoicesDir() {
  const env = process.env.MOXIE_INVOICES_DIR;
  if (env && fs.existsSync(env)) return env;
  return DEFAULT_INVOICES_DIR;
}

async function parsePdfFile(filePath) {
  const { PDFParse } = require('pdf-parse');
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buffer });
  let text = '';
  try {
    const result = await parser.getText();
    text = result.text || '';
  } finally {
    if (typeof parser.destroy === 'function') await parser.destroy();
  }
  const filename = path.basename(filePath);
  const parsed = parseMoxieInvoiceText(text, filename);
  parsed.client = normalizeClientName(parsed.client);
  parsed.source_file = filename;
  return parsed;
}

async function main() {
  const dir = findInvoicesDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.warn('⚠️  No invoices folder yet — created', path.relative(ROOT, dir));
    console.warn('   Drop PDFs named like HF-2025-6.pdf and re-run.');
    fs.writeFileSync(OUT_PATH, JSON.stringify({ invoices: {}, parsed_at: null }, null, 2) + '\n');
    return;
  }

  const pdfs = fs.readdirSync(dir).filter((f) => /\.pdf$/i.test(f));
  if (!pdfs.length) {
    console.warn('⚠️  No PDFs in', path.relative(ROOT, dir));
    if (!fs.existsSync(OUT_PATH)) {
      fs.writeFileSync(OUT_PATH, JSON.stringify({ invoices: {}, parsed_at: null }, null, 2) + '\n');
    }
    return;
  }

  const invoices = {};
  const warnings = [];

  for (const file of pdfs.sort()) {
    const filePath = path.join(dir, file);
    try {
      const parsed = await parsePdfFile(filePath);
      if (!parsed.invoice_number) {
        warnings.push(file + ': could not detect invoice number');
        continue;
      }
      if (!parsed.line_items.length && parsed.total === 0) {
        warnings.push(file + ': no line items parsed (fixed-fee format may need manual check)');
      }
      invoices[parsed.invoice_number] = parsed;
    } catch (e) {
      warnings.push(file + ': ' + (e.message || e));
    }
  }

  const payload = {
    parsed_at: new Date().toISOString().slice(0, 10),
    source_dir: dir,
    invoice_count: Object.keys(invoices).length,
    invoices
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2) + '\n', 'utf8');

  console.log('✅  Parsed', Object.keys(invoices).length, 'invoice PDF(s) from', path.relative(ROOT, dir));
  console.log('   →', path.relative(ROOT, OUT_PATH));
  for (const [num, inv] of Object.entries(invoices)) {
    const projects = [...new Set((inv.line_items || []).map((li) => li.project).filter(Boolean))];
    console.log('   ', num, '· $' + inv.total, projects.length ? '· ' + projects.join(', ') : '');
  }
  if (warnings.length) {
    console.log('');
    console.log('   Warnings:');
    warnings.forEach((w) => console.log('   -', w));
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error('❌ ', e.message || e);
    process.exit(1);
  });
}

module.exports = { parsePdfFile, findInvoicesDir, OUT_PATH };