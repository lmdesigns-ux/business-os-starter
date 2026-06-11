/**
 * Read / write JSON fenced blocks inside markdown inputs.
 */
const fs = require('fs');

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

function writeJsonFence(filePath, payload, introLines) {
  const inner = JSON.stringify(payload, null, 2);
  const header = introLines ? introLines.join('\n') + '\n\n' : '';
  const body = header + '```json\n' + inner + '\n```\n';
  fs.writeFileSync(filePath, body, 'utf8');
}

function updateJsonFence(filePath, payload) {
  const md = fs.readFileSync(filePath, 'utf8');
  const intro = md.split(/```(?:json)?\s*\n/)[0].trimEnd();
  const introLines = intro ? intro.split('\n') : ['# Updated'];
  writeJsonFence(filePath, payload, introLines);
}

module.exports = { readJsonFence, writeJsonFence, updateJsonFence };
