import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import FormField, { Input } from '../components/FormField';
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
function IconUser() {
  return <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
}

// ── Avatar com iniciais ────────────────────────────────────────
function Avatar({ nome }) {
  const iniciais = nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  const cores = ['#F59E0B', '#6366F1', '#10B981', '#F97316', '#EC4899', '#14B8A6'];
  const cor = cores[nome.charCodeAt(0) % cores.length];
  return (
    <div style={{
      width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
      backgroundColor: cor + '25', border: `1.5px solid ${cor}50`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: cor, fontSize: '12px', fontWeight: 800, letterSpacing: '0.05em',
    }}>
      {iniciais}
    </div>
  );
}

// ── Máscara de CPF: 000.000.000-00 ────────────────────────────
function mascaraCpf(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// ── Validação de CPF (algoritmo oficial Receita Federal) ───────
function cpfValido(cpf) {
  const nums = cpf.replace(/\D/g, '');
  if (nums.length !== 11 || /^(\d)\1{10}$/.test(nums)) return false;
  const calc = (len) =>
    nums.slice(0, len).split('').reduce((acc, d, i) => acc + Number(d) * (len + 1 - i), 0);
  const d1 = ((calc(9) * 10) % 11) % 10;
  const d2 = ((calc(10) * 10) % 11) % 10;
  return d1 === Number(nums[9]) && d2 === Number(nums[10]);
}

// ── Formulário ────────────────────────────────────────────────
const FORM_VAZIO = { nome: '', cpf: '', email: '', telefone: '', endereco: '', cnh: '' };

function FormCliente({ inicial, onSalvar, onCancelar, salvando }) {
  const [form, setForm] = useState(inicial || FORM_VAZIO);
  const [erros, setErros] = useState({});

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }));
    setErros(e => ({ ...e, [campo]: '' }));
  }

  function validar() {
    const e = {};
    if (!form.nome.trim())     e.nome     = 'Obrigatório';
    if (!form.cpf.trim())      e.cpf      = 'Obrigatório';
    else if (!cpfValido(form.cpf)) e.cpf  = 'CPF inválido';
    if (!form.email.trim())    e.email    = 'Obrigatório';
    if (!form.telefone.trim()) e.telefone = 'Obrigatório';
    if (!form.cnh.trim())      e.cnh      = 'Obrigatório';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errosVal = validar();
    if (Object.keys(errosVal).length) { setErros(errosVal); return; }
    onSalvar(form);
  }

  const fieldStyle = { backgroundColor: colors.bg };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <FormField label="Nome completo" error={erros.nome}>
        <Input placeholder="Ex: João da Silva" value={form.nome} onChange={e => set('nome', e.target.value)} style={fieldStyle} />
      </FormField>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="CPF" error={erros.cpf}>
          <Input placeholder="000.000.000-00" value={form.cpf} onChange={e => set('cpf', mascaraCpf(e.target.value))} style={fieldStyle} disabled={!!inicial} />
        </FormField>
        <FormField label="CNH" error={erros.cnh}>
          <Input placeholder="Número da CNH" value={form.cnh} onChange={e => set('cnh', e.target.value)} style={fieldStyle} />
        </FormField>
        <FormField label="E-mail" error={erros.email}>
          <Input type="email" placeholder="joao@email.com" value={form.email} onChange={e => set('email', e.target.value)} style={fieldStyle} />
        </FormField>
        <FormField label="Telefone" error={erros.telefone}>
          <Input placeholder="(00) 00000-0000" value={form.telefone} onChange={e => set('telefone', e.target.value)} style={fieldStyle} />
        </FormField>
      </div>

      <FormField label="Endereço">
        <Input placeholder="Rua, número, bairro, cidade" value={form.endereco} onChange={e => set('endereco', e.target.value)} style={fieldStyle} />
      </FormField>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
        <button type="button" onClick={onCancelar} style={btnSecondary}>Cancelar</button>
        <button
          type="submit"
          disabled={salvando}
          style={{ ...btnPrimary, opacity: salvando ? 0.6 : 1 }}
          onMouseEnter={e => !salvando && (e.currentTarget.style.backgroundColor = '#D97706')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F59E0B')}
        >
          {salvando ? 'Salvando...' : inicial ? 'Salvar Alterações' : 'Cadastrar Cliente'}
        </button>
      </div>
    </form>
  );
}

