#!/usr/bin/env node
/**
 * Regression tests for Moxie Time Tracked row parsing.
 * Run: node skills/test/moxie-time.test.js
 */

const assert = require('assert');
const path = require('path');
const {
  parseHours,
  parseTimeRowHours,
  parseTimeRowDate,
  parseRowDate
} = require('../lib/moxie-time');

const MOXIE_SAMPLE_ROW = {
  Start: 45727.52013888889,
  End: 45727.540972222225,
  Duration: '00:30:00',
  'Dur. Seconds': 1800,
  User: 'Lanita McCullerses',
  Status: 'Billed',
  Client: 'Grocery Delivery E-Services USA Inc.',
  Project: 'UX Research Ad Hoc',
  Deliverable: '',
  Notes: '',
  Billable: 'Yes'
};

assert.strictEqual(parseHours('00:30:00'), 0.5, 'HH:MM:SS → decimal hours');
assert.strictEqual(parseHours('01:00:00'), 1);
assert.strictEqual(parseHours('05:00:00'), 5);
assert.notStrictEqual(parseHours('00:30:00'), 3000, 'must not strip colons to 003000');

assert.strictEqual(parseTimeRowHours(MOXIE_SAMPLE_ROW), 0.5, 'prefers Dur. Seconds over Duration');

const durationOnly = { Duration: '02:15:00' };
assert.strictEqual(parseTimeRowHours(durationOnly), 2.25, 'Duration HH:MM:SS when no seconds col');

const hoursCol = { hours: 3.5 };
assert.strictEqual(parseTimeRowHours(hoursCol), 3.5, 'numeric hours column');

const date = parseTimeRowDate(MOXIE_SAMPLE_ROW);
assert(date instanceof Date && !Number.isNaN(date.getTime()), 'Start Excel serial → Date');
assert.strictEqual(date.getUTCFullYear(), 2025, 'Start serial maps to 2025');

const iso = parseRowDate('2026-04-15');
assert.strictEqual(iso.getFullYear(), 2026);
assert.strictEqual(iso.getMonth(), 3);

// Integration: parseWorkbook retainer hours from real export when present
const exportDir = path.join(__dirname, '..', '..', 'operations', 'moxie', 'exports');
const fs = require('fs');
const { parseWorkbook } = require('../sync-moxie-export');
const xlsxFiles = fs.existsSync(exportDir)
  ? fs.readdirSync(exportDir).filter((f) => /\.xlsx$/i.test(f))
  : [];
if (xlsxFiles.length) {
  const exportFile = path.join(exportDir, xlsxFiles[0]);
  const parsed = parseWorkbook(exportFile);
  const logged = parsed.retainer.hours_logged_qtd;
  assert(logged > 0 && logged < 500, 'QTD logged hours should be realistic, got ' + logged);
  assert.strictEqual(parsed.retainer.hours_billed_qtd, 15.5, 'billed hours unchanged');
}

console.log('✅  moxie-time.test.js passed');
