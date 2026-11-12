const CODE_KEY = 'fy2036.code';
const TOKEN_KEY = 'fy2036.token';

export function getCode() {
  try {
    return localStorage.getItem(CODE_KEY) || '';
  } catch {
    return '';
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function rememberRun({ code, token }) {
  try {
    if (code) localStorage.setItem(CODE_KEY, code);
    if (token) localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* storage may be unavailable; the code still works when typed in */
  }
}

export function forgetRun() {
  try {
    localStorage.removeItem(CODE_KEY);
  } catch {
    /* ignore */
  }
}

export function normaliseCode(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 12)
    .replace(/(.{4})(?=.)/g, '$1-');
}
