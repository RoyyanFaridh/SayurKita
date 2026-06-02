import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../../components/layouts/AuthLayout';
import StepIndicator from '../components/StepIndicator';
import { API_AUTH } from '../../../config/api';

const OTP_LENGTH  = 6;
const TIMER_START = 300;

function buildSteps(activeNum) {
  return [
    { num: 1, label: 'Daftar diri',   done: activeNum > 1, active: activeNum === 1 },
    { num: 2, label: 'Verifikasi HP', done: activeNum > 2, active: activeNum === 2 },
    { num: 3, label: 'Selesai',       done: activeNum > 3, active: activeNum === 3 },
  ];
}

// FIX 1: Toast komponen — konsisten dengan Login & Register
function Toast({ message, type = 'error', onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

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

export default function Verify() {
  const [otp, setOtp]           = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer]       = useState(TIMER_START);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const [toast, setToast]       = useState(null);
  const inputRefs               = useRef([]);
  const navigate                = useNavigate();
  const [searchParams]          = useSearchParams();
  const phone                   = searchParams.get('phone') ?? '';

  const showToast = (message, type = 'error') => setToast({ message, type });
  const dismissToast = () => setToast(null);

  useEffect(() => {
    if (!phone.trim()) navigate('/register', { replace: true });
  }, [phone, navigate]);

  useEffect(() => {
    if (timer <= 270) { setCanResend(true); } 
    if (timer <= 0) { setCanResend(true); return; }
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const pad       = n => String(n).padStart(2, '0');
  const formatted = `${pad(Math.floor(timer / 60))}:${pad(timer % 60)}`;
  const isFilled  = otp.every(d => d !== '');

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

  const goBack = () => navigate('/register');

  const handleResend = async () => {
    if (!canResend || !phone.trim()) return;
    setResending(true);
    try {

      const res = await fetch(
        `${API_AUTH}/resend-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phone
          }),
        }
      );

      const data =
        await res.json().catch(() => ({}));

      if (!res.ok) {

        showToast(
          data.message ||
          'Gagal mengirim ulang OTP.'
        );

        return;
      }

      setTimer(TIMER_START);
      setCanResend(false);

      setOtp(
        Array(OTP_LENGTH).fill('')
      );

      inputRefs.current[0]?.focus();

      showToast(
        'OTP baru berhasil dikirim ke WhatsApp.',
        'info'
      );

    } catch {

      showToast(
        'Tidak dapat menghubungi server.'
      );

    } finally {

      setResending(false);

    }
  };

  const handleVerify = async () => {
    if (!isFilled) return;
    setLoading(true);
    try {

      const res = await fetch(
        `${API_AUTH}/verify-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phone,
            otpCode: otp.join('')
          }),
        }
      );

      const data =
        await res.json().catch(() => ({}));

      if (res.ok) {
        showToast(
          'Verifikasi berhasil.',
          'info'
        );
        navigate('/success');
      } else {
        showToast(
          data.message ||
          'Kode OTP salah atau sudah kedaluwarsa.'
        );
      }
    } catch {
      showToast(
        'Tidak dapat menghubungi server.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}

      <AuthLayout
        eyebrow="Bergabung sekarang"
        title="Mulai dari"
        highlight="dapurmu"
        subtitle="Verifikasi OTP dikirim ke WhatsApp untuk mengaktifkan akunmu."
      >
        <StepIndicator steps={buildSteps(2)} />

        <div className="flex flex-col gap-1">
          <h2 className="font-display font-bold text-[clamp(1.375rem,2.5vw,1.75rem)] tracking-tight text-(--text-primary) m-0">
            Verifikasi Nomor HP
          </h2>
          <p className="text-sm m-0 leading-normal text-(--text-secondary)">
            Masukkan 6 digit kode OTP yang dikirim ke WhatsApp-mu.
          </p>
        </div>

        <div className="flex items-center gap-4 px-5 py-4 border-[1.5px] rounded-xl bg-neutral-50 border-(--border-subtle)">
          <div className="w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 bg-(--color-forest-900) text-(--accent-primary)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <circle cx="12" cy="17" r="1" />
            </svg>
          </div>

          <div className="flex-1 flex flex-col gap-[2px]">
            <span className="text-xs font-medium tracking-wide text-(--text-secondary)">
              Kode dikirim ke
            </span>
            <span className="text-base font-bold text-(--text-primary)">
              +62 {phone.replace(/^62/, '')}
            </span>
          </div>

          <button
            type="button"
            onClick={goBack}
            aria-label="Ubah nomor HP"
            className="text-sm font-semibold text-(--accent-primary) hover:underline bg-transparent border-none cursor-pointer"
          >
            Ubah
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2 px-4 py-2 border-[1.5px] rounded-full border-(--border-subtle)">
            <span className="text-sm text-(--text-secondary)">
              Berlaku selama
            </span>
            <span
              className="text-sm font-bold tabular-nums transition-colors duration-300"
              style={{ color: timer <= 10 ? '#C0392B' : 'var(--color-forest-900)' }}
            >
              {formatted}
            </span>
          </div>

          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || resending}
            className="text-sm font-semibold text-(--accent-primary) bg-transparent border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:underline"
          >
            {resending
              ? 'Mengirim OTP…'
              : 'Kirim ulang OTP'}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-(--text-primary)">
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
                aria-label={`Digit OTP ke-${idx + 1}`}
                className="flex-1 min-w-0 aspect-square max-w-18 text-center text-2xl font-bold outline-none rounded-xl border-[1.5px] transition-[border-color,background-color] duration-150 focus:border-(--color-forest-900) focus:ring-2 focus:ring-(--color-forest-900)/10"
                style={{
                  color:       'var(--text-primary)',
                  borderColor: digit ? 'var(--color-forest-900)' : 'var(--border-subtle)',
                  background:  digit ? 'var(--color-forest-50)'  : '#ffffff',
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col min-[640px]:flex-row gap-3">
          <button
            type="button"
            onClick={goBack}
            className="w-full min-[640px]:flex-1 h-13 text-base font-semibold rounded-xl border-[1.5px] border-(--border-subtle) bg-white text-(--text-primary) transition-[background-color,border-color] duration-150 hover:bg-neutral-50 hover:border-(--border-strong)"
          >
            Kembali
          </button>

          <button
            type="button"
            onClick={handleVerify}
            disabled={!isFilled || loading}
            className="w-full min-[640px]:flex-[2_2_0%] h-13 text-base font-semibold rounded-xl bg-(--color-forest-900) text-white transition-[background-color,transform] duration-150 active:scale-[0.99] hover:bg-(--color-forest-800) disabled:opacity-45 disabled:cursor-not-allowed"
          >
            {loading ? 'Memverifikasi…' : 'Verifikasi'}
          </button>
        </div>

      </AuthLayout>
    </>
  );
}