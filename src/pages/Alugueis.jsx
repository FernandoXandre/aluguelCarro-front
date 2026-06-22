import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import FormField, { Input, Select } from '../components/FormField';
import { apiFetch } from '../services/api';
import { colors, card, btnPrimary, btnSecondary } from '../theme';

// ── Ícones ────────────────────────────────────────────────────
function IconPlus() {
  return <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
}
function IconSearch() {
  return <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
}
function IconCheck() {
  return <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
}
function IconX() {
  return <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
}

// ── Badges ────────────────────────────────────────────────────
const STATUS_MAP = {
  ATIVO:     { label: 'Ativo',     bg: '#052e16', color: '#10B981', border: '#10B981' },
  CONCLUIDO: { label: 'Concluído', bg: '#1e1b4b', color: '#818CF8', border: '#818CF8' },
  CANCELADO: { label: 'Cancelado', bg: '#2D1B1B', color: '#EF4444', border: '#EF4444' },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.ATIVO;
  return (
    <span style={{
      backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: '6px', padding: '3px 10px',
      fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}

// ── Formulário novo aluguel ───────────────────────────────────
function FormAluguel({ clientes, carrosDisponiveis, onSalvar, onCancelar, salvando }) {
  const hoje = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ clienteId: '', carroId: '', dataInicio: hoje, dataFim: '' });
  const [erros, setErros] = useState({});

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }));
    setErros(e => ({ ...e, [campo]: '' }));
  }

  function calcularDias() {
    if (!form.dataInicio || !form.dataFim) return null;
    const dias = Math.ceil((new Date(form.dataFim) - new Date(form.dataInicio)) / 86400000);
    return dias > 0 ? dias : null;
  }

  function calcularValor() {
    const dias = calcularDias();
    if (!dias || !form.carroId) return null;
    const carro = carrosDisponiveis.find(c => c.id === Number(form.carroId));
    return carro ? (dias * Number(carro.valorDiaria)).toFixed(2) : null;
  }

  function validar() {
    const e = {};
    if (!form.clienteId) e.clienteId = 'Selecione um cliente';
    if (!form.carroId)   e.carroId   = 'Selecione um veículo';
    if (!form.dataInicio) e.dataInicio = 'Obrigatório';
    if (!form.dataFim)   e.dataFim   = 'Obrigatório';
    if (form.dataFim && form.dataInicio && form.dataFim <= form.dataInicio)
      e.dataFim = 'Deve ser posterior à data de início';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errosVal = validar();
    if (Object.keys(errosVal).length) { setErros(errosVal); return; }
    onSalvar({ ...form, clienteId: Number(form.clienteId), carroId: Number(form.carroId) });
  }

  const dias = calcularDias();
  const valor = calcularValor();
  const fieldStyle = { backgroundColor: colors.bg };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <FormField label="Cliente" error={erros.clienteId}>
        <Select value={form.clienteId} onChange={e => set('clienteId', e.target.value)} style={fieldStyle}>
          <option value="">Selecione um cliente...</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nome} — CPF: {c.cpf}</option>
          ))}
        </Select>
      </FormField>

      <FormField label="Veículo disponível" error={erros.carroId}>
        <Select value={form.carroId} onChange={e => set('carroId', e.target.value)} style={fieldStyle}>
          <option value="">Selecione um veículo...</option>
          {carrosDisponiveis.map(c => (
            <option key={c.id} value={c.id}>
              {c.marca} {c.modelo} — {c.placa} — R$ {Number(c.valorDiaria).toFixed(2)}/dia
            </option>
          ))}
        </Select>
      </FormField>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Data de início" error={erros.dataInicio}>
          <Input type="date" value={form.dataInicio} onChange={e => set('dataInicio', e.target.value)} style={fieldStyle} />
        </FormField>
        <FormField label="Data de devolução" error={erros.dataFim}>
          <Input type="date" value={form.dataFim} min={form.dataInicio} onChange={e => set('dataFim', e.target.value)} style={fieldStyle} />
        </FormField>
      </div>

      {/* Resumo do valor */}
      {dias && valor && (
        <div style={{
          backgroundColor: colors.primary + '12',
          border: `1px solid ${colors.primary}30`,
          borderRadius: '10px', padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: colors.textMuted, fontSize: '13px' }}>
            {dias} dia{dias !== 1 ? 's' : ''} de aluguel
          </span>
          <span style={{ color: colors.primary, fontSize: '20px', fontWeight: 900 }}>
            R$ {valor}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
        <button type="button" onClick={onCancelar} style={btnSecondary}>Cancelar</button>
        <button
          type="submit"
          disabled={salvando}
          style={{ ...btnPrimary, opacity: salvando ? 0.6 : 1 }}
          onMouseEnter={e => !salvando && (e.currentTarget.style.backgroundColor = '#D97706')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F59E0B')}
        >
          {salvando ? 'Criando...' : 'Criar Aluguel'}
        </button>
      </div>
    </form>
  );
}

// ── Página principal ──────────────────────────────────────────
export default function Alugueis() {
  const [alugueis, setAlugueis]         = useState([]);
  const [clientes, setClientes]         = useState([]);
  const [carros, setCarros]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [busca, setBusca]               = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [modal, setModal]               = useState(false);
  const [confirmacao, setConfirmacao]   = useState(null); // { tipo: 'concluir'|'cancelar', aluguel }
  const [salvando, setSalvando]         = useState(false);
  const [erro, setErro]                 = useState('');

  async function carregar() {
    try {
      const [al, cl, ca] = await Promise.all([
        apiFetch('/alugueis'),
        apiFetch('/clientes'),
        apiFetch('/carros'),
      ]);
      setAlugueis(al || []);
      setClientes(cl || []);
      setCarros(ca || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  const clienteMap = Object.fromEntries(clientes.map(c => [c.id, c]));
  const carroMap   = Object.fromEntries(carros.map(c => [c.id, c]));
  const disponiveis = carros.filter(c => c.disponivel);

  async function handleCriar(form) {
    setSalvando(true);
    setErro('');
    try {
      await apiFetch('/alugueis', { method: 'POST', body: JSON.stringify(form) });
      await carregar();
      setModal(false);
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  async function handleAcao(tipo, aluguel) {
    setErro('');
    try {
      await apiFetch(`/alugueis/${aluguel.id}/${tipo}`, { method: 'PATCH' });
      await carregar();
      setConfirmacao(null);
    } catch (e) {
      setErro(e.message);
      setConfirmacao(null);
    }
  }

  const alugueisExibidos = alugueis
    .filter(a => {
      const cliente = clienteMap[a.clienteId];
      const carro   = carroMap[a.carroId];
      const termo   = busca.toLowerCase();
      const buscaOk = !termo
        || String(a.id).includes(termo)
        || cliente?.nome.toLowerCase().includes(termo)
        || carro?.modelo.toLowerCase().includes(termo)
        || carro?.placa.toLowerCase().includes(termo);
      const statusOk = filtroStatus === 'todos' || a.status === filtroStatus;
      return buscaOk && statusOk;
    })
    .sort((a, b) => b.id - a.id);

  const thStyle = {
    textAlign: 'left', color: colors.textSubtle,
    fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', padding: '0 16px 14px 0',
    borderBottom: `1px solid ${colors.border}`,
  };
  const tdStyle = {
    padding: '16px 16px 16px 0',
    borderBottom: `1px solid ${colors.border}`,
    color: colors.textMuted, fontSize: '14px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <PageHeader
        subtitle="Controle de Aluguéis"
        title="Aluguéis"
        action={
          <button
            onClick={() => setModal(true)}
            style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D97706'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F59E0B'}
          >
            <IconPlus /> Novo Aluguel
          </button>
        }
      />

      {erro && (
        <div style={{
          backgroundColor: '#2D1B1B', border: `1px solid ${colors.error}`,
          borderRadius: '10px', padding: '12px 16px',
          color: '#FCA5A5', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center',
        }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {erro}
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: colors.textSubtle }}>
            <IconSearch />
          </span>
          <input
            placeholder="Buscar por ID, cliente, carro ou placa..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              backgroundColor: colors.surface, border: `1.5px solid ${colors.border}`,
              borderRadius: '10px', padding: '12px 16px 12px 42px',
              color: colors.textMain, fontSize: '14px', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = colors.primary}
            onBlur={e => e.target.style.borderColor = colors.border}
          />
        </div>
        {[
          { key: 'todos',     label: 'Todos' },
          { key: 'ATIVO',     label: 'Ativos' },
          { key: 'CONCLUIDO', label: 'Concluídos' },
          { key: 'CANCELADO', label: 'Cancelados' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltroStatus(key)}
            style={{
              padding: '12px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', border: 'none', transition: 'all 0.2s',
              backgroundColor: filtroStatus === key ? (STATUS_MAP[key]?.color || colors.primary) : colors.surface,
              color: filtroStatus === key ? (key === 'todos' ? colors.bg : '#fff') : colors.textMuted,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: colors.textSubtle, fontSize: '14px' }}>
            Carregando aluguéis...
          </div>
        ) : alugueisExibidos.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <p style={{ color: colors.textSubtle, fontSize: '14px' }}>Nenhum aluguel encontrado.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: colors.bg + 'aa' }}>
                  {['#', 'Cliente', 'Veículo', 'Período', 'Valor Total', 'Status', 'Ações'].map((h, i) => (
                    <th key={i} style={{ ...thStyle, padding: i === 0 ? '14px 16px 14px 28px' : thStyle.padding }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alugueisExibidos.map(a => {
                  const cliente = clienteMap[a.clienteId];
                  const carro   = carroMap[a.carroId];
                  const dias    = Math.ceil((new Date(a.dataFim) - new Date(a.dataInicio)) / 86400000);
                  return (
                    <tr
                      key={a.id}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.bg + '88'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      style={{ transition: 'background-color 0.15s' }}
                    >
                      <td style={{ ...tdStyle, padding: '16px 16px 16px 28px' }}>
                        <span style={{ color: colors.textSubtle, fontWeight: 700, fontFamily: 'monospace' }}>#{a.id}</span>
                      </td>
                      <td style={tdStyle}>
                        <p style={{ color: colors.textMain, fontWeight: 700, fontSize: '14px' }}>
                          {cliente?.nome || `Cliente #${a.clienteId}`}
                        </p>
                      </td>
                      <td style={tdStyle}>
                        <p style={{ color: colors.textMain, fontWeight: 600, fontSize: '14px' }}>
                          {carro ? `${carro.marca} ${carro.modelo}` : `Carro #${a.carroId}`}
                        </p>
                        {carro && (
                          <p style={{ color: colors.textSubtle, fontSize: '12px', marginTop: '2px', fontFamily: 'monospace' }}>
                            {carro.placa}
                          </p>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <p style={{ color: colors.textMain, fontSize: '13px' }}>
                          {a.dataInicio} → {a.dataFim}
                        </p>
                        <p style={{ color: colors.textSubtle, fontSize: '12px', marginTop: '2px' }}>
                          {dias} dia{dias !== 1 ? 's' : ''}
                        </p>
                      </td>
                      <td style={{ ...tdStyle, color: colors.primary, fontWeight: 800, fontSize: '15px' }}>
                        R$ {Number(a.valorTotal).toFixed(2)}
                      </td>
                      <td style={tdStyle}><StatusBadge status={a.status} /></td>
                      <td style={{ ...tdStyle, paddingRight: '28px' }}>
                        {a.status === 'ATIVO' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setConfirmacao({ tipo: 'concluir', aluguel: a })}
                              title="Concluir"
                              style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                background: 'none', border: `1px solid #10B98150`,
                                borderRadius: '8px', padding: '7px 10px', cursor: 'pointer',
                                color: '#10B981', fontSize: '12px', fontWeight: 700,
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#10B98115'; e.currentTarget.style.borderColor = '#10B981'; }}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#10B98150'; }}
                            >
                              <IconCheck /> Concluir
                            </button>
                            <button
                              onClick={() => setConfirmacao({ tipo: 'cancelar', aluguel: a })}
                              title="Cancelar"
                              style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                background: 'none', border: `1px solid ${colors.error}50`,
                                borderRadius: '8px', padding: '7px 10px', cursor: 'pointer',
                                color: colors.error, fontSize: '12px', fontWeight: 700,
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EF444415'; e.currentTarget.style.borderColor = colors.error; }}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = `${colors.error}50`; }}
                            >
                              <IconX /> Cancelar
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: colors.textSubtle, fontSize: '12px' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && alugueisExibidos.length > 0 && (
          <div style={{
            padding: '14px 28px', borderTop: `1px solid ${colors.border}`,
            display: 'flex', gap: '24px',
          }}>
            {['ATIVO', 'CONCLUIDO', 'CANCELADO'].map(s => {
              const count = alugueis.filter(a => a.status === s).length;
              const st = STATUS_MAP[s];
              return (
                <span key={s} style={{ color: colors.textSubtle, fontSize: '13px' }}>
                  <span style={{ color: st.color, fontWeight: 700 }}>{count}</span> {st.label.toLowerCase()}{count !== 1 ? 's' : ''}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Novo aluguel */}
      {modal && (
        <Modal title="Novo Aluguel" onClose={() => { setModal(false); setErro(''); }}>
          {erro && (
            <div style={{
              backgroundColor: '#2D1B1B', border: `1px solid ${colors.error}`,
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
              color: '#FCA5A5', fontSize: '13px',
            }}>
              {erro}
            </div>
          )}
          <FormAluguel
            clientes={clientes}
            carrosDisponiveis={disponiveis}
            onSalvar={handleCriar}
            onCancelar={() => { setModal(false); setErro(''); }}
            salvando={salvando}
          />
        </Modal>
      )}

      {/* Modal: Confirmar ação */}
      {confirmacao && (
        <Modal
          title={confirmacao.tipo === 'concluir' ? 'Concluir Aluguel' : 'Cancelar Aluguel'}
          onClose={() => setConfirmacao(null)}
          width="420px"
        >
          {(() => {
            const { tipo, aluguel } = confirmacao;
            const cliente = clienteMap[aluguel.clienteId];
            const carro   = carroMap[aluguel.carroId];
            const isConcluir = tipo === 'concluir';
            return (
              <>
                <div style={{
                  backgroundColor: isConcluir ? '#052e16' : '#2D1B1B',
                  border: `1px solid ${isConcluir ? '#10B981' : colors.error}`,
                  borderRadius: '10px', padding: '16px 20px', marginBottom: '24px',
                }}>
                  <p style={{ color: colors.textMuted, fontSize: '14px', lineHeight: 1.7 }}>
                    {isConcluir
                      ? 'O veículo será marcado como disponível e o aluguel encerrado.'
                      : 'O aluguel será cancelado e o veículo liberado para novos aluguéis.'}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
                  {[
                    { label: 'Aluguel', value: `#${aluguel.id}` },
                    { label: 'Cliente', value: cliente?.nome || `#${aluguel.clienteId}` },
                    { label: 'Veículo', value: carro ? `${carro.marca} ${carro.modelo} — ${carro.placa}` : `#${aluguel.carroId}` },
                    { label: 'Valor total', value: `R$ ${Number(aluguel.valorTotal).toFixed(2)}` },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: colors.textSubtle, fontSize: '13px' }}>{label}</span>
                      <span style={{ color: colors.textMain, fontSize: '13px', fontWeight: 700 }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button onClick={() => setConfirmacao(null)} style={btnSecondary}>Voltar</button>
                  <button
                    onClick={() => handleAcao(tipo, aluguel)}
                    style={{
                      ...btnPrimary,
                      backgroundColor: isConcluir ? '#10B981' : colors.error,
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = isConcluir ? '#059669' : '#DC2626'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = isConcluir ? '#10B981' : colors.error}
                  >
                    {isConcluir ? 'Confirmar Conclusão' : 'Confirmar Cancelamento'}
                  </button>
                </div>
              </>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}
