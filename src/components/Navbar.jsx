import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';
import { colors } from '../theme';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/carros', label: 'Carros' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/alugueis', label: 'Aluguéis' },
  { to: '/relatorios', label: 'Relatórios' },
  { to: '/usuarios', label: 'Usuários' },
];

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    onLogout();
    navigate('/login');
  }

  return (
    <header className="no-print" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: colors.surface,
      borderBottom: `1px solid ${colors.border}`,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 32px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '8px',
            backgroundColor: colors.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px', color: '#111827' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM3 10l1.5-4.5A1 1 0 015.45 5h13.1a1 1 0 01.95.68L21 10M3 10h18M3 10v5a1 1 0 001 1h1m14-6v6a1 1 0 01-1 1h-1" />
            </svg>
          </div>
          <span style={{
            color: colors.textMain,
            fontSize: '15px',
            fontWeight: 900,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}>
            AutoLocadora
          </span>
        </div>

        {/* Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textDecoration: 'none',
                transition: 'all 0.2s',
                backgroundColor: isActive ? colors.primary : 'transparent',
                color: isActive ? colors.bg : colors.textMuted,
              })}
              onMouseEnter={e => {
                if (e.currentTarget.style.backgroundColor === 'transparent') {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = colors.textMain;
                }
              }}
              onMouseLeave={e => {
                if (e.currentTarget.style.backgroundColor === 'rgba(255, 255, 255, 0.05)') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.textMuted;
                }
              }}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Sair */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: colors.textMuted,
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'color 0.2s',
            padding: '8px 0',
          }}
          onMouseEnter={e => e.currentTarget.style.color = colors.textMain}
          onMouseLeave={e => e.currentTarget.style.color = colors.textMuted}
        >
          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          Sair
        </button>
      </div>
    </header>
  );
}
