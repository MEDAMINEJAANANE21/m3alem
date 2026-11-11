import { API_BASE_URL } from '../config/app.config.js';
import { session } from '../stores/session.store.js';

export class HttpError extends Error {
  constructor(status, message, details = []) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

function buildHeaders(hasBody) {
  const headers = { Accept: 'application/json' };
  if (hasBody) headers['Content-Type'] = 'application/json';
  if (session.token) headers.Authorization = `Bearer ${session.token}`;
  return headers;
}

async function request(method, path, body) {
  const hasBody = body !== undefined;
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: buildHeaders(hasBody),
      body: hasBody ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new HttpError(0, 'Impossible de contacter le serveur. Vérifiez votre connexion.');
  }

  // An expired or revoked token: log the user out so the UI stops pretending they are connected.
  if (response.status === 401 && session.isLoggedIn()) session.clear();
  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new HttpError(
      response.status,
      data.error?.message ?? 'Une erreur inattendue est survenue',
      data.error?.details,
    );
  }
  return data;
}

export const http = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
};
