import crypto from 'node:crypto';
import express from 'express';
import { all, get, run } from './db.js';
import { CAREERS, getCareer } from './careers.js';
import {
  GameError,
  CHAPTERS,
  chapterList,
  createRunState,
  resolveScene,
  applyChoice,
  applyChallenge,
  progressOf,
} from './engine.js';
import { buildReport } from './report.js';
import { askMentor, mentorConfigured, providerName, MentorUnavailable } from './ai.js';

export const api = express.Router();

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function newCode() {
  const bytes = crypto.randomBytes(12);
  let raw = '';
  for (let i = 0; i < 12; i += 1) raw += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
}

function newToken() {
  return crypto.randomBytes(24).toString('hex');
}

function normaliseCode(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 12)
    .replace(/(.{4})(?=.)/g, '$1-');
}

export function publicState(state) {
  return {
    careerId: state.careerId,
    careerLabel: state.careerLabel,
    playerName: state.playerName,
    stats: state.stats,
    skills: state.skills,
    decisions: state.decisions,
    achievements: state.achievements,
    challenges: state.challenges,
    goals: state.goals,
    timeline: state.timeline,
    finished: Boolean(state.finished),
    progress: progressOf(state),
  };
}

function rowToRun(row) {
  if (!row) return null;
  return {
    code: row.code,
    ownerToken: row.owner_token,
    state: JSON.parse(row.state_json),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function loadRun(code) {
  const normalised = normaliseCode(code);
  if (normalised.length < 12) throw new GameError('That save code does not look complete.', 400);
  const row = get('SELECT * FROM runs WHERE code = ?', [normalised]);
  if (!row) throw new GameError('No saved future found for that code.', 404);
  return rowToRun(row);
}

function saveRun(run) {
  const state = run.state;
  run.state.updatedAt = new Date().toISOString();
  run(state) // placeholder removed below
}

function logEvent(code, kind, { chapter, nodeId, label, payload } = {}) {
  run(
    'INSERT INTO run_events (code, kind, chapter_index, node_id, label, payload_json, created_at) VALUES (?,?,?,?,?,?,?)',
    [code, kind, chapter ?? null, nodeId ?? null, label ?? null, payload ? JSON.stringify(payload) : null, new Date().toISOString()],
  );
}

function persist(runRecord) {
  const state = runRecord.state;
  const updatedAt = new Date().toISOString();
  state.updatedAt = updatedAt;
  run(
    `UPDATE runs SET chapter_index = ?, node_id = ?, finished = ?, state_json = ?, updated_at = ?
     WHERE code = ?`,
    [
      state.chapterIndex,
      state.nodeId,
      state.finished ? 1 : 0,
      JSON.stringify(state),
      updatedAt,
      runRecord.code,
    ],
  );
}

// --- simple in-memory rate limiting -----------------------------------------
const buckets = new Map();
function rateLimit({ key, limit, windowMs }) {
  return (req, res, next) => {
    const id = `${key}:${req.ip}`;
    const now = Date.now();
    const bucket = buckets.get(id) || { count: 0, reset: now + windowMs };
    if (now > bucket.reset) {
      bucket.count = 0;
      bucket.reset = now + windowMs;
    }
    bucket.count += 1;
    buckets.set(id, bucket);
    if (bucket.count > limit) {
      res.status(429).json({ error: 'Too many requests. Give it a minute and try again.' });
      return;
    }
    next();
  };
}

const createLimiter = rateLimit({ key: 'create', limit: 40, windowMs: 60 * 60 * 1000 });
const mentorLimiter = rateLimit({ key: 'mentor', limit: 60, windowMs: 10 * 60 * 1000 });

function wrap(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// --- catalogue ---------------------------------------------------------------
api.get('/careers', (req, res) => {
  res.json({ careers: CAREERS.map(({ id, label, monogram, accent, tagline, field, entryRole }) => ({ id, label, monogram, accent, tagline, field, entryRole })) });
});

api.get('/story', (req, res) => {
  res.json({ chapters: chapterList() });
});

api.get('/health', (req, res) => {
  res.json({
    ok: true,
    mentorConfigured: mentorConfigured(),
    mentorProvider: providerName(),
    chapters: CHAPTERS.length,
  });
});

// --- runs --------------------------------------------------------------------
api.post(
  '/runs',
  createLimiter,
  wrap(async (req, res) => {
    const { careerId, playerName } = req.body || {};
    const state = createRunState({ careerId, playerName });
    const code = newCode();
    const token = newToken();
    const now = new Date().toISOString();
    run(
      `INSERT INTO runs (code, owner_token, player_name, career_id, career_label, chapter_index, node_id, finished, state_json, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [code, token, state.playerName, state.careerId, state.careerLabel, state.chapterIndex, state.nodeId, 0, JSON.stringify(state), now, now],
    );
    logEvent(code, 'run_created', { chapter: 0, nodeId: state.nodeId, label: state.careerLabel, payload: { playerName: state.playerName } });
    res.status(201).json({
      code,
      token,
      state: publicState(state),
      scene: resolveScene(state),
    });
  }),
);

api.get(
  '/runs',
  wrap(async (req, res) => {
    const token = String(req.query.token || '');
    if (!token) return res.json({ runs: [] });
    const rows = all(
      'SELECT code, player_name, career_label, chapter_index, finished, updated_at FROM runs WHERE owner_token = ? ORDER BY updated_at DESC LIMIT 20',
      [token],
    );
    res.json({
      runs: rows.map((row) => ({
        code: row.code,
        playerName: row.player_name,
        careerLabel: row.career_label,
        chapterNumber: Math.min(row.chapter_index + 1, CHAPTERS.length),
        totalChapters: CHAPTERS.length,
        finished: Boolean(row.finished),
        updatedAt: row.updated_at,
      })),
    });
  }),
);

api.get(
  '/runs/:code',
  wrap(async (req, res) => {
    const record = loadRun(req.params.code);
    res.json({
      code: record.code,
      state: publicState(record.state),
      scene: resolveScene(record.state),
      updatedAt: record.updatedAt,
    });
  }),
);

api.post(
  '/runs/:code/choice',
  wrap(async (req, res) => {
    const record = loadRun(req.params.code);
    const { nodeId, choiceId } = req.body || {};
    if (!choiceId) throw new GameError('Choose an option to continue.', 400);
    const result = applyChoice(record.state, nodeId, String(choiceId));
    persist(record);
    const decision = record.state.decisions[record.state.decisions.length - 1];
    logEvent(record.code, 'choice', {
      chapter: decision?.chapter,
      nodeId: decision?.nodeId,
      label: decision?.label,
      payload: { choiceId, outcome: result.outcome.title },
    });
    res.json({ ...result, state: publicState(record.state), code: record.code });
  }),
);

api.post(
  '/runs/:code/challenge',
  wrap(async (req, res) => {
    const record = loadRun(req.params.code);
    const { nodeId, gameId, score, meta } = req.body || {};
    if (typeof score !== 'number' || Number.isNaN(score)) {
      throw new GameError('A challenge needs a numeric score.', 400);
    }
    const result = applyChallenge(record.state, { nodeId, gameId, score, meta });
    persist(record);
    logEvent(record.code, 'challenge', {
      chapter: result.scene?.chapter?.number,
      nodeId,
      label: `${result.outcome.title} (${result.grade})`,
      payload: { gameId, score: result.score, grade: result.grade },
    });
    res.json({ ...result, state: publicState(record.state), code: record.code });
  }),
);

api.get(
  '/runs/:code/report',
  wrap(async (req, res) => {
    const record = loadRun(req.params.code);
    res.json({ report: buildReport(record.state, { code: record.code }) });
  }),
);

api.post(
  '/runs/:code/goals',
  wrap(async (req, res) => {
    const record = loadRun(req.params.code);
    const text = String(req.body?.text || '').trim().slice(0, 240);
    if (text.length < 3) throw new GameError('Write a goal of at least a few words.', 400);
    if ((record.state.goals || []).length >= 12) throw new GameError('You already have twelve goals saved. Finish one first.', 400);
    record.state.goals.push({
      id: crypto.randomBytes(6).toString('hex'),
      text,
      done: false,
      createdAt: new Date().toISOString(),
    });
    persist(record);
    logEvent(record.code, 'goal_added', { label: text });
    res.status(201).json({ state: publicState(record.state) });
  }),
);

api.patch(
  '/runs/:code/goals/:goalId',
  wrap(async (req, res) => {
    const record = loadRun(req.params.code);
    const goal = (record.state.goals || []).find((g) => g.id === req.params.goalId);
    if (!goal) throw new GameError('That goal no longer exists.', 404);
    if (typeof req.body?.done === 'boolean') goal.done = req.body.done;
    persist(record);
    res.json({ state: publicState(record.state) });
  }),
);

api.delete(
  '/runs/:code/goals/:goalId',
  wrap(async (req, res) => {
    const record = loadRun(req.params.code);
    record.state.goals = (record.state.goals || []).filter((g) => g.id !== req.params.goalId);
    persist(record);
    res.json({ state: publicState(record.state) });
  }),
);

// --- AI career mentor --------------------------------------------------------
api.get(
  '/mentor/history',
  wrap(async (req, res) => {
    const code = normaliseCode(req.query.code);
    if (!code) return res.json({ messages: [] });
    const rows = all(
      'SELECT role, content, created_at FROM mentor_messages WHERE code = ? ORDER BY id ASC LIMIT 60',
      [code],
    );
    res.json({
      messages: rows.map((row) => ({ role: row.role, content: row.content, createdAt: row.created_at })),
      mentorConfigured: mentorConfigured(),
    });
  }),
);

api.delete(
  '/mentor/history',
  wrap(async (req, res) => {
    const code = normaliseCode(req.query.code);
    if (code) run('DELETE FROM mentor_messages WHERE code = ?', [code]);
    res.json({ ok: true });
  }),
);

api.post(
  '/mentor/chat',
  mentorLimiter,
  wrap(async (req, res) => {
    const { code, messages, mode } = req.body || {};
    let record = null;
    if (code) {
      try {
        record = loadRun(code);
      } catch (error) {
        if (error.status !== 404) throw error;
      }
    }
    const result = await askMentor({ run: record, messages, mode });
    if (record) {
      const lastUser = [...(Array.isArray(messages) ? messages : [])].reverse().find((m) => m?.role === 'user');
      const now = new Date().toISOString();
      if (lastUser) {
        run('INSERT INTO mentor_messages (code, owner_token, role, content, created_at) VALUES (?,?,?,?,?)', [
          record.code,
          record.ownerToken,
          'user',
          String(lastUser.content).slice(0, 4000),
          now,
        ]);
      }
      run('INSERT INTO mentor_messages (code, owner_token, role, content, created_at) VALUES (?,?,?,?,?)', [
        record.code,
        record.ownerToken,
        'assistant',
        result.reply,
        new Date().toISOString(),
      ]);
    }
    res.json({ reply: result.reply, model: result.model, mentorConfigured: true });
  }),
);

// --- error handling ----------------------------------------------------------
export function apiErrorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err instanceof GameError) {
    return res.status(err.status || 400).json({ error: err.message });
  }
  if (err instanceof MentorUnavailable) {
    return res.status(err.status || 503).json({ error: err.message, code: err.code, mentorConfigured: mentorConfigured() });
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'That request body was not valid JSON.' });
  }
  console.error('[api] unhandled error', err);
  return res.status(500).json({ error: 'Something went wrong on our side. Your saved progress is safe.' });
}

export { loadRun, getCareer };
