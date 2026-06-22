import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { apiFetch } from '../services/api';
import { colors, card, btnPrimary } from '../theme';

// ── Ícones SVG ────────────────────────────────────────────────
function IconCar() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM3 10l1.5-4.5A1 1 0 015.45 5h13.1a1 1 0 01.95.68L21 10M3 10h18M3 10v5a1 1 0 001 1h1m14-6v6a1 1 0 01-1 1h-1" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a4 4 0 00-3-3.87" />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    ATIVO:     { label: 'Ativo',     bg: '#052e16', color: '#10B981', border: '#10B981' },
    CONCLUIDO: { label: 'Concluído', bg: '#1e1b4b', color: '#818CF8', border: '#818CF8' },
    CANCELADO: { label: 'Cancelado', bg: '#2D1B1B', color: '#EF4444', border: '#EF4444' },
  };
  const s = map[status] || map.ATIVO;
  return (
    <span style={{
      backgroundColor: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      borderRadius: '6px',
      padding: '3px 10px',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.08em',
    }}>
      {s.label}
    </span>
  );
}

// ── KPI Card ──────────────────────────────────────────────────
function KpiCard({ label, value, icon, accentColor, loading }) {
  return (
    <div style={{
      ...card,
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      borderLeft: `3px solid ${accentColor}`,
      padding: '24px 28px',
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
        backgroundColor: accentColor + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: accentColor,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ color: colors.textSubtle, fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '6px' }}>
          {label}
        </p>
        <p style={{ color: colors.textMain, fontSize: '32px', fontWeight: 900, lineHeight: 1 }}>
          {loading ? <span style={{ color: colors.border }}>—</span> : (value ?? 0)}
        </p>
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [carros, setCarros]       = useState([]);
  const [clientes, setClientes]   = useState([]);
  const [alugueis, setAlugueis]   = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const [c, cl, al] = await Promise.all([
          apiFetch('/carros'),
          apiFetch('/clientes'),
          apiFetch('/alugueis'),
        ]);
        setCarros(c || []);
        setClientes(cl || []);
        setAlugueis(al || []);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const hoje         = new Date().toISOString().slice(0, 10);
  const ativos       = alugueis.filter(a => a.status === 'ATIVO');
  const disponiveis  = carros.filter(c => c.disponivel);
  const alugados     = carros.filter(c => !c.disponivel);
  const devolucoes   = ativos.filter(a => a.dataFim === hoje);
  const recentes     = [...alugueis].sort((a, b) => b.id - a.id).slice(0, 5);
  const pctDisp      = carros.length ? Math.round((disponiveis.length / carros.length) * 100) : 0;

  const kpis = [
    { label: 'Total de Veículos', value: carros.length,      icon: <IconCar />,   accentColor: colors.primary },
    { label: 'Disponíveis',       value: disponiveis.length, icon: <IconCheck />, accentColor: '#10B981' },
    { label: 'Clientes',          value: clientes.length,    icon: <IconUsers />, accentColor: '#6366F1' },
    { label: 'Aluguéis Ativos',   value: ativos.length,      icon: <IconDoc />,   accentColor: '#F97316' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <PageHeader subtitle="Visão Geral" title="Dashboard" />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {kpis.map(k => <KpiCard key={k.label} {...k} loading={loading} />)}
      </div>

      {/* Linha do meio: Ações rápidas + Disponibilidade */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Ações rápidas */}
        <div style={{ ...card, padding: '28px' }}>
          <p style={{ color: colors.textMain, fontSize: '15px', fontWeight: 800, marginBottom: '20px' }}>
            Ações Rápidas
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Novo Aluguel',       path: '/alugueis',  color: colors.primary },
              { label: 'Cadastrar Veículo',  path: '/carros',    color: '#6366F1' },
              { label: 'Cadastrar Cliente',  path: '/clientes',  color: '#10B981' },
            ].map(({ label, path, color }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  backgroundColor: color + '15',
                  border: `1px solid ${color}30`,
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: color,
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = color + '25'; e.currentTarget.style.borderColor = color + '60'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = color + '15'; e.currentTarget.style.borderColor = color + '30'; }}
              >
                <IconPlus /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Disponibilidade da frota */}
        <div style={{ ...card, padding: '28px' }}>
          <p style={{ color: colors.textMain, fontSize: '15px', fontWeight: 800, marginBottom: '20px' }}>
            Disponibilidade da Frota
          </p>
          {carros.length === 0 ? (
            <p style={{ color: colors.textSubtle, fontSize: '13px' }}>Nenhum veículo cadastrado.</p>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: colors.textMuted, fontSize: '13px' }}>
                  <span style={{ color: '#10B981', fontWeight: 700 }}>{disponiveis.length}</span> disponíveis
                </span>
                <span style={{ color: colors.textMuted, fontSize: '13px' }}>
                  <span style={{ color: '#F97316', fontWeight: 700 }}>{alugados.length}</span> alugados
                </span>
              </div>
              <div style={{ height: '10px', backgroundColor: colors.border, borderRadius: '99px', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{
                  height: '100%',
                  width: `${pctDisp}%`,
                  backgroundColor: '#10B981',
                  borderRadius: '99px',
                  transition: 'width 0.6s ease',
                }} />
              </div>
              <p style={{ color: colors.textSubtle, fontSize: '12px' }}>
                {pctDisp}% da frota disponível · {carros.length} veículos no total
              </p>

              {/* Legenda */}
              <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                {[
                  { label: 'Disponível', color: '#10B981' },
                  { label: 'Alugado',   color: '#F97316' },
                ].map(({ label, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
                    <span style={{ color: colors.textSubtle, fontSize: '12px' }}>{label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Linha inferior: Aluguéis recentes + Devoluções do dia */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>

        {/* Aluguéis recentes */}
        <div style={{ ...card, padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p style={{ color: colors.textMain, fontSize: '15px', fontWeight: 800 }}>Aluguéis Recentes</p>
            <button
              onClick={() => navigate('/alugueis')}
              style={{ background: 'none', border: 'none', color: colors.primary, fontSize: '12px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.08em' }}
            >
              Ver todos →
            </button>
          </div>

          {loading ? (
            <p style={{ color: colors.textSubtle, fontSize: '13px' }}>Carregando...</p>
          ) : recentes.length === 0 ? (
            <p style={{ color: colors.textSubtle, fontSize: '13px' }}>Nenhum aluguel registrado.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['ID', 'Cliente', 'Carro', 'Início', 'Fim', 'Status'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', color: colors.textSubtle,
                      fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
                      textTransform: 'uppercase', paddingBottom: '12px',
                      borderBottom: `1px solid ${colors.border}`,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentes.map((a, i) => (
                  <tr key={a.id} style={{ borderBottom: i < recentes.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                    {[
                      <span style={{ color: colors.textSubtle, fontWeight: 700 }}>#{a.id}</span>,
                      <span style={{ color: colors.textMain, fontWeight: 600 }}>Cliente {a.clienteId}</span>,
                      <span style={{ color: colors.textMuted }}>Carro {a.carroId}</span>,
                      <span style={{ color: colors.textMuted }}>{a.dataInicio}</span>,
                      <span style={{ color: colors.textMuted }}>{a.dataFim}</span>,
                      <StatusBadge status={a.status} />,
                    ].map((cell, j) => (
                      <td key={j} style={{ padding: '14px 0', paddingRight: '16px' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Devoluções do dia */}
        <div style={{ ...card, padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ color: colors.primary }}><IconCalendar /></div>
            <p style={{ color: colors.textMain, fontSize: '15px', fontWeight: 800 }}>Devoluções Hoje</p>
          </div>

          {loading ? (
            <p style={{ color: colors.textSubtle, fontSize: '13px' }}>Carregando...</p>
          ) : devolucoes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ color: colors.textSubtle, fontSize: '13px', lineHeight: 1.6 }}>
                Nenhuma devolução<br />prevista para hoje.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {devolucoes.map(a => (
                <div key={a.id} style={{
                  backgroundColor: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '10px',
                  padding: '12px 14px',
                }}>
                  <p style={{ color: colors.textMain, fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                    Carro #{a.carroId}
                  </p>
                  <p style={{ color: colors.textSubtle, fontSize: '12px' }}>
                    Cliente #{a.clienteId} · Aluguel #{a.id}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
