import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Login.module.css';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]         = useState(false);

  return (
    <div className={styles.page}>

      <aside className={styles.panel}>
        <a href="/" className={styles.logo}>
          Sayur<span className={styles.logoAccent}>Kita.</span>
        </a>

        <div className={styles.panelCopy}>
          <p className={styles.eyebrow}>Selamat datang kembali</p>
          <h1 className={styles.headline}>
            Lanjutkan<br />aksi{' '}
            <span className={styles.headlineAccent}>baikmu</span>
          </h1>
          <p className={styles.sub}>Masuk dan lihat surplus terbaru di sekitarmu</p>
        </div>

        <p className={styles.copyright}>© 2025 SayurKita</p>
      </aside>

      <main className={styles.formSide}>
        <div className={styles.formWrap}>

          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Masuk ke akun</h2>
            <p className={styles.formSub}>
              Belum punya akun?{' '}
              <a href="/register" className={styles.link}>Daftar</a>
            </p>
          </div>

          <form className={styles.form} onSubmit={e => e.preventDefault()}>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="identifier">
                Email atau nomor HP
              </label>
              <input
                id="identifier"
                type="text"
                className={styles.input}
                placeholder="you@example.com atau 08xx"
                autoComplete="username"
              />
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="password">Password</label>
                <a href="/forgot-password" className={styles.forgot}>Lupa password?</a>
              </div>
              <div className={styles.inputWrap}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${styles.inputPad}`}
                  placeholder="••••••••"
                  autoComplete="current-password"
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

            <label className={styles.checkRow}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              <span className={styles.checkLabel}>Ingat saya di perangkat ini</span>
            </label>

            <button type="submit" className={styles.btnPrimary}>
              Masuk
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
              Masuk dengan Google
            </button>

          </form>

          <p className={styles.terms}>
            Dengan masuk, kamu menyetujui{' '}
            <a href="/syarat" className={styles.link}>Syarat & Ketentuan</a>
            {' '}dan{' '}
            <a href="/privasi" className={styles.link}>Kebijakan Privasi</a>
            {' '}kami
          </p>

        </div>
      </main>

    </div>
  );
}