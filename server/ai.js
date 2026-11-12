/**
 * AI Career Mentor service.
 *
 * Talks to a real language-model provider using credentials that only exist on
 * the server. Supports any OpenAI-compatible chat-completions endpoint and the
 * Anthropic Messages API. When no key is configured the route reports that
 * clearly instead of faking an answer.
 */

const OPENAI_KEY = process.env.AI_API_KEY || process.env.OPENAI_API_KEY || '';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';
const OPENAI_BASE = (process.env.AI_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const OPENAI_MODEL = process.env.AI_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest';
const TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 45000);

export function mentorConfigured() {
  return Boolean(OPENAI_KEY || ANTHROPIC_KEY);
}

export function providerName() {
  if (OPENAI_KEY) return 'openai-compatible';
  if (ANTHROPIC_KEY) return 'anthropic';
  return 'none';
}

export class MentorUnavailable extends Error {
  constructor(message, status = 503, code = 'mentor_unavailable') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function describeRun(run) {
  if (!run) {
    return 'The visitor has not started the simulator yet. They have no saved game history.';
  }
  const { state } = run;
  const lines = [];
  lines.push(`Player name: ${state.playerName}`);
  lines.push(`Chosen career interest: ${state.careerLabel} (career id: ${state.careerId})`);
  lines.push(`Progress: chapter ${Math.min(state.chapterIndex + 1, 6)} of 6${state.finished ? ' (finished)' : ''}`);
  lines.push(
    `Traits: ${Object.entries(state.stats || {})
      .map(([k, v]) => `${k} ${v}/100`)
      .join(', ')}`,
  );
  lines.push(
    `Skills: ${Object.entries(state.skills || {})
      .map(([k, v]) => `${k} ${v}/100`)
      .join(', ')}`,
  );
  if (state.decisions?.length) {
    lines.push('Decisions made so far (most recent last):');
    for (const d of state.decisions.slice(-14)) {
      lines.push(`- Chapter ${d.chapter} (${d.year}): ${d.label}`);
    }
  } else {
    lines.push('No decisions recorded yet.');
  }
  if (state.challenges?.length) {
    lines.push(
      `Challenges: ${state.challenges.map((c) => `${c.title} (${c.grade}, ${c.score}/100)`).join('; ')}`,
    );
  }
  if (state.achievements?.length) {
    lines.push(`Achievements: ${state.achievements.map((a) => a.title).join('; ')}`);
  }
  if (state.goals?.length) {
    lines.push(`Goals already saved: ${state.goals.map((g) => g.text).join('; ')}`);
  }
  const flags = Object.entries(state.flags || {})
    .filter(([, v]) => v)
    .map(([k]) => k);
  if (flags.length) lines.push(`Story flags set: ${flags.join(', ')}`);
  return lines.join('\n');
}

export function systemPrompt({ run, mode }) {
  const modeLine =
    mode === 'compare'
      ? 'This turn the user wants a career comparison. Compare the careers they ask about concretely: daily work, entry path, pay trajectory range, risk, what transfers between them. End with a recommendation tied to their saved history.'
      : mode === 'goals'
        ? 'This turn the user wants realistic goals. Propose 2-3 goals with a time horizon (six weeks, one year, five years), each with a first action small enough to do this week. Be concrete and modest about uncertainty.'
        : 'Answer the question they actually asked.';

  return `You are the AI Career Mentor inside the "Future You 2036 Simulator", a game where someone plays a possible ten-year career forward from 2026.

You are a thoughtful, experienced career mentor. You are warm but direct, specific rather than motivational, and you never pretend to predict the future. You do not know the person's real life beyond what the simulator recorded, so you ask when it matters and you say what you are unsure about.

Rules:
- Ground advice in their saved game history below when it is relevant. Refer to specific choices they made by name.
- Keep answers under 220 words unless they explicitly ask for depth. Use short paragraphs and at most one short bullet list.
- No false guarantees about salary, hiring or the future. Give ranges and trade-offs instead.
- Do not invent credentials, employers, people or facts about them. If the history is empty, say the game has not recorded decisions yet and ask one good question.
- If they ask something unrelated to careers, education, skills or life planning, gently steer back.
- Plain text only: no markdown headings, no code fences, no emoji spam.

${modeLine}

Saved game history:
${describeRun(run)}`;
}

function normaliseMessages(messages) {
  const cleaned = [];
  for (const message of Array.isArray(messages) ? messages.slice(-14) : []) {
    const role = message?.role === 'assistant' ? 'assistant' : 'user';
    const content = String(message?.content || '').trim().slice(0, 4000);
    if (!content) continue;
    if (cleaned.length && cleaned[cleaned.length - 1].role === role) {
      cleaned[cleaned.length - 1].content += `\n\n${content}`;
    } else {
      cleaned.push({ role, content });
    }
  }
  if (!cleaned.length) throw new MentorUnavailable('Ask a question first.', 400, 'empty_message');
  if (cleaned[cleaned.length - 1].role !== 'user') {
    throw new MentorUnavailable('The last message must be your question.', 400, 'empty_message');
  }
  return cleaned;
}

async function callOpenAI({ messages, system }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${OPENAI_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.6,
        max_tokens: 700,
        messages: [{ role: 'system', content: system }, ...messages],
      }),
      signal: controller.signal,
    });
    const text = await response.text();
    if (!response.ok) {
      throw new MentorUnavailable(
        `The mentor provider rejected the request (${response.status}). Check the API key and model name.`,
        502,
        'provider_error',
      );
    }
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      throw new MentorUnavailable('The mentor provider returned an unreadable response.', 502, 'provider_error');
    }
    const reply = payload?.choices?.[0]?.message?.content;
    if (!reply) throw new MentorUnavailable('The mentor returned an empty answer. Try rephrasing.', 502, 'empty_reply');
    return { reply: String(reply).trim(), model: payload.model || OPENAI_MODEL };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new MentorUnavailable('The mentor took too long to answer. Try a shorter question.', 504, 'timeout');
    }
    if (error instanceof MentorUnavailable) throw error;
    throw new MentorUnavailable('Could not reach the mentor provider. Try again shortly.', 502, 'network_error');
  } finally {
    clearTimeout(timer);
  }
}

