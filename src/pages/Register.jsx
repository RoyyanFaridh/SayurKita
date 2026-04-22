import { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import styles from './Register.module.css';

export default function Register() {
  const [step, setStep]               = useState(1); // 1 = Daftar diri, 2 = Verifikasi HP, 3 = Selesai
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [agreed, setAgreed]             = useState(false);

  // Step 1 fields
  const [nama, setNama]         = useState('');
  const [phone, setPhone]       = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');

  // Step 2 OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const steps = [
    { num: 1, label: 'Daftar diri' },
    { num: 2, label: 'Verifikasi HP' },
    { num: 3, label: 'Selesai' },
  ];

  return (
    <div className={styles.page}>

      {/* ── LEFT PANEL ── */}
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

      {/* ── RIGHT FORM ── */}
      <main className={styles.formSide}>
        <div className={styles.formWrap}>

          {/* Stepper */}
          <div className={styles.stepper}>
            {steps.map((s, i) => (
              <div key={s.num} className={styles.stepperItem}>
                <div className={`${styles.stepCircle} ${step > s.num ? styles.stepDone : step === s.num ? styles.stepActive : ''}`}>
                  {step > s.num ? <Check size={14} strokeWidth={2.5} /> : s.num}
                </div>
                <span className={`${styles.stepLabel} ${step === s.num ? styles.stepLabelActive : ''}`}>
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`${styles.stepLine} ${step > s.num ? styles.stepLineDone : ''}`} />
                )}
              </div>
            ))}
          </div>

          {/* ── STEP 1: Daftar diri ── */}
          {step === 1 && (
            <>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Buat akun baru</h2>
                <p className={styles.formSub}>
                  Sudah punya akun?{' '}
                  <a href="/login" className={styles.link}>Masuk di sini</a>
                </p>
              </div>

              <div className={styles.form}>
                {/* Nama + HP row */}
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="nama">Nama Lengkap</label>
                    <input
                      id="nama"
                      type="text"
                      className={styles.input}
                      placeholder="Sri Rahayu"
                      value={nama}
                      onChange={e => setNama(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="phone">Nomor HP</label>
                    <div className={styles.phoneWrap}>
                      <span className={styles.phonePrefix}>+62</span>
                      <input
                        id="phone"
                        type="tel"
                        className={`${styles.input} ${styles.phoneInput}`}
                        placeholder="8xx-xxxx-xxxx"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    className={styles.input}
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="password">Password</label>
                  <div className={styles.inputWrap}>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className={`${styles.input} ${styles.inputPad}`}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Konfirmasi password */}
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="confirm">Ulangi password</label>
                  <div className={styles.inputWrap}>
                    <input
                      id="confirm"
                      type={showConfirm ? 'text' : 'password'}
                      className={`${styles.input} ${styles.inputPad}`}
                      placeholder="••••••••"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowConfirm(v => !v)}
                      aria-label={showConfirm ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Checkbox */}
                <label className={styles.checkRow}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                  />
                  <span className={styles.checkLabel}>
                    Saya menyetujui{' '}
                    <a href="/syarat" className={styles.link}>Syarat & Ketentuan</a>
                    {' '}dan{' '}
                    <a href="/privasi" className={styles.link}>Kebijakan Privasi</a>
                  </span>
                </label>

                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={() => setStep(2)}
                >
                  Lanjut
                </button>

                <div className={styles.divider}>
                  <span className={styles.dividerLine} />
                  <span className={styles.dividerText}>atau</span>
                  <span className={styles.dividerLine} />
                </div>

                <button type="button" className={styles.btnGoogle}>
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
                  </svg>
                  Daftar dengan Google
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: Verifikasi HP ── */}
          {step === 2 && (
            <>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Verifikasi nomor HP</h2>
                <p className={styles.formSub}>
                  Kode OTP dikirim ke{' '}
                  <strong>+62 {phone || '8xx-xxxx-xxxx'}</strong>.{' '}
                  <button type="button" className={styles.linkBtn} onClick={() => setStep(1)}>
                    Ubah nomor
                  </button>
                </p>
              </div>

              <div className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Masukkan kode OTP</label>
                  <div className={styles.otpRow}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className={styles.otpInput}
                        value={digit}
                        onChange={e => handleOtpChange(e.target.value, idx)}
                        onKeyDown={e => handleOtpKeyDown(e, idx)}
                      />
                    ))}
                  </div>
                </div>

                <p className={styles.resendRow}>
                  Tidak dapat kode?{' '}
                  <button type="button" className={styles.linkBtn}>Kirim ulang</button>
                  <span className={styles.resendTimer}> (60s)</span>
                </p>

                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={() => setStep(3)}
                >
                  Verifikasi
                </button>

                <button
                  type="button"
                  className={styles.btnBack}
                  onClick={() => setStep(1)}
                >
                  ← Kembali
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: Selesai ── */}
          {step === 3 && (
            <div className={styles.successWrap}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.formTitle} style={{ textAlign: 'center' }}>
                Akun berhasil dibuat!
              </h2>
              <p className={styles.successSub}>
                Selamat datang di SayurKita, <strong>{nama || 'Pengguna Baru'}</strong>.<br />
                Akun kamu sudah aktif dan siap digunakan.
              </p>
              <a href="/dashboard" className={styles.btnPrimary} style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                Mulai Sekarang
              </a>
            </div>
          )}

          {step === 1 && (
            <p className={styles.terms}>
              Dengan mendaftar, kamu menyetujui{' '}
              <a href="/syarat" className={styles.link}>Syarat & Ketentuan</a>
              {' '}dan{' '}
              <a href="/privasi" className={styles.link}>Kebijakan Privasi</a>
              {' '}kami
            </p>
          )}

        </div>
      </main>

    </div>
  );
}