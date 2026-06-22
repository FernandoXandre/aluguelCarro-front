import { getToken, logout } from './auth';

const API_URL = 'http://localhost:8080';

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    logout();
    window.location.href = '/login';
    return;
  }

  if (!response.ok) {
    const erro = await response.json().catch(() => ({}));
    throw new Error(erro.mensagem || 'Erro na requisição.');
  }

  if (response.status === 204) return null;
  return response.json();
}
