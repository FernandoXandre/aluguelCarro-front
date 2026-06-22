import { colors, pageSubtitle, pageTitle } from '../theme';

export default function PageHeader({ subtitle, title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
      <div>
        <p style={pageSubtitle}>{subtitle}</p>
        <h1 style={pageTitle}>{title}</h1>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
