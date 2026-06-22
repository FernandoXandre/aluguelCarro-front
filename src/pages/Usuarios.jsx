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
function IconTrash() {
  return <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
}

// ── Badge de perfil ───────────────────────────────────────────
function PerfilBadge({ perfil }) {
  const isAdmin = perfil === 'ADMIN';
  return (
    <span style={{
      backgroundColor: isAdmin ? '#F59E0B18' : '#6366F118',
      color: isAdmin ? '#F59E0B' : '#818CF8',
      border: `1px solid ${isAdmin ? '#F59E0B40' : '#6366F140'}`,
      borderRadius: '6px', padding: '3px 10px',
      fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
    }}>
      {isAdmin ? 'Admin' : 'Atendente'}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────────
function Avatar({ username, perfil }) {
  const cor = perfil === 'ADMIN' ? '#F59E0B' : '#6366F1';
  return (
    <div style={{
      width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
      backgroundColor: cor + '20', border: `1.5px solid ${cor}40`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: cor, fontSize: '13px', fontWeight: 800,
    }}>
      {username[0].toUpperCase()}
    </div>
  );
}

// ── Formulário ────────────────────────────────────────────────
const FORM_VAZIO = { username: '', senha: '', perfil: '' };

function FormUsuario({ onSalvar, onCancelar, salvando }) {
  const [form, setForm] = useState(FORM_VAZIO);
  const [erros, setErros] = useState({});
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }));
    setErros(e => ({ ...e, [campo]: '' }));
  }

  function validar() {
    const e = {};
    if (!form.username.trim()) e.username = 'Obrigatório';
    if (!form.senha.trim())    e.senha    = 'Obrigatório';
    if (form.senha.length < 6) e.senha    = 'Mínimo de 6 caracteres';
    if (!form.perfil)          e.perfil   = 'Selecione um perfil';
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
      <FormField label="Username" error={erros.username}>
        <Input
          placeholder="Ex: joao.silva"
          value={form.username}
          onChange={e => set('username', e.target.value.toLowerCase().replace(/\s/g, ''))}
          style={fieldStyle}
        />
      </FormField>

      <FormField label="Senha" error={erros.senha}>
        <div style={{ position: 'relative' }}>
          <Input
            type={mostrarSenha ? 'text' : 'password'}
            placeholder="Mínimo 6 caracteres"
            value={form.senha}
            onChange={e => set('senha', e.target.value)}
            style={{ ...fieldStyle, paddingRight: '44px' }}
          />
          <button
            type="button"
            onClick={() => setMostrarSenha(v => !v)}
            style={{
              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: colors.textSubtle,
              display: 'flex', alignItems: 'center', padding: '4px',
            }}
          >
            {mostrarSenha
              ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            }
          </button>
        </div>
      </FormField>

      <FormField label="Perfil" error={erros.perfil}>
        <Select value={form.perfil} onChange={e => set('perfil', e.target.value)} style={fieldStyle}>
          <option value="">Selecione...</option>
          <option value="ADMIN">Admin — acesso total ao sistema</option>
          <option value="ATENDENTE">Atendente — acesso operacional</option>
        </Select>
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
          {salvando ? 'Cadastrando...' : 'Cadastrar Usuário'}
        </button>
      </div>
    </form>
  );
}

// ── Página principal ──────────────────────────────────────────
export default function Usuarios() {
  const [usuarios, setUsuarios]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [deletando, setDeletando] = useState(null);
  const [salvando, setSalvando]   = useState(false);
  const [erro, setErro]           = useState('');

  async function carregar() {
    try {
      const data = await apiFetch('/usuarios');
      setUsuarios(data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function handleSalvar(form) {
    setSalvando(true);
    setErro('');
    try {
      await apiFetch('/usuarios', { method: 'POST', body: JSON.stringify(form) });
      await carregar();
      setModal(false);
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarDelete() {
    setErro('');
    try {
      await apiFetch(`/usuarios/${deletando.id}`, { method: 'DELETE' });
      await carregar();
      setDeletando(null);
    } catch (e) {
      setErro(e.message);
      setDeletando(null);
    }
  }

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

  const admins     = usuarios.filter(u => u.perfil === 'ADMIN').length;
  const atendentes = usuarios.filter(u => u.perfil === 'ATENDENTE').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <PageHeader
        subtitle="Gestão de Usuários"
        title="Usuários"
        action={
          <button
            onClick={() => setModal(true)}
            style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D97706'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F59E0B'}
          >
            <IconPlus /> Novo Usuário
          </button>
        }
      />

      {/* Cards de resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total de usuários', value: usuarios.length, color: colors.primary },
          { label: 'Administradores',   value: admins,          color: '#F59E0B' },
          { label: 'Atendentes',        value: atendentes,      color: '#6366F1' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            ...card, padding: '20px 24px',
            borderLeft: `3px solid ${color}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ color: colors.textSubtle, fontSize: '13px', fontWeight: 600 }}>{label}</span>
            <span style={{ color, fontSize: '28px', fontWeight: 900 }}>{loading ? '—' : value}</span>
          </div>
        ))}
      </div>

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

      {/* Tabela */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: colors.textSubtle, fontSize: '14px' }}>
            Carregando usuários...
          </div>
        ) : usuarios.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <p style={{ color: colors.textSubtle, fontSize: '14px' }}>Nenhum usuário cadastrado.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: colors.bg + 'aa' }}>
                {['Usuário', 'Perfil', 'ID', ''].map((h, i) => (
                  <th key={i} style={{ ...thStyle, padding: i === 0 ? '14px 16px 14px 28px' : thStyle.padding }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr
                  key={u.id}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.bg + '88'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  style={{ transition: 'background-color 0.15s' }}
                >
                  <td style={{ ...tdStyle, padding: '16px 16px 16px 28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar username={u.username} perfil={u.perfil} />
                      <span style={{ color: colors.textMain, fontWeight: 700, fontSize: '14px' }}>{u.username}</span>
                    </div>
                  </td>
                  <td style={tdStyle}><PerfilBadge perfil={u.perfil} /></td>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: 'monospace', color: colors.textSubtle, fontSize: '13px' }}>#{u.id}</span>
                  </td>
                  <td style={{ ...tdStyle, paddingRight: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setDeletando(u)}
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
        )}
      </div>

      {/* Modal: Novo usuário */}
      {modal && (
        <Modal title="Cadastrar Usuário" onClose={() => { setModal(false); setErro(''); }}>
          {erro && (
            <div style={{
              backgroundColor: '#2D1B1B', border: `1px solid ${colors.error}`,
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
              color: '#FCA5A5', fontSize: '13px',
            }}>{erro}</div>
          )}
          <FormUsuario
            onSalvar={handleSalvar}
            onCancelar={() => { setModal(false); setErro(''); }}
            salvando={salvando}
          />
        </Modal>
      )}

      {/* Modal: Confirmar exclusão */}
      {deletando && (
        <Modal title="Excluir Usuário" onClose={() => setDeletando(null)} width="400px">
          <p style={{ color: colors.textMuted, fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>
            Tem certeza que deseja excluir o usuário{' '}
            <span style={{ color: colors.textMain, fontWeight: 700 }}>{deletando.username}</span>?
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
