/**
 * Moxie Time Tracked sheet parsing — hours and dates from workspace export rows.
 */

function normalizeHeader(h) {
  return String(h || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_');
}

/** Exact header match only (avoids "duration" matching alias "time"). */
function pickColExact(row, aliases) {
  const keys = Object.keys(row);
  for (const alias of aliases) {
    const hit = keys.find((k) => normalizeHeader(k) === alias);
    if (hit != null && row[hit] !== '') return row[hit];
  }
  return '';
}

function parseHours(v) {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  const s = String(v).trim();
  const hms = s.match(/^(\d+):(\d{1,2}):(\d{1,2})$/);
  if (hms) {
    return +hms[1] + +hms[2] / 60 + +hms[3] / 3600;
  }
  const n = parseFloat(s.replace(/[^0-9.]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

function excelSerialToDate(serial) {
  if (typeof serial !== 'number' || Number.isNaN(serial)) return null;
  const utcDays = Math.floor(serial - 25569);
  const date = new Date(utcDays * 86400 * 1000);
  const fractional = serial - Math.floor(serial);
  if (fractional > 0) {
    date.setUTCHours(0, 0, 0, 0);
    date.setTime(date.getTime() + Math.round(fractional * 86400 * 1000));
  }
  return date;
}

function parseRowDate(raw) {
  if (raw == null || raw === '') return null;
  if (typeof raw === 'number') {
    if (raw > 20000 && raw < 100000) return excelSerialToDate(raw);
    return null;
  }
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Hours from a Moxie Time Tracked row.
 * Prefers Dur. Seconds, then Duration (HH:MM:SS), then numeric hours columns.
 */
function parseTimeRowHours(row) {
  const keys = Object.keys(row);
  const secKey = keys.find((k) => {
    const n = normalizeHeader(k);
    return n === 'dur_seconds' || n === 'duration_seconds';
  });
  if (secKey != null && row[secKey] !== '') {
    const sec = Number(row[secKey]);
    if (!Number.isNaN(sec) && sec > 0) return sec / 3600;
  }

  const durVal = pickColExact(row, ['duration']);
  if (durVal !== '') {
    const h = parseHours(durVal);
    if (h > 0) return h;
  }

  const hoursVal = pickColExact(row, ['hours', 'billable_hours', 'quantity']);
  if (hoursVal !== '') return parseHours(hoursVal);

  return 0;
}

function parseTimeRowDate(row) {
  const raw = pickColExact(row, ['date', 'work_date', 'entry_date', 'start', 'start_date']);
  return parseRowDate(raw);
}

module.exports = {
  normalizeHeader,
  pickColExact,
  parseHours,
  parseRowDate,
  parseTimeRowHours,
  parseTimeRowDate,
  excelSerialToDate
};
