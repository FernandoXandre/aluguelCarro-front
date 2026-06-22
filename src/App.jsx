import { useState } from 'react';
import Login from './pages/Login';
import { getToken, logout } from './services/auth';

export default function App() {
  const [autenticado, setAutenticado] = useState(!!getToken());

  if (!autenticado) {
    return <Login onLogin={() => setAutenticado(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold text-gray-800">Bem-vindo ao sistema!</h1>
      <button
        onClick={() => { logout(); setAutenticado(false); }}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
      >
        Sair
      </button>
    </div>
  );
}
