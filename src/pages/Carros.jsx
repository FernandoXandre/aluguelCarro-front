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
function IconEdit() {
  return <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
}
function IconTrash() {
  return <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
}
function IconSearch() {
  return <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
}

// ── Badge de disponibilidade ──────────────────────────────────
function DisponibilidadeBadge({ disponivel }) {
  return (
    <span style={{
      backgroundColor: disponivel ? '#052e16' : '#2D1B1B',
      color: disponivel ? '#10B981' : '#F97316',
      border: `1px solid ${disponivel ? '#10B981' : '#F97316'}`,
      borderRadius: '6px',
      padding: '3px 10px',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.08em',
      whiteSpace: 'nowrap',
    }}>
      {disponivel ? 'Disponível' : 'Alugado'}
    </span>
  );
}

// ── Formulário ────────────────────────────────────────────────
const FORM_VAZIO = { marca: '', modelo: '', placa: '', ano: '', categoria: '', valorDiaria: '', disponivel: true };

function FormCarro({ inicial, onSalvar, onCancelar, salvando }) {
  const [form, setForm] = useState(inicial || FORM_VAZIO);
  const [erros, setErros] = useState({});

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }));
    setErros(e => ({ ...e, [campo]: '' }));
  }

  function validar() {
    const e = {};
    if (!form.marca.trim())     e.marca       = 'Obrigatório';
    if (!form.modelo.trim())    e.modelo      = 'Obrigatório';
    if (!form.placa.trim())     e.placa       = 'Obrigatório';
    if (!form.ano)              e.ano         = 'Obrigatório';
    if (!form.categoria.trim()) e.categoria   = 'Obrigatório';
    if (!form.valorDiaria)      e.valorDiaria = 'Obrigatório';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errosVal = validar();
    if (Object.keys(errosVal).length) { setErros(errosVal); return; }
    onSalvar({ ...form, ano: Number(form.ano), valorDiaria: Number(form.valorDiaria) });
  }

  const fieldStyle = { backgroundColor: colors.bg };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Marca" error={erros.marca}>
          <Input placeholder="Ex: Toyota" value={form.marca} onChange={e => set('marca', e.target.value)} style={fieldStyle} />
        </FormField>
        <FormField label="Modelo" error={erros.modelo}>
          <Input placeholder="Ex: Corolla" value={form.modelo} onChange={e => set('modelo', e.target.value)} style={fieldStyle} />
        </FormField>
        <FormField label="Placa" error={erros.placa}>
          <Input placeholder="Ex: ABC-1234" value={form.placa} onChange={e => set('placa', e.target.value.toUpperCase())} style={fieldStyle} disabled={!!inicial} />
        </FormField>
        <FormField label="Ano" error={erros.ano}>
          <Input type="number" placeholder="Ex: 2023" min="1990" max="2030" value={form.ano} onChange={e => set('ano', e.target.value)} style={fieldStyle} />
        </FormField>
        <FormField label="Categoria" error={erros.categoria}>
          <Select value={form.categoria} onChange={e => set('categoria', e.target.value)} style={fieldStyle}>
            <option value="">Selecione...</option>
            {['Econômico', 'Intermediário', 'SUV', 'Luxo', 'Utilitário'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </FormField>
        <FormField label="Valor da Diária (R$)" error={erros.valorDiaria}>
          <Input type="number" placeholder="Ex: 150.00" step="0.01" min="0" value={form.valorDiaria} onChange={e => set('valorDiaria', e.target.value)} style={fieldStyle} />
        </FormField>
      </div>

      {inicial && (
        <FormField label="Disponibilidade">
          <Select value={form.disponivel ? 'true' : 'false'} onChange={e => set('disponivel', e.target.value === 'true')} style={fieldStyle}>
            <option value="true">Disponível</option>
            <option value="false">Alugado</option>
          </Select>
        </FormField>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
        <button type="button" onClick={onCancelar} style={btnSecondary}>Cancelar</button>
        <button
          type="submit"
          disabled={salvando}
          style={{ ...btnPrimary, opacity: salvando ? 0.6 : 1 }}
          onMouseEnter={e => !salvando && (e.target.style.backgroundColor = '#D97706')}
          onMouseLeave={e => (e.target.style.backgroundColor = '#F59E0B')}
        >
          {salvando ? 'Salvando...' : inicial ? 'Salvar Alterações' : 'Cadastrar Veículo'}
        </button>
      </div>
    </form>
  );
}

// ── Página principal ──────────────────────────────────────────
export default function Carros() {
  const [carros, setCarros]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [busca, setBusca]           = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [modal, setModal]           = useState(null); // null | 'novo' | { carro }
  const [deletando, setDeletando]   = useState(null);
  const [salvando, setSalvando]     = useState(false);
  const [erro, setErro]             = useState('');

  async function carregar() {
    try {
      const data = await apiFetch('/carros');
      setCarros(data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function handleSalvar(form) {
    setSalvando(true);
    setErro('');
    try {
      if (modal?.carro) {
        await apiFetch(`/carros/${modal.carro.id}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await apiFetch('/carros', { method: 'POST', body: JSON.stringify(form) });
      }
      await carregar();
      setModal(null);
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar(carro) {
    setDeletando(carro);
  }

  async function confirmarDelete() {
    setErro('');
    try {
      await apiFetch(`/carros/${deletando.id}`, { method: 'DELETE' });
      await carregar();
      setDeletando(null);
    } catch (e) {
      setErro(e.message);
      setDeletando(null);
    }
  }

  const carrosFiltrados = carros.filter(c => {
    const termo = busca.toLowerCase();
    const buscaOk = !termo || c.marca.toLowerCase().includes(termo) || c.modelo.toLowerCase().includes(termo) || c.placa.toLowerCase().includes(termo);
    const statusOk = filtroStatus === 'todos' || (filtroStatus === 'disponivel' ? c.disponivel : !c.disponivel);
    return buscaOk && statusOk;
  });

  const thStyle = {
    textAlign: 'left', color: colors.textSubtle,
    fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', padding: '0 16px 14px 0',
    borderBottom: `1px solid ${colors.border}`,
  };
  const tdStyle = {
    padding: '16px 16px 16px 0',
    borderBottom: `1px solid ${colors.border}`,
    color: colors.textMuted,
    fontSize: '14px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <PageHeader
        subtitle="Frota de Veículos"
        title="Carros"
        action={
          <button
            onClick={() => setModal('novo')}
            style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D97706'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F59E0B'}
          >
            <IconPlus /> Novo Veículo
          </button>
        }
      />

      {/* Mensagem de erro global */}
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
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: colors.textSubtle }}>
            <IconSearch />
          </span>
          <input
            placeholder="Buscar por marca, modelo ou placa..."
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
        {['todos', 'disponivel', 'alugado'].map(s => (
          <button
            key={s}
            onClick={() => setFiltroStatus(s)}
            style={{
              padding: '12px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', border: 'none', transition: 'all 0.2s',
              backgroundColor: filtroStatus === s ? colors.primary : colors.surface,
              color: filtroStatus === s ? colors.bg : colors.textMuted,
            }}
          >
            {{ todos: 'Todos', disponivel: 'Disponíveis', alugado: 'Alugados' }[s]}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div style={{ ...card, padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: colors.textSubtle, fontSize: '14px' }}>
            Carregando veículos...
          </div>
        ) : carrosFiltrados.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <p style={{ color: colors.textSubtle, fontSize: '14px' }}>Nenhum veículo encontrado.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: colors.bg + 'aa' }}>
                  {['Veículo', 'Placa', 'Ano', 'Categoria', 'Diária', 'Status', ''].map((h, i) => (
                    <th key={i} style={{ ...thStyle, padding: i === 0 ? '14px 16px 14px 28px' : thStyle.padding }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {carrosFiltrados.map(c => (
                  <tr
                    key={c.id}
                    style={{ transition: 'background-color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.bg + '88'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ ...tdStyle, padding: '16px 16px 16px 28px' }}>
                      <p style={{ color: colors.textMain, fontWeight: 700, fontSize: '14px' }}>{c.marca} {c.modelo}</p>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'monospace', letterSpacing: '0.08em', color: colors.textMain, backgroundColor: colors.bg, padding: '3px 8px', borderRadius: '6px', fontSize: '13px' }}>
                        {c.placa}
                      </span>
                    </td>
                    <td style={tdStyle}>{c.ano}</td>
                    <td style={tdStyle}>{c.categoria}</td>
                    <td style={{ ...tdStyle, color: colors.primary, fontWeight: 700 }}>
                      R$ {Number(c.valorDiaria).toFixed(2)}
                    </td>
                    <td style={tdStyle}><DisponibilidadeBadge disponivel={c.disponivel} /></td>
                    <td style={{ ...tdStyle, paddingRight: '28px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setModal({ carro: c })}
                          title="Editar"
                          style={{
                            background: 'none', border: `1px solid ${colors.border}`,
                            borderRadius: '8px', padding: '7px', cursor: 'pointer',
                            color: colors.textMuted, display: 'flex', alignItems: 'center',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = colors.primary; e.currentTarget.style.color = colors.primary; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textMuted; }}
                        >
                          <IconEdit />
                        </button>
                        <button
                          onClick={() => handleDeletar(c)}
                          title="Excluir"
                          style={{
                            background: 'none', border: `1px solid ${colors.border}`,
                            borderRadius: '8px', padding: '7px', cursor: 'pointer',
                            color: colors.textMuted, display: 'flex', alignItems: 'center',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = colors.error; e.currentTarget.style.color = colors.error; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textMuted; }}
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Rodapé da tabela */}
        {!loading && carrosFiltrados.length > 0 && (
          <div style={{
            padding: '14px 28px', borderTop: `1px solid ${colors.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ color: colors.textSubtle, fontSize: '13px' }}>
              {carrosFiltrados.length} veículo{carrosFiltrados.length !== 1 ? 's' : ''} encontrado{carrosFiltrados.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Modal: Novo / Editar */}
      {modal && (
        <Modal
          title={modal === 'novo' ? 'Cadastrar Veículo' : `Editar — ${modal.carro.marca} ${modal.carro.modelo}`}
          onClose={() => { setModal(null); setErro(''); }}
        >
          {erro && (
            <div style={{
              backgroundColor: '#2D1B1B', border: `1px solid ${colors.error}`,
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
              color: '#FCA5A5', fontSize: '13px',
            }}>
              {erro}
            </div>
          )}
          <FormCarro
            inicial={modal?.carro}
            onSalvar={handleSalvar}
            onCancelar={() => { setModal(null); setErro(''); }}
            salvando={salvando}
          />
        </Modal>
      )}

      {/* Modal: Confirmar exclusão */}
      {deletando && (
        <Modal title="Excluir Veículo" onClose={() => setDeletando(null)} width="420px">
          <p style={{ color: colors.textMuted, fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>
            Tem certeza que deseja excluir o veículo{' '}
            <span style={{ color: colors.textMain, fontWeight: 700 }}>{deletando.marca} {deletando.modelo}</span>{' '}
            (placa <span style={{ color: colors.textMain, fontWeight: 700 }}>{deletando.placa}</span>)?
            Esta ação não pode ser desfeita.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button onClick={() => setDeletando(null)} style={btnSecondary}>Cancelar</button>
            <button
              onClick={confirmarDelete}
              style={{ ...btnPrimary, backgroundColor: colors.error }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#DC2626'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = colors.error}
            >
              Excluir
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
