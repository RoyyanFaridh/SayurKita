import { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import AuthLayout from '../../../components/layouts/AuthLayout';
import StepIndicator from '../components/StepIndicator';

const OTP_LENGTH = 6;
const TIMER_START = 60;

const steps = [
  { num: 1, label: 'Daftar diri',    done: true, active: false  },
  { num: 2, label: 'Verifikasi HP',  done: false, active: true },
  { num: 3, label: 'Selesai',        done: false, active: false },
];

export default function Verify({ phone = '812-3456-7890', onBack, onDone }) {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(TIMER_START);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const pad = n => String(n).padStart(2, '0');
  const formatted = `${pad(Math.floor(timer / 60))}:${pad(timer % 60)}`;

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < OTP_LENGTH - 1) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const next = [...otp];
    [...pasted].forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleResend = () => {
    setTimer(TIMER_START);
    setCanResend(false);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  };

  const handleVerify = () => {
    if (otp.join('').length < OTP_LENGTH) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onDone?.(); }, 1200);
  };

  const isFilled = otp.every(d => d !== '');

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
      <div className="w-full max-w-130 flex flex-col gap-6 max-[640px]:gap-5">

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
                style={{ color: s.active ? 'var(--text-primary)' : 'var(--color-neutral-400)', fontWeight: s.active ? 600 : 500 }}
              >
                {s.label}
              </span>

              {i < steps.length - 1 && (
                <div
                  className="absolute top-4.25 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-[2px] z-0"
                  style={{ background: s.done ? 'var(--accent-primary)' : 'var(--border-subtle)' }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <h2
            className="font-bold m-0"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em'
            }}
          >
            Verifikasi Nomor HP
          </h2>
          <p className="text-sm m-0 leading-normal" style={{ color: 'var(--text-secondary)' }}>
            Masukkan 6 kode verifikasi yang dikirim ke nomormu.
          </p>
        </div>

        <div className="flex items-center gap-4 px-5 py-4 border-[1.5px] rounded-lg"
          style={{ background: 'var(--color-neutral-50)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0"
            style={{ background: 'var(--color-forest-900)', color: 'var(--accent-primary)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <circle cx="12" cy="17" r="1" />
            </svg>
          </div>

          <div className="flex-1 flex flex-col gap-[2px]">
            <span className="text-compact-sm font-medium tracking-[0.02em]" style={{ color: 'var(--text-secondary)' }}>
              Kode dikirim ke
            </span>
            <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              +62 {phone}
            </span>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold"
            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)' }}
          >
            Ubah
          </button>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 border-[1.5px] rounded-full w-fit"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Berlaku selama
          </span>
          <span className="text-sm font-bold"
            style={{
              color: timer <= 10 ? '#C0392B' : 'var(--color-forest-900)',
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {formatted}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Kode OTP
          </label>

          <div className="flex gap-3 max-[640px]:gap-2" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => inputRefs.current[idx] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e.target.value, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                className="flex-1 min-w-0 aspect-square max-w-18 text-center text-2xl font-bold outline-none rounded-lg border-[1.5px]"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: 'var(--text-primary)',
                  borderColor: digit ? 'var(--color-forest-900)' : 'var(--border-subtle)',
                  background: digit ? '#f2f8f3' : '#ffffff'
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 max-[640px]:flex-col-reverse">

          <button
            onClick={onBack}
            className="flex-1 h-13 text-base font-semibold rounded-lg border-[1.5px]"
            style={{
              background: '#ffffff',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            Kembali
          </button>

          <button
            onClick={handleVerify}
            disabled={!isFilled || loading}
            className="flex-2 h-13 text-base font-semibold rounded-lg flex items-center justify-center disabled:opacity-45 disabled:cursor-not-allowed"
            style={{
              background: 'var(--color-forest-900)',
              color: '#ffffff',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            {loading ? 'Memverifikasi…' : 'Verifikasi'}
          </button>

        </div>

      </div>
    </AuthLayout>
  );
}