async function callAnthropic({ messages, system }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 700,
        system,
        messages,
      }),
      signal: controller.signal,
    });
    const text = await response.text();
    if (!response.ok) {
      throw new MentorUnavailable(
        `The mentor provider rejected the request (${response.status}). Check the API key and model name.`,
        502,
        'provider_error',
      );
    }
    const payload = JSON.parse(text);
    const reply = (payload?.content || [])
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('\n')
      .trim();
    if (!reply) throw new MentorUnavailable('The mentor returned an empty answer. Try rephrasing.', 502, 'empty_reply');
    return { reply, model: payload.model || ANTHROPIC_MODEL };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new MentorUnavailable('The mentor took too long to answer. Try a shorter question.', 504, 'timeout');
    }
    if (error instanceof MentorUnavailable) throw error;
    throw new MentorUnavailable('Could not reach the mentor provider. Try again shortly.', 502, 'network_error');
  } finally {
    clearTimeout(timer);
  }
}

export async function askMentor({ run, messages, mode }) {
  if (!mentorConfigured()) {
    throw new MentorUnavailable(
      'The AI Career Mentor is not connected yet. Add an AI provider key (OPENAI_API_KEY) in Settings → Environment variables and it will start answering with real model responses.',
      503,
      'not_configured',
    );
  }
  const cleaned = normaliseMessages(messages);
  const system = systemPrompt({ run, mode });
  const result = OPENAI_KEY
    ? await callOpenAI({ messages: cleaned, system })
    : await callAnthropic({ messages: cleaned, system });
  return result;
}
