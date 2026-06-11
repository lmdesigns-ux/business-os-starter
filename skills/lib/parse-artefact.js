/**
 * Scan inputs/artefacts/ for workshop and process-map markdown files.
 * Each file must have a ```json metadata fence with id, title, type, status.
 */
const fs = require('fs');
const path = require('path');

const VALID_TYPES = new Set(['workshop', 'process_map']);
const VALID_STATUSES = new Set(['draft', 'review', 'ready']);
const REQUIRED = ['id', 'title', 'type', 'status', 'updated'];

function extractJsonFence(md, filePath) {
  const m = md.match(/```(?:json)?\s*\n([\s\S]*?)```/);
  if (!m) {
    throw new Error('No ```json fenced block in ' + filePath);
  }
  try {
    return JSON.parse(m[1].trim());
  } catch (e) {
    throw new Error('Invalid JSON in ' + filePath + ': ' + e.message);
  }
}

function validateMeta(meta, filePath) {
  for (const key of REQUIRED) {
    if (!meta[key] || String(meta[key]).trim() === '') {
      throw new Error('Missing required field "' + key + '" in ' + filePath);
    }
  }
  if (!VALID_TYPES.has(meta.type)) {
    throw new Error('Invalid type "' + meta.type + '" in ' + filePath + ' (expected workshop or process_map)');
  }
  if (!VALID_STATUSES.has(meta.status)) {
    throw new Error('Invalid status "' + meta.status + '" in ' + filePath + ' (expected draft, review, or ready)');
  }
}

function scanDir(artefactsRoot, subdir) {
  const dir = path.join(artefactsRoot, subdir);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const filePath = path.join(dir, f);
      const relPath = path.posix.join(subdir, f);
      const md = fs.readFileSync(filePath, 'utf8');
      const meta = extractJsonFence(md, relPath);
      validateMeta(meta, relPath);

      return {
        id: meta.id,
        title: meta.title,
        type: meta.type,
        status: meta.status,
        path: relPath,
        tags: meta.tags || [],
        sku: meta.sku || null,
        duration: meta.duration || null,
        audience: meta.audience || null,
        scope: meta.scope || null,
        externalUrl: meta.externalUrl || null,
        updated: meta.updated
      };
    });
}

function scanArtefacts(root) {
  const artefactsRoot = path.join(root, 'inputs', 'artefacts');
  if (!fs.existsSync(artefactsRoot)) return [];

  const items = [
    ...scanDir(artefactsRoot, 'workshops'),
    ...scanDir(artefactsRoot, 'process-maps')
  ];

  const seen = new Map();
  for (const item of items) {
    if (seen.has(item.id)) {
      throw new Error('Duplicate artefact id "' + item.id + '" in ' + seen.get(item.id) + ' and ' + item.path);
    }
    seen.set(item.id, item.path);
  }

  items.sort((a, b) => {
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    return a.title.localeCompare(b.title);
  });

  return items;
}

module.exports = { scanArtefacts, extractJsonFence, validateMeta };
