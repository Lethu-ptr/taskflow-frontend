// ============================================================
//  TaskFlow – services/api.js
//  All HTTP calls to the Express backend.
//  Base URL is read from .env: VITE_API_URL
// ============================================================

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Core fetch helper ─────────────────────────────────────────
async function request(path, options = {}) {
  const token = localStorage.getItem('tf_token');

  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data.message || data.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

// ── Auth endpoints ────────────────────────────────────────────
export const authApi = {
  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request('/auth/me'),
};

// ── Task endpoints ────────────────────────────────────────────
export const tasksApi = {
  getAll:  ()         => request('/tasks'),
  getOne:  (id)       => request(`/tasks/${id}`),
  create:  (data)     => request('/tasks',       { method: 'POST',   body: JSON.stringify(data) }),
  update:  (id, data) => request(`/tasks/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
  remove:  (id)       => request(`/tasks/${id}`, { method: 'DELETE' }),
};
