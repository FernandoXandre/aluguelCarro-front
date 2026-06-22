import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout({ onLogout }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111827' }}>
      <Navbar onLogout={onLogout} />
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '40px 32px',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
