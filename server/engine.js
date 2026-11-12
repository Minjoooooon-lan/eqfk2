import { CHAPTERS } from './story/index.js';
import { getCareer } from './careers.js';

export const STAT_KEYS = ['mastery', 'network', 'resilience', 'resources', 'impact', 'reputation'];

export const STAT_LABELS = {
  mastery: 'Mastery',
  network: 'Network',
  resilience: 'Resilience',
  resources: 'Resources',
  impact: 'Impact',
  reputation: 'Reputation',
};

export const SKILL_LABELS = {
  craft: 'Core craft',
  systems: 'Systems thinking',
  communication: 'Communication',
  leadership: 'Leadership',
  product: 'Product sense',
  finance: 'Financial judgement',
  impact: 'Impact literacy',
  network: 'Relationship building',
};

export const BASE_STATS = {
  mastery: 20,
  network: 15,
  resilience: 22,
  resources: 18,
  impact: 16,
  reputation: 12,
};

export const BASE_SKILLS = {
  craft: 6,
  systems: 4,
  communication: 8,
  leadership: 3,
  product: 4,
  finance: 3,
  impact: 5,
  network: 5,
};

const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Number(n) || 0));
const now = () => new Date().toISOString();

export class GameError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function renderText(text, ctx) {
  return String(text || '').replace(/\{\{([\w.]+)\}\}/g, (match, key) => {
    const value = key.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), ctx);
    return value == null ? match : String(value);
  });
}

export function contextFor(state) {
  const career = getCareer(state.careerId) || {
    label: state.careerLabel,
    craft: 'your craft',
    entryRole: 'junior team member',
    artifact: 'something real',
    team: 'a small team',
    tool: 'the usual tools',
    field: 'your field',
    mentor: { name: 'your mentor', role: 'mentor' },
  };
  return {
    ...career,
    career: career.label,
    careerLabel: state.careerLabel || career.label,
    playerName: state.playerName || 'you',
  };
}

export function createRunState({ careerId, playerName }) {
  const career = getCareer(careerId);
  if (!career) throw new GameError('Pick a career from the list to begin.', 400);
  const name = String(playerName || '').trim().slice(0, 40);
  const chapter = CHAPTERS[0];
  return {
    version: 1,
    careerId: career.id,
    careerLabel: career.label,
    playerName: name || 'You',
    chapterIndex: 0,
    nodeId: chapter.start,
    finished: false,
    stats: { ...BASE_STATS },
    skills: { ...BASE_SKILLS },
    flags: {},
    decisions: [],
    achievements: [],
    challenges: [],
    goals: [],
    timeline: [
      {
        year: '2026',
        label: 'The starting line',
        note: `You chose to explore ${career.label.toLowerCase()} — not a promise, just a direction.`,
      },
    ],
    createdAt: now(),
    updatedAt: now(),
  };
}

export function test(cond, state) {
  if (!cond) return true;
  if (Array.isArray(cond)) return cond.every((c) => test(c, state));
  if (cond.all) return cond.all.every((c) => test(c, state));
  if (cond.any) return cond.any.some((c) => test(c, state));
  if (cond.not) return !test(cond.not, state);
  if (cond.flag) {
    const value = Boolean(state.flags[cond.flag]);
    return cond.equals === undefined ? value : value === cond.equals;
  }
  if (cond.stat) {
    const value = state.stats[cond.stat] ?? 0;
    if (cond.gte != null) return value >= cond.gte;
    if (cond.lte != null) return value <= cond.lte;
  }
  if (cond.skill) {
    const value = state.skills[cond.skill] ?? 0;
    if (cond.gte != null) return value >= cond.gte;
    if (cond.lte != null) return value <= cond.lte;
  }
  if (cond.grade) {
    return state.challenges.some((c) => c.grade === cond.grade);
  }
  return true;
}

export function currentChapter(state) {
  return CHAPTERS[state.chapterIndex] || null;
}

function currentNode(state) {
  const chapter = currentChapter(state);
  if (!chapter) return null;
  return chapter.nodes[state.nodeId] || null;
}

