#!/usr/bin/env node
/**
 * sync-session-notes.js
 * Reads session-notes.md → parses new account → appends to inputs/pipeline.md → runs sync-portal-data.js.
 *
 * Usage (from portal/): node skills/sync-session-notes.js
 *
 * Expected session-notes.md format:
 *   Account: [name]
 *   Type: specialty grocer | farmers market | cafe | bakery | restaurant | distributor
 *   State: [2-letter state]
 *   Contact: [name]
 *   SKUs: YCC-001, YCC-003   (optional)
 *   Notes: [free text]
 */

const fs = require('fs');
const path = require('path');

const NOTES_PATH = path.join(__dirname, 'session-notes.md');
const {
  readJsonFence,
  writePipelineInputs,
  syncPortalData,
  INPUTS
} = require('./sync-portal-data');

const PIPELINE_PATH = path.join(INPUTS, 'pipeline.md');

if (!fs.existsSync(NOTES_PATH)) {
  console.error('❌  session-notes.md not found at:', NOTES_PATH);
  process.exit(1);
}

const raw = fs.readFileSync(NOTES_PATH, 'utf8');

function field(key) {
  var match = raw.match(new RegExp('^' + key + ':\\s*(.+)$', 'im'));
  return match ? match[1].trim() : '';
}

const name = field('Account');
const type = field('Type').toLowerCase();
const state = field('State').toUpperCase();
const contact = field('Contact');
const skuRaw = field('SKUs');
const skus = skuRaw ? skuRaw.split(',').map(function (s) { return s.trim(); }).filter(Boolean) : [];

if (!name) {
  console.error('❌  Could not parse "Account:" from session-notes.md');
  process.exit(1);
}

const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const today = new Date().toISOString().slice(0, 10);
const newAccount = { id, name, type, state, status: 'prospect', contact, last_contact: today, skus };

let pipelinePayload;
try {
  pipelinePayload = readJsonFence(PIPELINE_PATH);
} catch (e) {
  console.error('❌ ', e.message || e);
  process.exit(1);
}

if (!pipelinePayload.accounts || !Array.isArray(pipelinePayload.accounts)) {
  console.error('❌  pipeline.md must contain a JSON block with an "accounts" array.');
  process.exit(1);
}

pipelinePayload.accounts.push(newAccount);
writePipelineInputs(pipelinePayload);
syncPortalData();

console.log('✅  Account appended to inputs/pipeline.md and portal data regenerated.');
console.log('   Name:    ', name);
console.log('   Type:    ', type);
console.log('   State:   ', state);
console.log('   Contact: ', contact);
console.log('   SKUs:    ', skus.join(', ') || '(none yet)');
console.log('');
console.log('   Reload pipeline.html to see the update.');
