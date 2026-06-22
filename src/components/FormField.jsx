import { colors, input, label as labelStyle } from '../theme';

export default function FormField({ label, error, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }}>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && (
        <span style={{ color: colors.error, fontSize: '12px' }}>{error}</span>
      )}
    </div>
  );
}

export function Input({ ...props }) {
  return (
    <input
      {...props}
      style={{
        ...input,
        ...(props.style || {}),
      }}
      onFocus={e => { e.target.style.borderColor = '#F59E0B'; if (props.onFocus) props.onFocus(e); }}
      onBlur={e => { e.target.style.borderColor = '#374151'; if (props.onBlur) props.onBlur(e); }}
    />
  );
}

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      style={{
        ...input,
        cursor: 'pointer',
        ...(props.style || {}),
      }}
      onFocus={e => { e.target.style.borderColor = '#F59E0B'; if (props.onFocus) props.onFocus(e); }}
      onBlur={e => { e.target.style.borderColor = '#374151'; if (props.onBlur) props.onBlur(e); }}
    >
      {children}
    </select>
  );
}
