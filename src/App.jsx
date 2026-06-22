import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Carros from './pages/Carros';
import Clientes from './pages/Clientes';
import Alugueis from './pages/Alugueis';
import Usuarios from './pages/Usuarios';
import Relatorios from './pages/Relatorios';
import EmConstrucao from './components/EmConstrucao';
import { getToken } from './services/auth';

export default function App() {
  const [autenticado, setAutenticado] = useState(!!getToken());

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            autenticado
              ? <Navigate to="/dashboard" replace />
              : <Login onLogin={() => setAutenticado(true)} />
          }
        />

        <Route
          element={
            autenticado
              ? <Layout onLogout={() => setAutenticado(false)} />
              : <Navigate to="/login" replace />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/carros"    element={<Carros />} />
          <Route path="/clientes"  element={<Clientes />} />
          <Route path="/alugueis"  element={<Alugueis />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/usuarios"  element={<Usuarios />} />
        </Route>

        <Route path="*" element={<Navigate to={autenticado ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
