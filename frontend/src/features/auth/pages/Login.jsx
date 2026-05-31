import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../../components/layouts/AuthLayout';
import AuthInput from '../components/AuthInput';
import { API_AUTH } from '../../../config/api';

// FIX 4 & 8: Komponen toast sederhana menggantikan alert() native.
// Bisa diganti dengan library toast (react-hot-toast, sonner, dll) kapan saja
// tanpa mengubah struktur halaman ini.
function Toast({ message, type = 'info', onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const styles = {
    info:    'bg-green-50 border-green-200 text-green-800',
    error:   'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-md max-w-sm w-[calc(100%-2rem)] ${styles[type]}`}
    >
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        aria-label="Tutup notifikasi"
        className="text-current opacity-50 hover:opacity-100 transition-opacity text-base leading-none"
      >
        ✕
      </button>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [remember, setRemember]     = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [submitting, setSubmitting] = useState(false);

  // FIX 4: toast state menggantikan alert()
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'info') => setToast({ message, type });
  const dismissToast = () => setToast(null);

  // FIX 8: useEffect pakai toast, bukan alert()
  useEffect(() => {
    if (searchParams.get('registered') === '1') {
      showToast('Registrasi berhasil. Silakan masuk dengan email atau nomor HP dan password Anda.', 'info');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_AUTH}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // FIX 5: remember sekarang dikirim ke API
        body: JSON.stringify({ identifier, password, remember }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.token) {
        // Selalu simpan ke localStorage agar konsisten dengan semua komponen
        // yang membaca token (Dashboard, DashboardLayout, ResepWidget, dll).
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        showToast(data.message || 'Login gagal. Periksa email/nomor HP dan password kamu.', 'error');
      }
    } catch {
      showToast('Tidak dapat menghubungi server. Pastikan koneksi internetmu aktif.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}

      {/*
        FIX 6: Pakai prop title dan highlight sebagaimana API AuthLayout dirancang.
        Hapus JSX arbitrary di dalam title prop.
      */}
      <AuthLayout
        eyebrow="Selamat datang kembali"
        title="Lanjutkan aksi"
        highlight="baikmu"
        subtitle="Masuk dan lihat surplus terbaru di sekitarmu"
      >
        {/*
          FIX 1: Hapus wrapper <div max-w-120> — AuthLayout sudah menangani ini.
          Children langsung dimulai dari konten, bukan wrapper ulang.
        */}

        {/* Heading section */}
        <div className="flex flex-col gap-1">
          {/*
            FIX 2: Ganti inline style dengan Tailwind class yang konsisten
            dengan gaya di AuthLayout dan komponen lain.
          */}
          <h2 className="font-display font-bold text-[clamp(1.375rem,2.5vw,1.75rem)] tracking-tight text-(--text-primary) m-0">
            Masuk ke akun
          </h2>
          <p className="text-sm m-0 text-(--text-secondary)">
            Belum punya akun?{' '}
            <a
              href="/register"
              className="font-semibold no-underline hover:underline text-(--accent-primary)"
            >
              Daftar
            </a>
          </p>
        </div>

        {/* Form */}
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
              <a
                href="/forgot-password"
                className="no-underline hover:underline hover:text-(--accent-primary) text-(--text-secondary) text-sm"
              >
                Lupa password?
              </a>
            }
          />

          {/* Checkbox remember */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="w-4 h-4 shrink-0 cursor-pointer accent-(--accent-primary)"
              // FIX 7: accent-[var(--accent-primary)] = valid Tailwind arbitrary value
            />
            <span className="text-sm text-(--text-secondary)">
              Ingat saya di perangkat ini
            </span>
          </label>

          {/*
            FIX 3: Hapus onMouseEnter/Leave untuk hover styling.
            Gunakan Tailwind hover: arbitrary value.
          */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-13 rounded-xl font-semibold text-base text-white transition-[background-color,transform] duration-150 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed bg-primary-900 hover:bg-primary-800"
          >
            {submitting ? 'Memproses…' : 'Masuk'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <span className="flex-1 h-px bg-(--border-subtle)" />
            <span className="text-sm text-neutral-400 whitespace-nowrap">atau</span>
            <span className="flex-1 h-px bg-(--border-subtle)" />
          </div>

        </form>

        {/* Footer legal */}
        <p className="text-xs text-neutral-400 text-center leading-relaxed m-0">
          Dengan masuk, kamu menyetujui{' '}
          <a href="/syarat" className="font-semibold hover:underline text-(--accent-primary)">
            Syarat & Ketentuan
          </a>
          {' '}dan{' '}
          <a href="/privasi" className="font-semibold hover:underline text-(--accent-primary)">
            Kebijakan Privasi
          </a>
          {' '}kami
        </p>

      </AuthLayout>
    </>
  );
}