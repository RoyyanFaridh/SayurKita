import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import AuthLayout from '../../../components/layouts/AuthLayout';
import StepIndicator from '../components/StepIndicator';
import { useState, useEffect } from 'react';

export default function Success() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      navigate('/login?registered=1', { replace: true });
      return;
    }
    const id = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown, navigate]);
  
  const steps = [
    { num: 1, label: 'Daftar diri',   done: true,  active: false },
    { num: 2, label: 'Verifikasi HP', done: true,  active: false },
    { num: 3, label: 'Selesai',       done: false, active: true  },
  ];

  return (
    <AuthLayout
      eyebrow="Bergabung Sekarang"
      title={
        <>
          Mulai dari{' '}
          <span className="text-(--accent-primary) italic block">
            dapurmu
          </span>
        </>
      }
      subtitle="Daftar dua langkah saja. Akun langsung aktif tanpa proses approval dan tanpa biaya."
    >
      <div className="w-full max-w-130 flex flex-col gap-10 max-[640px]:gap-8">

        <div className="flex items-start">
          {steps.map((s, i) => (
            <div key={s.num} className="flex flex-col items-center gap-2 flex-1 relative">
              <div
                className="w-8.5 h-8.5 rounded-full border-2 text-sm font-semibold flex items-center justify-center relative z-10 transition-[background,border-color,color] duration-200"
                style={
                  s.done
                    ? { background: 'var(--accent-primary)', borderColor: 'var(--accent-primary)', color: 'var(--color-forest-900)' }
                    : s.active
                    ? { background: 'var(--color-forest-900)', borderColor: 'var(--color-forest-900)', color: '#ffffff' }
                    : { background: '#ffffff', borderColor: 'var(--border-subtle)', color: 'var(--color-neutral-400)' }
                }
              >
                {s.done ? <Check size={14} strokeWidth={2.5} /> : s.num}
              </div>

              <span
                className="text-compact-sm text-center whitespace-nowrap"
                style={{
                  color: s.active ? 'var(--text-primary)' : 'var(--color-neutral-400)',
                  fontWeight: s.active ? 600 : 500,
                }}
              >
                {s.label}
              </span>

              {i < steps.length - 1 && (
                <div
                  className="absolute top-4.25 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-[2px] z-0 transition-[background] duration-200"
                  style={{
                    background: s.done ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-5 text-center">

          <div
            className="w-18 h-18 rounded-full flex items-center justify-center shrink-0 border-2"
            style={{
              background: 'var(--color-neutral-50)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            <Check size={28} strokeWidth={2.5} style={{ color: 'var(--color-forest-700)' }} />
          </div>

          <h2
            className="font-bold m-0"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Akun berhasil diverifikasi
          </h2>

          <p className="text-sm leading-[1.7] max-w-[38ch] m-0" style={{ color: 'var(--text-secondary)' }}>
            Selamat datang di SayurKita. Masuk dengan email atau nomor HP dan password untuk melanjutkan ke dashboard.
          </p>

          <button
            type="button"
            onClick={() => navigate('/login?registered=1')}
            className="w-full h-13 border-none rounded-lg cursor-pointer font-semibold text-base transition-[background-color,transform] duration-150 active:scale-[0.99]"
            style={{
              backgroundColor: 'var(--color-forest-900)',
              color: '#ffffff',
              fontFamily: 'Poppins, sans-serif'
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#112A1C')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-forest-900)')}
          >
            Lanjut ke halaman masuk ({countdown})
          </button>

        </div>

      </div>
    </AuthLayout>
  )
}