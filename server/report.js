import { SKILL_LABELS, STAT_LABELS, STAT_KEYS, skillLevel, CHAPTERS } from './engine.js';
import { getCareer } from './careers.js';

const DISCLAIMER =
  'This is not a prediction. It is one possible future, played forward from the choices you made in the simulator. Real careers bend around luck, health, money and people you have not met yet.';

function archetypeFor(state) {
  const f = state.flags || {};
  const s = state.stats || {};
  if (f.endingBuilder || (f.wentIndependent && (s.impact || 0) >= 60)) {
    return {
      name: 'The Builder',
      summary:
        'You kept choosing ownership over safety. Your strength is starting things and surviving the messy middle; your risk is carrying too much alone.',
      traits: ['Ownership', 'Tolerance for ambiguity', 'Self-direction'],
    };
  }
  if (f.endingMultiplier || f.becameManager) {
    return {
      name: 'The Multiplier',
      summary:
        'Your leverage came from other people. You get more done through a team than alone, and your reputation is now partly theirs.',
      traits: ['People development', 'Clear communication', 'Judgement under pressure'],
    };
  }
  if (f.endingSpecialist || f.becameSpecialist) {
    return {
      name: 'The Deep Specialist',
      summary:
        'You chose depth over visibility, twice. You are the person others route hard questions to, and your value compounds slowly and durably.',
      traits: ['Craft depth', 'Systems thinking', 'Patience'],
    };
  }
  if (f.choseFamily || f.tookBreak) {
    return {
      name: 'The Deliberate One',
      summary:
        'You treated your life as the constraint the career had to fit inside, not the other way round. That costs status and buys clarity.',
      traits: ['Prioritisation', 'Self-awareness', 'Sustainable pace'],
    };
  }
  return {
    name: 'The Generalist',
    summary:
      'You spread your bets: craft, people and life, without over-committing to any single identity. Flexible, and still deciding what to go deep on.',
    traits: ['Adaptability', 'Range', 'Curiosity'],
  };
}

function opportunitiesFor(state) {
  const f = state.flags || {};
  const out = [];
  if (f.negotiatedWell) out.push('You know how to negotiate. That skill transfers to every future offer, contract and budget conversation.');
  if (f.wentIndependent) out.push('Independent work is now a live option for you, not a fantasy: you have clients, pricing experience and a retainer.');
  if (f.launchedStrong) out.push('You have run a high-pressure launch. That is exactly the experience senior roles are hired for.');
  if (f.roughLaunch) out.push('You have a public failure with an honest post-mortem. That story is unusually credible in interviews.');
  if (f.boughtSupport) out.push('You have learned to buy capacity. That makes bigger roles survivable without pretending to do everything.');
  if (f.tookBreak) out.push('You have tested a career break and returned. Future sabbaticals are a known quantity rather than a fear.');
  if (f.choseFamily) out.push('You have built a local life. Remote or portfolio work near home is a realistic long-term structure.');
  if (f.becameManager) out.push('You have managed people. Internal moves into leadership, or into adjacent orgs, are now open.');
  if ((state.stats?.mastery || 0) >= 60) out.push('Your craft depth is high enough to teach, consult or specialise further without starting over.');
  if (!out.length) out.push('You have a full decade of decisions on record. Naming what you actually enjoyed is the next step.');
  return out.slice(0, 5);
}

function growthFor(state) {
  const skills = Object.entries(state.skills || {})
    .map(([key, xp]) => ({ key, xp, label: SKILL_LABELS[key] || key }))
    .sort((a, b) => a.xp - b.xp);
  const out = skills.slice(0, 2).map((s) => `${s.label}: still your thinnest area — it is the cheapest place to get better.`);
  const f = state.flags || {};
  if (f.negotiationMiss) out.push('Negotiation: you left value on the table once. Rehearse anchoring and silence before the next offer.');
  if (f.roughLaunch) out.push('Triage under pressure: practise deciding in the first five minutes instead of the first hour.');
  if (!f.negotiatedWell) out.push('Advocacy: you rarely made your case explicitly. Say the number, ask for the scope.');
  if ((state.skills?.network || 0) < 25) out.push('Network: your work is good, but too few people know it. Sponsor someone else and it comes back.');
  return [...new Set(out)].slice(0, 4);
}

export function buildReport(state, { code } = {}) {
  const career = getCareer(state.careerId) || { label: state.careerLabel || 'your field', tagline: '', accent: '#4ea1ff' };
  const archetype = archetypeFor(state);
  const skills = Object.entries(state.skills || {})
    .map(([key, xp]) => {
      const lvl = skillLevel(xp);
      return { key, label: SKILL_LABELS[key] || key, xp, level: lvl.level, levelLabel: lvl.label };
    })
    .sort((a, b) => b.xp - a.xp);

  const stats = STAT_KEYS.map((key) => ({
    key,
    label: STAT_LABELS[key],
    value: state.stats?.[key] ?? 0,
  }));

  const challenges = (state.challenges || []).map((c) => ({
    ...c,
    gradeLabel: { S: 'Exceptional', A: 'Strong', B: 'Serviceable', C: 'Rough' }[c.grade] || c.grade,
  }));

  const strongest = stats.reduce((a, b) => (b.value > a.value ? b : a), stats[0] || { label: 'Mastery', value: 0 });
  const weakest = stats.reduce((a, b) => (b.value < a.value ? b : a), stats[0] || { label: 'Network', value: 0 });

  const headline = `${state.playerName}, in 2036 you are ${archetype.name.toLowerCase().replace('the ', 'a ')} in ${career.label.toLowerCase()}.`;

  const journey = (state.timeline || []).map((t, i) => ({ ...t, step: i + 1 }));

  return {
    code: code || null,
    finished: Boolean(state.finished),
    career: { id: career.id, label: career.label, tagline: career.tagline, accent: career.accent },
    playerName: state.playerName,
    archetype,
    headline,
    strongest,
    weakest,
    journey,
    decisions: (state.decisions || []).map((d) => ({
      chapter: d.chapter,
      chapterTitle: d.chapterTitle,
      year: d.year,
      label: d.label,
    })),
    skills,
    stats,
    achievements: state.achievements || [],
    challenges,
    goals: state.goals || [],
    opportunities: opportunitiesFor(state),
    growthAreas: growthFor(state),
    nextSteps: [
      `Pick one skill from your thinnest two and give it a real project in the next 90 days.`,
      challenges.length
        ? `Revisit your weakest challenge (${challenges.reduce((a, b) => (b.score < a.score ? b : a), challenges[0]).title}) and do one deliberate practice rep.`
        : 'Take one challenge you avoided and do the smallest honest version of it.',
      `Ask the AI Career Mentor to compare ${career.label.toLowerCase()} with one adjacent path and say what transfers.`,
      'Write one goal you can finish in six weeks, and one you would need five years for.',
    ],
    chaptersPlayed: Math.min((state.chapterIndex || 0) + (state.finished ? 0 : 1), CHAPTERS.length),
    totalChapters: CHAPTERS.length,
    disclaimer: DISCLAIMER,
    generatedAt: new Date().toISOString(),
  };
}