// ── Página principal ──────────────────────────────────────────
export default function Clientes() {
  const [clientes, setClientes]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [busca, setBusca]           = useState('');
  const [modal, setModal]           = useState(null);
  const [deletando, setDeletando]   = useState(null);
  const [salvando, setSalvando]     = useState(false);
  const [erro, setErro]             = useState('');

  async function carregar() {
    try {
      const data = await apiFetch('/clientes');
      setClientes(data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function handleSalvar(form) {
    setSalvando(true);
    setErro('');
    try {
      if (modal?.cliente) {
        await apiFetch(`/clientes/${modal.cliente.id}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await apiFetch('/clientes', { method: 'POST', body: JSON.stringify(form) });
      }
      await carregar();
      setModal(null);
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarDelete() {
    setErro('');
    try {
      await apiFetch(`/clientes/${deletando.id}`, { method: 'DELETE' });
      await carregar();
      setDeletando(null);
    } catch (e) {
      setErro(e.message);
      setDeletando(null);
    }
  }

  const clientesFiltrados = clientes.filter(c => {
    const termo = busca.toLowerCase();
    return !termo
      || c.nome.toLowerCase().includes(termo)
      || c.cpf.includes(termo)
      || c.email.toLowerCase().includes(termo)
      || c.telefone.includes(termo);
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
    color: colors.textMuted, fontSize: '14px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <PageHeader
        subtitle="Gestão de Clientes"
        title="Clientes"
        action={
          <button
            onClick={() => setModal('novo')}
            style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D97706'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F59E0B'}
          >
            <IconPlus /> Novo Cliente
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

      {/* Busca */}
      <div style={{ position: 'relative', maxWidth: '420px' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: colors.textSubtle }}>
          <IconSearch />
        </span>
        <input
          placeholder="Buscar por nome, CPF, e-mail ou telefone..."
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

      {/* Tabela */}
      <div style={{ ...card, padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: colors.textSubtle, fontSize: '14px' }}>
            Carregando clientes...
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: colors.textSubtle }}>
              <IconUser />
            </div>
            <p style={{ color: colors.textSubtle, fontSize: '14px' }}>Nenhum cliente encontrado.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: colors.bg + 'aa' }}>
                  {['Cliente', 'CPF', 'E-mail', 'Telefone', 'CNH', ''].map((h, i) => (
                    <th key={i} style={{ ...thStyle, padding: i === 0 ? '14px 16px 14px 28px' : thStyle.padding }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map(c => (
                  <tr
                    key={c.id}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.bg + '88'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    style={{ transition: 'background-color 0.15s' }}
                  >
                    <td style={{ ...tdStyle, padding: '16px 16px 16px 28px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar nome={c.nome} />
                        <div>
                          <p style={{ color: colors.textMain, fontWeight: 700, fontSize: '14px' }}>{c.nome}</p>
                          {c.endereco && (
                            <p style={{ color: colors.textSubtle, fontSize: '12px', marginTop: '2px' }}>{c.endereco}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'monospace', fontSize: '13px', letterSpacing: '0.04em' }}>{c.cpf}</span>
                    </td>
                    <td style={tdStyle}>{c.email}</td>
                    <td style={tdStyle}>{c.telefone}</td>
                    <td style={tdStyle}>
                      <span style={{
                        backgroundColor: colors.bg, border: `1px solid ${colors.border}`,
                        borderRadius: '6px', padding: '3px 8px',
                        fontSize: '12px', fontFamily: 'monospace',
                      }}>
                        {c.cnh}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, paddingRight: '28px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setModal({ cliente: c })}
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
                          onClick={() => setDeletando(c)}
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

        {!loading && clientesFiltrados.length > 0 && (
          <div style={{
            padding: '14px 28px', borderTop: `1px solid ${colors.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ color: colors.textSubtle, fontSize: '13px' }}>
              {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''} encontrado{clientesFiltrados.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Modal: Novo / Editar */}
      {modal && (
        <Modal
          title={modal === 'novo' ? 'Cadastrar Cliente' : `Editar — ${modal.cliente.nome}`}
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
          <FormCliente
            inicial={modal?.cliente}
            onSalvar={handleSalvar}
            onCancelar={() => { setModal(null); setErro(''); }}
            salvando={salvando}
          />
        </Modal>
      )}

      {/* Modal: Confirmar exclusão */}
      {deletando && (
        <Modal title="Excluir Cliente" onClose={() => setDeletando(null)} width="420px">
          <p style={{ color: colors.textMuted, fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>
            Tem certeza que deseja excluir o cliente{' '}
            <span style={{ color: colors.textMain, fontWeight: 700 }}>{deletando.nome}</span>?
            A exclusão será bloqueada caso existam aluguéis vinculados.
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
