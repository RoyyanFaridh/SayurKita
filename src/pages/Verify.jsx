import { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import styles from './Verify.module.css';

const OTP_LENGTH  = 6;
const TIMER_START = 60; // detik

export default function Verify({ phone = '812-3456-7890', onBack, onDone }) {
  const [otp, setOtp]       = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer]   = useState(TIMER_START);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading]     = useState(false);
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
    setTimeout(() => {
      setLoading(false);
      onDone?.();
    }, 1200);
  };

  const isFilled = otp.every(d => d !== '');

  const steps = [
    { num: 1, label: 'Daftar diri',   done: true  },
    { num: 2, label: 'Verifikasi HP', active: true },
    { num: 3, label: 'Selesai',       done: false  },
  ];

  return (
    <div className={styles.page}>

      <aside className={styles.panel}>
        <a href="/" className={styles.logo}>
          Sayur<span className={styles.logoAccent}>Kita.</span>
        </a>

        <div className={styles.panelCopy}>
          <p className={styles.eyebrow}>Bergabung Sekarang</p>
          <h1 className={styles.headline}>
            Mulai dari{' '}
            <span className={styles.headlineAccent}>dapurmu</span>
          </h1>
          <p className={styles.sub}>
            Daftar dua langkah saja. Akun langsung aktif tanpa proses approval dan tanpa biaya.
          </p>
        </div>

        <p className={styles.copyright}>© 2025 SayurKita</p>
      </aside>

      <main className={styles.formSide}>
        <div className={styles.formWrap}>

          <div className={styles.stepper}>
            {steps.map((s, i) => (
              <div key={s.num} className={styles.stepperItem}>
                <div className={[
                  styles.stepCircle,
                  s.done   ? styles.stepDone   : '',
                  s.active ? styles.stepActive : '',
                ].join(' ')}>
                  {s.done ? <Check size={14} strokeWidth={2.5} /> : s.num}
                </div>
                <span className={`${styles.stepLabel} ${s.active ? styles.stepLabelActive : ''}`}>
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`${styles.stepLine} ${s.done ? styles.stepLineDone : ''}`} />
                )}
              </div>
            ))}
          </div>

          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Verifikasi Nomor HP</h2>
            <p className={styles.formSub}>
              Masukkan 6 kode verifikasi yang dikirim ke nomormu.
            </p>
          </div>

          <div className={styles.phoneCard}>
            <div className={styles.phoneCardIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2"/>
                <circle cx="12" cy="17" r="1"/>
              </svg>
            </div>
            <div className={styles.phoneCardBody}>
              <span className={styles.phoneCardLabel}>Kode dikirim ke</span>
              <span className={styles.phoneCardNumber}>+62 {phone}</span>
            </div>
            <button
              type="button"
              className={styles.ubahBtn}
              onClick={onBack}
            >
              Ubah
            </button>
          </div>

          <div className={styles.timerBadge}>
            <span className={styles.timerText}>Berlaku selama</span>
            <span className={`${styles.timerCount} ${timer <= 10 ? styles.timerUrgent : ''}`}>
              {formatted}
            </span>
          </div>

          <div className={styles.otpSection}>
            <label className={styles.otpLabel}>Kode OTP</label>
            <div className={styles.otpRow} onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => inputRefs.current[idx] = el}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  autoComplete="one-time-code"
                  className={`${styles.otpInput} ${digit ? styles.otpFilled : ''}`}
                  value={digit}
                  onChange={e => handleChange(e.target.value, idx)}
                  onKeyDown={e => handleKeyDown(e, idx)}
                />
              ))}
            </div>
          </div>

          <p className={styles.resendRow}>
            Tidak dapat kode?{' '}
            {canResend ? (
              <button type="button" className={styles.resendBtn} onClick={handleResend}>
                Kirim ulang
              </button>
            ) : (
              <span className={styles.resendDisabled}>Kirim ulang</span>
            )}
          </p>

          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.btnBack}
              onClick={onBack}
            >
              Kembali
            </button>
            <button
              type="button"
              className={`${styles.btnVerify} ${!isFilled || loading ? styles.btnDisabled : ''}`}
              onClick={handleVerify}
              disabled={!isFilled || loading}
            >
              {loading ? (
                <span className={styles.spinner} aria-hidden="true" />
              ) : null}
              {loading ? 'Memverifikasi…' : 'Verifikasi'}
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}