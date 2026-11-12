export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.status = status;
    this.payload = payload || {};
  }
}

export async function api(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`/api${path}`, {
    method,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { 'x-run-token': token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      payload?.error || `Request failed (${response.status})`,
      response.status,
      payload,
    );
  }
  return payload;
}

export const apiGet = (path) => api(path);
