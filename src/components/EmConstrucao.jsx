import { colors, card } from '../theme';
import PageHeader from './PageHeader';

export default function EmConstrucao({ titulo, subtitulo }) {
  return (
    <div>
      <PageHeader subtitle={subtitulo} title={titulo} />
      <div style={{
        ...card,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 32px',
        gap: '16px',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: '48px' }}>🚧</span>
        <p style={{ color: colors.textMain, fontSize: '18px', fontWeight: 700 }}>
          Página em desenvolvimento
        </p>
        <p style={{ color: colors.textSubtle, fontSize: '14px', maxWidth: '360px', lineHeight: 1.6 }}>
          Esta seção está sendo construída e em breve estará disponível.
        </p>
      </div>
    </div>
  );
}
