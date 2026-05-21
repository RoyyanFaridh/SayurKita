import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/layouts/AuthLayout';
import AuthInput from '../components/AuthInput';
import StepIndicator from '../components/StepIndicator';
import { API_AUTH } from '../../../config/api';

const steps = [
  { num: 1, label: 'Daftar diri',    done: false, active: true  },
  { num: 2, label: 'Verifikasi HP',  done: false, active: false },
  { num: 3, label: 'Selesai',        done: false, active: false },
];

export default function Register() {
  const navigate = useNavigate();
  const [agreed, setAgreed]     = useState(false);
  const [nama, setNama]         = useState('');
  const [phone, setPhone]       = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!agreed) return alert('Harap setujui syarat & ketentuan');
    if (password !== confirm) return alert('Password tidak sama');

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
        alert(data.message || 'Registrasi gagal');
      }
    } catch {
      alert('Tidak dapat menghubungi server. Pastikan backend berjalan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Bergabung Sekarang"
      title={
        <>
          Mulai dari{' '}
          <span className="text-(--accent-primary) italic block">dapurmu</span>
        </>
      }
      subtitle="Daftar dua langkah saja. Akun langsung aktif tanpa proses approval dan tanpa biaya."
    >
      <div className="w-full max-w-140 flex flex-col gap-6 max-[640px]:gap-5">

        <div className="flex items-start gap-0 mb-2">
          <StepIndicator steps={steps} />

        </div>

        <div className="flex flex-col gap-1">
          <h2
            className="font-bold m-0"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            Buat akun baru
          </h2>
          <p className="text-sm m-0" style={{ color: 'var(--text-secondary)' }}>
            Sudah punya akun?{' '}
            <a href="/login" className="font-semibold no-underline hover:underline" style={{ color: 'var(--accent-primary)' }}>
              Masuk di sini
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-5">

          <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            <AuthInput
              id="nama"
              label="Nama Lengkap"
              type="text"
              placeholder="Sri Rahayu"
              value={nama}
              onChange={e => setNama(e.target.value)}
              autoComplete="name"
            />
            <AuthInput
              id="phone"
              label="Nomor HP"
              type="tel"
              placeholder="8xx-xxxx-xxxx"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              autoComplete="tel"
              prefix="+62"
            />
          </div>

          <AuthInput
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />

          <AuthInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
            hint="Minimal 8 karakter"
          />

          <AuthInput
            id="confirm"
            label="Ulangi password"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            autoComplete="new-password"
          />

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="w-4.5 h-4.5 shrink-0 mt-0.5 accent-primary-700 cursor-pointer"
            />
            <span className="text-sm leading-[1.5]" style={{ color: 'var(--text-secondary)' }}>
              Saya menyetujui{' '}
              <a href="/syarat" className="font-semibold no-underline hover:underline" style={{ color: 'var(--accent-primary)' }}>Syarat & Ketentuan</a>
              {' '}dan{' '}
              <a href="/privasi" className="font-semibold no-underline hover:underline" style={{ color: 'var(--accent-primary)' }}>Kebijakan Privasi</a>
            </span>
          </label>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-13 rounded-lg font-semibold text-base transition-[background-color,transform] duration-150 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary-900)', color: '#ffffff', fontFamily: 'Poppins, sans-serif' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-800)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-900)'}
          >
            {submitting ? 'Memproses…' : 'Lanjut'}
          </button>

        </div>
      </div>
    </AuthLayout>
  );
}