export function resolveScene(state) {
  const chapter = currentChapter(state);
  if (!chapter) return null;
  const node = currentNode(state);
  if (!node) return null;
  const ctx = contextFor(state);

  const blocks = [...(node.blocks || [])];
  for (const variant of node.variants || []) {
    if (test(variant.when, state)) blocks.push(...(variant.blocks || []));
  }

  const choices = (node.choices || [])
    .filter((c) => !c.requires || test(c.requires, state))
    .filter((c) => !c.hideWhen || !test(c.hideWhen, state))
    .map((c) => ({ id: c.id, label: c.label, hint: c.hint || '', tone: c.tone || 'default' }));

  const game = node.minigame
    ? {
        id: node.minigame.id,
        type: node.minigame.type,
        title: node.minigame.title,
        brief: renderText(node.minigame.brief, ctx),
        skill: node.minigame.skill || 'craft',
        config: node.minigame.config || {},
      }
    : null;

  return {
    chapter: {
      id: chapter.id,
      number: chapter.number,
      title: chapter.title,
      years: chapter.years,
      theme: chapter.theme,
      art: chapter.art,
      total: CHAPTERS.length,
    },
    node: {
      id: state.nodeId,
      title: node.title,
      year: node.year,
      location: node.location,
      art: node.art || chapter.art,
      blocks: blocks.map((b) => ({
        type: b.type || 'scene',
        speaker: renderText(b.speaker || '', ctx),
        role: renderText(b.role || '', ctx),
        text: renderText(b.text, ctx),
      })),
      minigame: game,
      choices,
    },
    finished: Boolean(state.finished),
    progress: progressOf(state),
  };
}

export function progressOf(state) {
  return {
    chapterIndex: state.chapterIndex,
    chapterNumber: Math.min(state.chapterIndex + 1, CHAPTERS.length),
    totalChapters: CHAPTERS.length,
    ratio: Math.min(1, state.chapterIndex / CHAPTERS.length),
    finished: Boolean(state.finished),
  };
}

export function applyEffects(state, effects) {
  if (!effects) return { stats: {}, skills: {} };
  const statsDelta = {};
  const skillsDelta = {};

  for (const [key, delta] of Object.entries(effects.stats || {})) {
    if (!STAT_KEYS.includes(key)) continue;
    const before = state.stats[key] ?? 0;
    state.stats[key] = clamp(before + Number(delta || 0));
    statsDelta[key] = state.stats[key] - before;
  }

  for (const [key, delta] of Object.entries(effects.skills || {})) {
    const before = state.skills[key] ?? 0;
    state.skills[key] = clamp(before + Number(delta || 0));
    skillsDelta[key] = state.skills[key] - before;
  }

  for (const [key, value] of Object.entries(effects.flags || {})) {
    state.flags[key] = value;
  }

  for (const achievement of effects.achievements || []) {
    addAchievement(state, achievement);
  }

  return { stats: statsDelta, skills: skillsDelta };
}

export function addAchievement(state, achievement) {
  if (!achievement || !achievement.id) return false;
  if (state.achievements.some((a) => a.id === achievement.id)) return false;
  state.achievements.push({
    id: achievement.id,
    title: achievement.title,
    blurb: achievement.blurb || '',
    at: now(),
  });
  return true;
}

function advance(state, next) {
  if (!next || next === '__chapter_end__') {
    state.chapterIndex += 1;
    const chapter = CHAPTERS[state.chapterIndex];
    if (!chapter) {
      state.finished = true;
      state.nodeId = '__done__';
      addAchievement(state, {
        id: 'ten-years',
        title: 'Ten years, played forward',
        blurb: 'You reached 2036 with a story that is entirely yours.',
      });
      return;
    }
    state.nodeId = chapter.start;
    return;
  }
  state.nodeId = next;
}

