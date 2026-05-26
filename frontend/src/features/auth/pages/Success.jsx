import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import AuthLayout from '../../../components/layouts/AuthLayout';
import StepIndicator from '../components/StepIndicator';

const COUNTDOWN_START = 5;

function buildSteps(activeNum) {
  return [
    { num: 1, label: 'Daftar diri',   done: activeNum > 1, active: activeNum === 1 },
    { num: 2, label: 'Verifikasi HP', done: activeNum > 2, active: activeNum === 2 },
    { num: 3, label: 'Selesai',       done: activeNum > 3, active: activeNum === 3 },
  ];
}

export default function Success() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (countdown <= 0) {
      navigate('/login?registered=1', { replace: true });
      return;
    }
    const id = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown, navigate, paused]);

  const handleNavigate = useCallback(() => {
    navigate('/login?registered=1', { replace: true });
  }, [navigate]);

  return (
    <AuthLayout
      eyebrow="Bergabung sekarang"
      title="Mulai dari"
      highlight="dapurmu"
      subtitle="Daftar dua langkah saja. Akun langsung aktif tanpa proses approval dan tanpa biaya."
    >
      <StepIndicator steps={buildSteps(3)} />

      <div className="flex flex-col items-center gap-5 text-center">
        <div className="w-18 h-18 rounded-full flex items-center justify-center shrink-0 bg-(--accent-primary)">
          <Check
            size={28}
            strokeWidth={2.5}
            className="text-(--color-forest-900)"
          />
        </div>

        <h2 className="font-display font-bold text-[clamp(1.625rem,3.5vw,2.125rem)] tracking-tight leading-tight text-(--text-primary) m-0">
          Akun berhasil diverifikasi
        </h2>

        <p className="text-sm leading-relaxed max-w-[38ch] m-0 text-(--text-secondary)">
          Selamat datang di SayurKita. Masuk dengan email atau nomor HP dan password untuk melanjutkan ke dashboard.
        </p>

        <button
          type="button"
          onClick={handleNavigate}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="w-full h-13 rounded-xl font-semibold text-base text-white transition-[background-color,transform] duration-150 active:scale-[0.99] bg-(--color-forest-900) hover:bg-(--color-forest-800)"
        >
          {paused
            ? 'Lanjut ke halaman masuk →'
            : `Lanjut ke halaman masuk (${countdown})`
          }
        </button>

      </div>

    </AuthLayout>
  );
}