import styles from './Dashboard.module.css'
import AlertsSection from '../components/AlertsSection'
import StatsGrid from '../components/StatsGrid'
import KulkasDashWidget from '../components/KulkasDashWidget'
import ResepWidget from '../components/ResepWidget'
import SurplusDashWidget from '../components/SurplusDashWidget'
import PostingWidget from '../components/PostingWidget'

// Nanti ganti dari auth context
const USER = {
  name: 'Sri Rahayu',
  location: 'Yogyakarta',
  date: 'Senin, 27 April 2026',
}

export default function Dashboard() {
  return (
    <>
      {/* ── Desktop topbar ── */}
      <div className={styles.topbar}>
        <div>
          <p className={styles.greeting}>Selamat pagi,</p>
          <h1 className={styles.name}>{USER.name}</h1>
          <p className={styles.sub}>{USER.date} · {USER.location}</p>
        </div>
        <div className={styles.topbarRight}>
          <div className={styles.searchBar}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="9.5" y1="9.5" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>Cari bahan, resep, selamatkan…</span>
          </div>
          <button className={styles.notifBtn} aria-label="Notifikasi">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2a5 5 0 015 5v3.5l1.5 2h-13L4 10.5V7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7.5 15a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className={styles.notifDot} />
          </button>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className={styles.body}>
        {/* Mobile greeting */}
        <div className={styles.mobileGreeting}>
          <p className={styles.greetSm}>Selamat pagi,</p>
          <h1 className={styles.greetName}>{USER.name}</h1>
          <p className={styles.greetSub}>{USER.date} · {USER.location}</p>
        </div>

        <AlertsSection />
        <StatsGrid />

        <div className={styles.twoCol}>
          <div className={styles.col}>
            <KulkasDashWidget />
            <ResepWidget />
          </div>
          <div className={styles.col}>
            <SurplusDashWidget />
            <PostingWidget />
          </div>
        </div>
      </div>
    </>
  )
}