export function applyChoice(state, nodeId, choiceId) {
  const chapter = currentChapter(state);
  const node = currentNode(state);
  if (!chapter || !node) throw new GameError('This run has already reached 2036.', 409);
  if (nodeId && nodeId !== state.nodeId) {
    throw new GameError('That decision belongs to an earlier scene. Reload and try again.', 409);
  }
  const choice = (node.choices || []).find((c) => c.id === choiceId);
  if (!choice) throw new GameError('That option is not available here.', 400);
  if (choice.requires && !test(choice.requires, state)) {
    throw new GameError('That option is not open to you yet.', 400);
  }

  const deltas = applyEffects(state, choice.effects);
  state.decisions.push({
    chapter: chapter.number,
    chapterTitle: chapter.title,
    nodeId: state.nodeId,
    choiceId: choice.id,
    label: renderText(choice.label, contextFor(state)),
    year: node.year,
    at: now(),
  });

  if (choice.timeline) {
    state.timeline.push({
      year: choice.timeline.year || node.year,
      label: renderText(choice.timeline.label, contextFor(state)),
      note: renderText(choice.timeline.note || '', contextFor(state)),
    });
  }

  advance(state, choice.next);
  state.updatedAt = now();

  const outcome = choice.outcome
    ? {
        title: renderText(choice.outcome.title, contextFor(state)),
        text: renderText(choice.outcome.text, contextFor(state)),
        stats: deltas.stats,
        skills: deltas.skills,
      }
    : { title: 'Noted', text: '', stats: deltas.stats, skills: deltas.skills };

  return { outcome, scene: resolveScene(state) };
}

export function gradeFor(score, minigame) {
  const thresholds = minigame.thresholds || { S: 85, A: 70, B: 50 };
  const value = clamp(score);
  if (value >= thresholds.S) return 'S';
  if (value >= thresholds.A) return 'A';
  if (value >= thresholds.B) return 'B';
  return 'C';
}

export const GRADE_LABELS = {
  S: 'Exceptional',
  A: 'Strong',
  B: 'Serviceable',
  C: 'Rough',
};

export function applyChallenge(state, { nodeId, gameId, score, meta }) {
  const chapter = currentChapter(state);
  const node = currentNode(state);
  if (!chapter || !node) throw new GameError('This run has already reached 2036.', 409);
  if (nodeId && nodeId !== state.nodeId) {
    throw new GameError('That challenge belongs to an earlier scene.', 409);
  }
  const minigame = node.minigame;
  if (!minigame) throw new GameError('There is no challenge at this point in the story.', 400);
  if (gameId && minigame.id !== gameId) {
    throw new GameError('Unexpected challenge for this scene.', 400);
  }

  const grade = gradeFor(score, minigame);
  const branch = minigame.grades?.[grade] || {};
  const deltas = applyEffects(state, branch.effects);

  state.challenges.push({
    id: minigame.id,
    title: renderText(minigame.title, contextFor(state)),
    chapter: chapter.number,
    score: clamp(score),
    grade,
    at: now(),
  });

  state.decisions.push({
    chapter: chapter.number,
    chapterTitle: chapter.title,
    nodeId: state.nodeId,
    choiceId: `challenge:${minigame.id}`,
    label: `${renderText(minigame.title, contextFor(state))} — ${GRADE_LABELS[grade]}`,
    year: node.year,
    at: now(),
  });

  advance(state, branch.next || minigame.next);
  state.updatedAt = now();

  return {
    grade,
    gradeLabel: GRADE_LABELS[grade],
    score: clamp(score),
    outcome: {
      title: renderText(branch.outcome?.title || 'Challenge complete', contextFor(state)),
      text: renderText(branch.outcome?.text || '', contextFor(state)),
      stats: deltas.stats,
      skills: deltas.skills,
    },
    meta: typeof meta === 'string' ? meta.slice(0, 200) : null,
    scene: resolveScene(state),
  };
}

export function skillLevel(xp) {
  const value = Number(xp) || 0;
  if (value >= 70) return { level: 5, label: 'Deep' };
  if (value >= 52) return { level: 4, label: 'Strong' };
  if (value >= 34) return { level: 3, label: 'Working' };
  if (value >= 18) return { level: 2, label: 'Developing' };
  return { level: 1, label: 'Starting' };
}

export function chapterList() {
  return CHAPTERS.map((c) => ({
    id: c.id,
    number: c.number,
    title: c.title,
    years: c.years,
    theme: c.theme,
    art: c.art,
  }));
}

export { CHAPTERS };
