import { useState, useEffect } from 'react'
import { NavLink, useLocation, Outlet } from 'react-router-dom'
import { LayoutDashboard, Refrigerator, MapPin, Star, Bell } from 'lucide-react'
import styles from './DashboardLayout.module.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Beranda',      end: true, Icon: LayoutDashboard },
  { to: '/kulkas',    label: 'Lihat Kulkas',            Icon: Refrigerator     },
  { to: '/selamatkan',label: 'Selamatkan!',             Icon: MapPin           },
  { to: '/poin',      label: 'Poin Berkah',             Icon: Star             },
]

const USER   = { name: 'Sri Rahayu', role: 'Donatur Aktif', initials: 'SR' }
const STREAK = ['S', 'S', 'R', 'K', 'J', 'S', 'M']

function PoinBlock() {
  return (
    <div className={styles.poinBlock}>
      <p className={styles.poinLabel}>Total Poin Berkah</p>
      <p className={styles.poinVal}>1.240</p>
      <p className={styles.poinSub}>Donatur Aktif · Peringkat #12 Yogyakarta</p>
      <p className={styles.streakLabel}>Streak minggu ini</p>
      <div className={styles.streakRow}>
        {STREAK.map((d, i) => (
          <div
            key={i}
            className={`${styles.streakDay} ${
              i < 4      ? styles.streakDone  :
              i === 4    ? styles.streakToday :
              styles.streakEmpty
            }`}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  )
}

function NavItems() {
  return (
    <>
      <p className={styles.navLabel}>Menu</p>
      {NAV_ITEMS.map(({ to, label, end, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
          }
        >
          <span className={styles.navIcon}>
            <Icon size={16} strokeWidth={1.75} />
          </span>
          {label}
        </NavLink>
      ))}
    </>
  )
}

export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 640) setDrawerOpen(false) }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={styles.root}>

      <aside className={styles.sidebar}>
        <div className={styles.logo}>Sayur<span>Kita.</span></div>

        <div className={styles.userBlock}>
          <div className={styles.avatar}>{USER.initials}</div>
          <div>
            <p className={styles.userName}>{USER.name}</p>
            <p className={styles.userRole}>{USER.role}</p>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <NavItems />
        </nav>

        <PoinBlock />
      </aside>

      <header className={styles.mobileTopbar}>
        <button
          className={`${styles.hamburger} ${drawerOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setDrawerOpen(v => !v)}
          aria-label="Toggle menu"
          aria-expanded={drawerOpen}
        >
          <span /><span /><span />
        </button>

        <span className={styles.mobileLogo}>Sayur<span>Kita.</span></span>

        <div className={styles.mobileRight}>
          <button className={styles.notifBtn} aria-label="Notifikasi">
            <Bell size={20} strokeWidth={1.75} />
            <span className={styles.notifDot} />
          </button>
          <div className={styles.avatarSm}>{USER.initials}</div>
        </div>
      </header>

      <div
        className={`${styles.overlay} ${drawerOpen ? styles.overlayVisible : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`}
        aria-modal="true"
        role="dialog"
        aria-label="Menu navigasi"
      >
        <div className={styles.drawerHeader}>
          <span className={styles.logo}>Sayur<span>Kita.</span></span>
          <button
            className={styles.drawerClose}
            onClick={() => setDrawerOpen(false)}
            aria-label="Tutup menu"
          >
            ×
          </button>
        </div>

        <div className={styles.userBlock}>
          <div className={styles.avatar}>{USER.initials}</div>
          <div>
            <p className={styles.userName}>{USER.name}</p>
            <p className={styles.userRole}>{USER.role}</p>
          </div>
        </div>

        <nav className={styles.drawerNav}>
          <NavItems />
        </nav>

        <PoinBlock />
      </div>

      <main className={styles.main}>
        <Outlet />
      </main>

    </div>
  )
}