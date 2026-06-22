const API_URL = 'http://localhost:8080';

export async function login(username, senha) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, senha }),
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => ({}));
    throw new Error(erro.mensagem || 'Usuário ou senha inválidos.');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
}

export function logout() {
  localStorage.removeItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
}
