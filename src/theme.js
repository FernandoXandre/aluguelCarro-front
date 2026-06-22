export const colors = {
  bg: '#111827',
  surface: '#1F2937',
  border: '#374151',
  primary: '#F59E0B',
  primaryHover: '#D97706',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  textSubtle: '#6B7280',
  error: '#EF4444',
  errorBg: '#2D1B1B',
  errorText: '#FCA5A5',
  success: '#10B981',
  successBg: '#052e16',
};

export const radius = {
  sm: '8px',
  md: '10px',
  lg: '14px',
  xl: '20px',
};

export const card = {
  backgroundColor: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: radius.xl,
  padding: '32px',
};

export const input = {
  backgroundColor: colors.bg,
  border: `1.5px solid ${colors.border}`,
  borderRadius: radius.md,
  padding: '14px 18px',
  color: colors.textMain,
  fontSize: '15px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

export const label = {
  color: colors.textMuted,
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
};

export const btnPrimary = {
  backgroundColor: colors.primary,
  color: colors.bg,
  border: 'none',
  borderRadius: radius.md,
  padding: '14px 24px',
  fontSize: '13px',
  fontWeight: 900,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

export const btnSecondary = {
  backgroundColor: 'transparent',
  color: colors.textMuted,
  border: `1.5px solid ${colors.border}`,
  borderRadius: radius.md,
  padding: '14px 24px',
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

export const pageTitle = {
  color: colors.textMain,
  fontSize: '28px',
  fontWeight: 900,
  marginBottom: '6px',
};

export const pageSubtitle = {
  color: colors.primary,
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  marginBottom: '10px',
};
