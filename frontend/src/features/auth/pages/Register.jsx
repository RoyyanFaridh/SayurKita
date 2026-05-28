import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/layouts/AuthLayout';
import AuthInput from '../components/AuthInput';
import StepIndicator from '../components/StepIndicator';
import { API_AUTH } from '../../../config/api';

// FIX 2: Steps sebagai derived value di dalam komponen,
// bukan konstanta statis di luar. Active state bisa diubah nanti
// jika StepIndicator dipakai di halaman verify/selesai juga.
function buildSteps(activeNum) {
  return [
    { num: 1, label: 'Daftar diri',   done: activeNum > 1, active: activeNum === 1 },
    { num: 2, label: 'Verifikasi HP', done: activeNum > 2, active: activeNum === 2 },
    { num: 3, label: 'Selesai',       done: activeNum > 3, active: activeNum === 3 },
  ];
}

// FIX 4 (sama dengan Login): Toast menggantikan semua alert() native.
function Toast({ message, type = 'error', onDismiss }) {
  const styles = {
    info:  'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-700',
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

export default function Register() {
  const navigate = useNavigate();

  const [agreed, setAgreed]         = useState(false);
  const [nama, setNama]             = useState('');
  const [phone, setPhone]           = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  // FIX 3: Field-level error state menggantikan global alert
  const [errors, setErrors] = useState({});

  // FIX 4: Toast state
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'error') => setToast({ message, type });
  const dismissToast = () => setToast(null);

  const validate = () => {
    const errs = {};
    if (!nama.trim())                         errs.nama     = 'Nama lengkap wajib diisi';
    if (!phone.trim())                        errs.phone    = 'Nomor HP wajib diisi';
    if (!email.trim())                        errs.email    = 'Email wajib diisi';
    if (password.length < 8)                  errs.password = 'Password minimal 8 karakter';
    if (confirm !== password)                 errs.confirm  = 'Password tidak sama';
    if (!agreed)                              errs.agreed   = 'Harap setujui syarat & ketentuan';
    return errs;
  };

  // FIX 4: handleSubmit sebagai handler form onSubmit
  // FIX 4: Pakai <form onSubmit> agar Enter di field berfungsi
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FIX 3: Validasi dengan field-level error
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      const res = await fetch(`${API_AUTH}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nama, phone, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        navigate(`/verify?phone=${encodeURIComponent(phone)}`);
      } else {
        showToast(data.message || 'Registrasi gagal. Coba lagi.');
      }
    } catch {
      showToast('Tidak dapat menghubungi server. Pastikan koneksi internetmu aktif.');
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
        FIX 6 (title prop): Pakai title + highlight, bukan JSX arbitrary.
        FIX 6 (eyebrow): 'Bergabung Sekarang' → huruf kecil semua,
        konsisten dengan Login yang pakai 'Selamat datang kembali'.
      */}
      <AuthLayout
        eyebrow="Bergabung sekarang"
        title="Mulai dari"
        highlight="dapurmu"
        subtitle="Daftar dua langkah saja. Akun langsung aktif tanpa proses approval dan tanpa biaya."
      >
        {/*
          FIX 1: Hapus wrapper <div max-w-140> dobel.
          FIX 5: AuthLayout yang mengontrol max-width, bukan halaman ini.
        */}

        {/* FIX 7: Hapus mb-2 manual, biarkan gap-6 dari AuthLayout bekerja */}
        <StepIndicator steps={buildSteps(1)} />

        {/* Heading */}
        <div className="flex flex-col gap-1">
          {/*
            FIX 2: Ganti inline style → Tailwind class,
            konsisten dengan Login versi revisi.
          */}
          <h2 className="font-display font-bold text-[clamp(1.375rem,2.5vw,1.75rem)] tracking-tight text-(--text-primary) m-0">
            Buat akun baru
          </h2>
          <p className="text-sm m-0 text-(--text-secondary)">
            Sudah punya akun?{' '}
            <a href="/login" className="font-semibold no-underline hover:underline text-(--accent-primary)">
              Masuk di sini
            </a>
          </p>
        </div>

        {/*
          FIX 4: Ganti <div> + button onClick → <form onSubmit>
          agar Enter di field berfungsi dan semantik HTML benar.
        */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>

          {/* Row: Nama + HP */}
          <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            <AuthInput
              id="nama"
              label="Nama Lengkap"
              type="text"
              placeholder="Sri Rahayu"
              value={nama}
              onChange={e => { setNama(e.target.value); setErrors(p => ({ ...p, nama: undefined })); }}
              autoComplete="name"
              error={errors.nama}
            />
            <AuthInput
              id="phone"
              label="Nomor HP"
              type="tel"
              placeholder="8xx-xxxx-xxxx"
              value={phone}
              onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: undefined })); }}
              autoComplete="tel"
              prefix="+62"
              error={errors.phone}
            />
          </div>

          <AuthInput
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
            autoComplete="email"
            error={errors.email}
          />

          <AuthInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
            autoComplete="new-password"
            hint="Minimal 8 karakter"
            error={errors.password}
          />

          <AuthInput
            id="confirm"
            label="Ulangi password"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: undefined })); }}
            autoComplete="new-password"
            error={errors.confirm}
          />

          {/* Checkbox agreed */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => { setAgreed(e.target.checked); setErrors(p => ({ ...p, agreed: undefined })); }}
                className="w-4 h-4 shrink-0 mt-0.5 cursor-pointer accent-(--accent-primary)"
                // FIX 8: accent-[var(--accent-primary)] = valid arbitrary value
              />
              <span className="text-sm leading-relaxed text-(--text-secondary)">
                Saya menyetujui{' '}
                <a href="/syarat" className="font-semibold no-underline hover:underline text-(--accent-primary)">
                  Syarat & Ketentuan
                </a>
                {' '}dan{' '}
                <a href="/privasi" className="font-semibold no-underline hover:underline text-(--accent-primary)">
                  Kebijakan Privasi
                </a>
              </span>
            </label>
            {/* FIX 3: Error agreed di bawah checkbox, bukan alert */}
            {errors.agreed && (
              <p className="text-xs text-red-500 ml-7">{errors.agreed}</p>
            )}
          </div>

          {/*
            FIX 3: type="submit" (bukan type="button")
            FIX 9: rounded-xl konsisten dengan Login versi revisi
            FIX 2: Hapus inline style + onMouseEnter/Leave
          */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-13 rounded-xl font-semibold text-base text-white transition-[background-color,transform] duration-150 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed bg-primary-900 hover:bg-primary-800"
          >
            {submitting ? 'Memproses…' : 'Lanjut'}
          </button>

        </form>

      </AuthLayout>
    </>
  );
}