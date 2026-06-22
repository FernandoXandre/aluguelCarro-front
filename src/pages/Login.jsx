import { useState } from 'react';
import { login } from '../services/auth';

function CarIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM3 10l1.5-4.5A1 1 0 015.45 5h13.1a1 1 0 01.95.68L21 10M3 10h18M3 10v5a1 1 0 001 1h1m14-6v6a1 1 0 01-1 1h-1" />
    </svg>
  );
}

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await login(username, senha);
      onLogin();
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#111827' }}>

      {/* ── Painel esquerdo (desktop) ── */}
      <div style={{
        display: 'none',
        width: '50%',
        backgroundColor: '#1F2937',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 64px',
        position: 'relative',
        overflow: 'hidden',
      }} className="left-panel">

        {/* Círculos decorativos */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '360px', height: '360px', borderRadius: '50%',
          backgroundColor: '#F59E0B', opacity: 0.08,
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '280px', height: '280px', borderRadius: '50%',
          backgroundColor: '#F59E0B', opacity: 0.04,
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '10px',
            backgroundColor: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CarIcon className="w-6 h-6" style={{ color: '#111827' }} />
          </div>
          <span style={{ color: '#fff', fontSize: '18px', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            AutoLocadora
          </span>
        </div>

        {/* Texto central */}
        <div style={{ position: 'relative' }}>
          <p style={{ color: '#F59E0B', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px' }}>
            Sistema de Gestão
          </p>
          <h1 style={{ color: '#fff', fontSize: '52px', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px' }}>
            Velocidade.<br />
            Controle.<br />
            <span style={{ color: '#F59E0B' }}>Resultados.</span>
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '17px', lineHeight: 1.7 }}>
            Gerencie sua frota, clientes e aluguéis<br />com eficiência máxima.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '40px', position: 'relative' }}>
          {[{ valor: '+500', label: 'Veículos' }, { valor: '+1.2k', label: 'Clientes' }, { valor: '98%', label: 'Satisfação' }].map(({ valor, label }) => (
            <div key={label}>
              <p style={{ color: '#F59E0B', fontSize: '26px', fontWeight: 900 }}>{valor}</p>
              <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '2px' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Painel direito — formulário ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Logo mobile */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '40px' }} className="mobile-logo">
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              backgroundColor: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CarIcon className="w-7 h-7" style={{ color: '#111827' }} />
            </div>
            <span style={{ color: '#fff', fontSize: '17px', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              AutoLocadora
            </span>
          </div>

          {/* Card */}
          <div style={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '20px',
            padding: '40px',
          }}>
            <p style={{ color: '#F59E0B', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Acesso ao sistema
            </p>
            <h2 style={{ color: '#fff', fontSize: '26px', fontWeight: 900, marginBottom: '8px' }}>
              Bem-vindo de volta
            </h2>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '36px' }}>
              Entre com suas credenciais para continuar.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Campo usuário */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#9CA3AF', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Usuário
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu usuário"
                  required
                  style={{
                    backgroundColor: '#111827',
                    border: '1.5px solid #374151',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    color: '#F9FAFB',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#F59E0B'}
                  onBlur={e => e.target.style.borderColor = '#374151'}
                />
              </div>

              {/* Campo senha */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#9CA3AF', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Senha
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                    style={{
                      backgroundColor: '#111827',
                      border: '1.5px solid #374151',
                      borderRadius: '10px',
                      padding: '14px 48px 14px 18px',
                      color: '#F9FAFB',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = '#F59E0B'}
                    onBlur={e => e.target.style.borderColor = '#374151'}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(v => !v)}
                    style={{
                      position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#6B7280', display: 'flex', alignItems: 'center', padding: '4px',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#9CA3AF'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
                  >
                    {mostrarSenha
                      ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Erro */}
              {erro && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  backgroundColor: '#2D1B1B', border: '1px solid #EF4444',
                  borderRadius: '10px', padding: '12px 16px',
                  color: '#FCA5A5', fontSize: '13px',
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {erro}
                </div>
              )}

              {/* Botão */}
              <button
                type="submit"
                disabled={carregando}
                style={{
                  backgroundColor: carregando ? '#D97706' : '#F59E0B',
                  color: '#111827',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '16px',
                  fontSize: '13px',
                  fontWeight: 900,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: carregando ? 'not-allowed' : 'pointer',
                  opacity: carregando ? 0.7 : 1,
                  transition: 'background-color 0.2s',
                  marginTop: '6px',
                  width: '100%',
                }}
                onMouseEnter={e => !carregando && (e.target.style.backgroundColor = '#D97706')}
                onMouseLeave={e => !carregando && (e.target.style.backgroundColor = '#F59E0B')}
              >
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* CSS responsivo */}
      <style>{`
        @media (min-width: 1024px) {
          .left-panel { display: flex !important; }
          .mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}
