import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../../components/layouts/AuthLayout';
import AuthInput from '../components/AuthInput';
import GoogleIcon from '../components/GoogleIcon';
import { API_AUTH } from '../../../config/api';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [remember, setRemember]       = useState(false);
  const [identifier, setIdentifier]   = useState('');
  const [password, setPassword]       = useState('');
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === '1') {
      alert('Registrasi berhasil. Silakan masuk dengan email atau nomor HP dan password Anda.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_AUTH}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login gagal');
      }
    } catch {
      alert('Tidak dapat menghubungi server. Pastikan backend berjalan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Selamat datang kembali"
      title={
        <>
          Lanjutkan<br />aksi{' '}
          <span className="text-(--accent-primary) italic">baikmu</span>
        </>
      }
      subtitle="Masuk dan lihat surplus terbaru di sekitarmu"
    >
      <div className="w-full max-w-120 flex flex-col gap-6">

        <div className="flex flex-col gap-1">
          <h2
            className="font-bold m-0"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            Masuk ke akun
          </h2>
          <p className="text-sm m-0" style={{ color: 'var(--text-secondary)' }}>
            Belum punya akun?{' '}
            <a href="/register" className="font-semibold no-underline hover:underline" style={{ color: 'var(--accent-primary)' }}>
              Daftar
            </a>
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

          <AuthInput
            id="identifier"
            label="Email atau nomor HP"
            type="text"
            placeholder="you@example.com atau 08xx"
            autoComplete="username"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
          />

          <AuthInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            rightLabel={
              <a href="/forgot-password" className="no-underline hover:underline hover:text-(--accent-primary)">
                Lupa password?
              </a>
            }
          />

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="w-4.5 h-4.5 shrink-0 accent-primary-700 cursor-pointer"
            />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Ingat saya di perangkat ini
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-13 rounded-lg font-semibold text-base transition-[background-color,transform] duration-150 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary-900)', color: '#ffffff', fontFamily: 'Poppins, sans-serif' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-800)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-900)'}
          >
            {submitting ? 'Memproses…' : 'Masuk'}
          </button>

          <div className="flex items-center gap-3">
            <span className="flex-1 h-px bg-(--border-subtle)" />
            <span className="text-sm text-neutral-400 whitespace-nowrap">atau</span>
            <span className="flex-1 h-px bg-(--border-subtle)" />
          </div>

          <button
            type="button"
            className="w-full h-13 bg-white text-sm font-medium border-[1.5px] rounded-lg flex items-center justify-center gap-3 transition-[background-color,border-color] duration-150 hover:bg-neutral-50"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <GoogleIcon />
            Masuk dengan Google
          </button>

        </form>

        <p className="text-xs text-neutral-400 text-center leading-[1.6] m-0">
          Dengan masuk, kamu menyetujui{' '}
          <a href="/syarat" className="font-semibold hover:underline" style={{ color: 'var(--accent-primary)' }}>Syarat & Ketentuan</a>
          {' '}dan{' '}
          <a href="/privasi" className="font-semibold hover:underline" style={{ color: 'var(--accent-primary)' }}>Kebijakan Privasi</a>
          {' '}kami
        </p>

      </div>
    </AuthLayout>
  );
}