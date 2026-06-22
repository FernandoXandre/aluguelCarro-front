import { colors, card } from '../theme';

export default function StatCard({ label, value, icon, color }) {
  const accent = color || colors.primary;
  return (
    <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{
        width: '52px', height: '52px', borderRadius: '12px',
        backgroundColor: accent + '20',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '22px' }}>{icon}</span>
      </div>
      <div>
        <p style={{ color: colors.textSubtle, fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
          {label}
        </p>
        <p style={{ color: colors.textMain, fontSize: '28px', fontWeight: 900, lineHeight: 1 }}>
          {value ?? '—'}
        </p>
      </div>
    </div>
  );
}
