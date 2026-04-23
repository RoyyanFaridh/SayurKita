import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import styles from './Success.module.css';

/**
 * Success — Step 3 of 3: Akun berhasil dibuat
 * Dipanggil setelah Verify berhasil → navigate('/success')
 */
export default function Success() {
  const navigate = useNavigate();

  const steps = [
    { num: 1, label: 'Daftar diri',   done: true  },
    { num: 2, label: 'Verifikasi HP', done: true  },
    { num: 3, label: 'Selesai',       active: true },
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

      {/* ── RIGHT CONTENT ── */}
      <main className={styles.formSide}>
        <div className={styles.formWrap}>

          {/* Stepper */}
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

          {/* Success card */}
          <div className={styles.successCard}>
            <div className={styles.successIconWrap}>
              <Check size={28} strokeWidth={2.5} className={styles.successIcon} />
            </div>

            <h2 className={styles.successTitle}>Akun berhasil dibuat</h2>

            <p className={styles.successSub}>
              Selamat datang di SayurKita. Akunmu sudah aktif sehingga siap posting, klaim, dan kumpulkan Poin Berkah
            </p>

            <button
              type="button"
              className={styles.btnDashboard}
              onClick={() => navigate('/dashboard')}
            >
              Masuk ke dashboard
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}