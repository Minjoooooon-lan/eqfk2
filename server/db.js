import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import initSqlJs from 'sql.js';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || path.join(here, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'futureyou.sqlite');

let db = null;
let flushTimer = null;
let flushInFlight = false;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS runs (
  code TEXT PRIMARY KEY,
  owner_token TEXT,
  player_name TEXT NOT NULL,
  career_id TEXT NOT NULL,
  career_label TEXT NOT NULL,
  chapter_index INTEGER NOT NULL DEFAULT 0,
  node_id TEXT NOT NULL,
  finished INTEGER NOT NULL DEFAULT 0,
  state_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS runs_owner_idx ON runs (owner_token, updated_at DESC);
CREATE TABLE IF NOT EXISTS run_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  kind TEXT NOT NULL,
  chapter_index INTEGER,
  node_id TEXT,
  label TEXT,
  payload_json TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS run_events_code_idx ON run_events (code, id);
CREATE TABLE IF NOT EXISTS mentor_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT,
  owner_token TEXT,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS mentor_messages_code_idx ON mentor_messages (code, id);
`;

function persistNow() {
  if (!db) return;
  flushInFlight = true;
  try {
    const bytes = Buffer.from(db.export());
    const tmp = `${DB_FILE}.tmp`;
    fs.writeFileSync(tmp, bytes);
    fs.renameSync(tmp, DB_FILE);
  } finally {
    flushInFlight = false;
  }
}

function scheduleFlush() {
  if (flushTimer || flushInFlight) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    try {
      persistNow();
    } catch (err) {
      console.error('[db] failed to persist database', err);
    }
  }, 60);
  if (typeof flushTimer.unref === 'function') flushTimer.unref();
}

export async function initDb() {
  if (db) return db;
  const wasmDir = path.join(path.dirname(require.resolve('sql.js/package.json')), 'dist');
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(wasmDir, file),
  });
  fs.mkdirSync(DATA_DIR, { recursive: true });
  db = fs.existsSync(DB_FILE) ? new SQL.Database(fs.readFileSync(DB_FILE)) : new SQL.Database();
  db.run('PRAGMA foreign_keys = ON;');
  db.run(SCHEMA);
  persistNow();
  return db;
}

export function all(sql, params = []) {
  const stmt = db.prepare(sql);
  try {
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    return rows;
  } finally {
    stmt.free();
  }
}

export function get(sql, params = []) {
  return all(sql, params)[0] || null;
}

export function run(sql, params = []) {
  const stmt = db.prepare(sql);
  try {
    stmt.bind(params);
    stmt.step();
  } finally {
    stmt.free();
  }
  scheduleFlush();
}

export function flush() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  persistNow();
}

export function dbFile() {
  return DB_FILE;
}
