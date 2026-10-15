// Thin fetch wrapper. Auth lives in httpOnly cookies, so there's no token
// handling here — only a transparent refresh when the access cookie expires.

export class ApiError extends Error {
  constructor(status, message, code, meta) {
    super(message);
    this.status = status;
    this.code = code;
    this.meta = meta; // extra payload (e.g. who changed what, on a 409)
  }
}

let refreshing = null;
const listeners = new Set();

// Fired when the session is definitely over (AuthContext signs the user out).
export const onSessionEnded = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

async function raw(path, { method = 'GET', body, headers = {}, form } = {}) {
  const init = {
    method,
    credentials: 'same-origin',
    headers: { 'X-Requested-With': 'walnut-admin', ...headers },
  };
  if (form) init.body = form;
  else if (body !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  // Served under /admin, so the API is at /admin/api (see vercel.json rewrites).
  return fetch(`/admin/api${path}`, init);
}

async function parseError(res) {
  const data = await res.json().catch(() => ({}));
  return new ApiError(res.status, data.error || `Request failed (${res.status})`, data.code, data.meta);
}

// Only one refresh at a time: concurrent 401s wait for the same promise,
// because each refresh rotates the token and a second one would look like theft.
function refreshSession() {
  if (!refreshing) {
    refreshing = raw('/auth/refresh', { method: 'POST' })
      .then(async (res) => {
        if (!res.ok) throw await parseError(res);
        return res.json();
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

export async function api(path, options = {}) {
  let res = await raw(path, options);

  if (res.status === 401 && !path.startsWith('/auth/')) {
    const err = await parseError(res);
    if (err.code === 'TOKEN_EXPIRED' || err.code === 'UNAUTHENTICATED') {
      try {
        await refreshSession();
        res = await raw(path, options);
      } catch {
        listeners.forEach((fn) => fn());
        throw new ApiError(401, 'Your session has ended. Please sign in again.', 'SESSION_ENDED');
      }
    } else {
      listeners.forEach((fn) => fn());
      throw err;
    }
  }

  if (!res.ok) {
    const err = await parseError(res);
    if (err.status === 401 && !path.startsWith('/auth/')) listeners.forEach((fn) => fn());
    throw err;
  }
  if (res.status === 204) return null;
  const type = res.headers.get('content-type') || '';
  return type.includes('application/json') ? res.json() : res;
}

export { refreshSession };

// Downloads an authenticated file (CSV export, resumes) via a blob.
export async function download(path, fallbackName) {
  const res = await api(path);
  const blob = await res.blob();
  const disposition = res.headers.get('content-disposition') || '';
  const name = /filename="([^"]+)"/.exec(disposition)?.[1] || fallbackName;
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
