import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { API_ORIGIN } from '../../config/api';

export default function ProtectedRoute() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('anon');
      return;
    }

    let cancelled = false;

    fetch(`${API_ORIGIN}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (cancelled) return;
        if (!res.ok) {
          localStorage.removeItem('token');
          setStatus('anon');
          return;
        }
        setStatus('authed');
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem('token');
        setStatus('anon');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'loading') {
    return (
      <div
        className="flex min-h-[50vh] items-center justify-center text-sm"
        style={{ color: 'var(--text-secondary)' }}
      >
        Memverifikasi sesi…
      </div>
    );
  }

  if (status === 'anon') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
