import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { apiFetch } from '../services/api';
import { colors, card, btnPrimary } from '../theme';

// ── Gráfico de barras em CSS puro ─────────────────────────────
function BarChart({ dados }) {
  const maxAlugueis = Math.max(...dados.map(d => d.totalAlugueis), 1);
  const maxReceita  = Math.max(...dados.map(d => Number(d.receitaTotal)), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Gráfico de aluguéis */}
      <div>
        <p style={{ color: colors.textSubtle, fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>
          Quantidade de Aluguéis
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
          {dados.map(d => {
            const pct = d.totalAlugueis / maxAlugueis;
            return (
              <div key={d.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ color: d.totalAlugueis > 0 ? colors.primary : 'transparent', fontSize: '11px', fontWeight: 700 }}>
                  {d.totalAlugueis}
                </span>
                <div style={{ width: '100%', position: 'relative' }}>
                  <div style={{
                    width: '100%',
                    height: `${Math.max(pct * 80, d.totalAlugueis > 0 ? 4 : 2)}px`,
                    backgroundColor: d.totalAlugueis > 0 ? colors.primary : colors.border,
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s ease',
                  }} />
                </div>
                <span style={{ color: colors.textSubtle, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' }}>
                  {d.nomeMes.slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divisor */}
      <div style={{ borderTop: `1px solid ${colors.border}` }} />

      {/* Gráfico de receita */}
      <div>
        <p style={{ color: colors.textSubtle, fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>
          Receita Total (R$)
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
          {dados.map(d => {
            const receita = Number(d.receitaTotal);
            const pct = receita / maxReceita;
            return (
              <div key={d.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ color: receita > 0 ? '#10B981' : 'transparent', fontSize: '10px', fontWeight: 700 }}>
                  {receita > 0 ? `${(receita / 1000).toFixed(1)}k` : ''}
                </span>
                <div style={{ width: '100%' }}>
                  <div style={{
                    width: '100%',
                    height: `${Math.max(pct * 80, receita > 0 ? 4 : 2)}px`,
                    backgroundColor: receita > 0 ? '#10B981' : colors.border,
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s ease',
                  }} />
                </div>
                <span style={{ color: colors.textSubtle, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' }}>
                  {d.nomeMes.slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────
export default function Relatorios() {
  const anoAtual = new Date().getFullYear();
  const [ano, setAno]       = useState(anoAtual);
  const [dados, setDados]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        const data = await apiFetch(`/relatorios/alugueis-anuais?ano=${ano}`);
        setDados(data || []);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [ano]);

  const totalAlugueis = dados.reduce((s, d) => s + d.totalAlugueis, 0);
  const totalReceita  = dados.reduce((s, d) => s + Number(d.receitaTotal), 0);
  const melhorMes     = dados.reduce((m, d) => d.totalAlugueis > (m?.totalAlugueis || 0) ? d : m, null);
  const mesAtivo      = dados.filter(d => d.totalAlugueis > 0).length;

  const kpis = [
    { label: 'Total de aluguéis',   value: totalAlugueis,                            color: colors.primary },
    { label: 'Receita total',        value: `R$ ${totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, color: '#10B981' },
    { label: 'Melhor mês',           value: melhorMes?.totalAlugueis > 0 ? melhorMes.nomeMes : '—', color: '#6366F1' },
    { label: 'Meses com movimento',  value: `${mesAtivo} / 12`,                       color: '#F97316' },
  ];

  const anos = Array.from({ length: 5 }, (_, i) => anoAtual - i);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Cabeçalho exibido apenas na impressão */}
      <div className="print-only" style={{ display: 'none', marginBottom: '8px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B7280', marginBottom: '4px' }}>
          Análises e Relatórios
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#111' }}>
          Relatório Anual — {ano}
        </h1>
      </div>

      <PageHeader
        subtitle="Análises e Relatórios"
        title="Relatórios"
        action={
          <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: colors.textSubtle, fontSize: '13px', fontWeight: 600 }}>Ano:</span>
              <select
                value={ano}
                onChange={e => setAno(Number(e.target.value))}
                style={{
                  backgroundColor: colors.surface, border: `1.5px solid ${colors.border}`,
                  borderRadius: '10px', padding: '10px 16px', color: colors.textMain,
                  fontSize: '14px', fontWeight: 700, cursor: 'pointer', outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = colors.primary}
                onBlur={e => e.target.style.borderColor = colors.border}
              >
                {anos.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <button
              onClick={() => window.print()}
              style={{ ...btnPrimary, padding: '10px 20px' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.primaryHover}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = colors.primary}
            >
              Imprimir Relatório
            </button>
          </div>
        }
      />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {kpis.map(({ label, value, color }) => (
          <div key={label} style={{
            ...card, padding: '20px 24px',
            borderLeft: `3px solid ${color}`,
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <span style={{ color: colors.textSubtle, fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {label}
            </span>
            <span style={{ color: loading ? colors.border : color, fontSize: '24px', fontWeight: 900, textTransform: 'capitalize' }}>
              {loading ? '—' : value}
            </span>
          </div>
        ))}
      </div>

      {/* Gráficos — oculto na impressão */}
      <div className="no-print" style={{ ...card, padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <p style={{ color: colors.primary, fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '4px' }}>
              Visão Anual
            </p>
            <p style={{ color: colors.textMain, fontSize: '18px', fontWeight: 800 }}>
              Desempenho em {ano}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[{ label: 'Aluguéis', color: colors.primary }, { label: 'Receita', color: '#10B981' }].map(({ label, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: color }} />
                <span style={{ color: colors.textSubtle, fontSize: '12px', fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: colors.textSubtle, fontSize: '14px' }}>Carregando dados...</p>
          </div>
        ) : (
          <BarChart dados={dados} />
        )}
      </div>

      {/* Tabela detalhada */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '24px 28px', borderBottom: `1px solid ${colors.border}` }}>
          <p style={{ color: colors.textMain, fontSize: '15px', fontWeight: 800 }}>Detalhamento Mensal — {ano}</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: colors.bg + 'aa' }}>
                {['Mês', 'Aluguéis', 'Receita Total', 'Ticket Médio'].map((h, i) => (
                  <th key={i} style={{
                    textAlign: i === 0 ? 'left' : 'right',
                    color: colors.textSubtle, fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    padding: i === 0 ? '14px 16px 14px 28px' : '14px 28px 14px 0',
                    borderBottom: `1px solid ${colors.border}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: colors.textSubtle, fontSize: '14px' }}>Carregando...</td></tr>
              ) : dados.map((d, i) => {
                const receita = Number(d.receitaTotal);
                const ticket  = d.totalAlugueis > 0 ? (receita / d.totalAlugueis).toFixed(2) : null;
                const isAtual = d.mes === new Date().getMonth() + 1 && ano === anoAtual;
                return (
                  <tr
                    key={d.mes}
                    style={{
                      backgroundColor: isAtual ? colors.primary + '08' : 'transparent',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.bg + '88'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = isAtual ? colors.primary + '08' : 'transparent'}
                  >
                    <td style={{ padding: '14px 16px 14px 28px', borderBottom: i < dados.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: colors.textMain, fontWeight: 700, fontSize: '14px', textTransform: 'capitalize' }}>
                          {d.nomeMes}
                        </span>
                        {isAtual && (
                          <span style={{
                            backgroundColor: colors.primary + '20', color: colors.primary,
                            fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                            borderRadius: '4px', padding: '2px 7px',
                          }}>MÊS ATUAL</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 28px 14px 0', borderBottom: i < dados.length - 1 ? `1px solid ${colors.border}` : 'none', textAlign: 'right' }}>
                      <span style={{ color: d.totalAlugueis > 0 ? colors.textMain : colors.textSubtle, fontWeight: 700, fontSize: '14px' }}>
                        {d.totalAlugueis}
                      </span>
                    </td>
                    <td style={{ padding: '14px 28px 14px 0', borderBottom: i < dados.length - 1 ? `1px solid ${colors.border}` : 'none', textAlign: 'right' }}>
                      <span style={{ color: receita > 0 ? '#10B981' : colors.textSubtle, fontWeight: 700, fontSize: '14px' }}>
                        {receita > 0 ? `R$ ${receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 28px 14px 0', borderBottom: i < dados.length - 1 ? `1px solid ${colors.border}` : 'none', textAlign: 'right' }}>
                      <span style={{ color: ticket ? colors.textMuted : colors.textSubtle, fontSize: '14px' }}>
                        {ticket ? `R$ ${Number(ticket).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
