import AlertsSection from '../components/AlertsSection'
import StatsGrid from '../components/StatsGrid'
import KulkasDashWidget from '../components/KulkasDashWidget'
import ResepWidget from '../components/ResepWidget'
import SurplusDashWidget from '../components/SurplusDashWidget'
import PostingWidget from '../components/PostingWidget'

const USER = {
  name: 'Sri Rahayu',
  location: 'Yogyakarta',
  date: 'Senin, 27 April 2026',
}

export default function Dashboard() {
  return (
    <>
      <div
        className="bg-white border-b flex items-center justify-between px-7 py-4 sticky top-0 z-10 max-[640px]:hidden"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div>
          <p className="text-compact-base" style={{ color: 'var(--text-muted)' }}>Selamat pagi,</p>
          <h1 className="text-xl font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{USER.name}</h1>
          <p className="text-compact-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{USER.date} · {USER.location}</p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 rounded-md px-3 py-2 text-compact-lg cursor-text select-none w-55 border"
            style={{ background: 'var(--bg-alt)', borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="9.5" y1="9.5" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>Cari bahan, resep, selamatkan…</span>
          </div>
          <button
            className="relative w-9 h-9 rounded-md border flex items-center justify-center cursor-pointer transition-colors duration-150"
            style={{ background: 'var(--bg-alt)', borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-alt)'}
            aria-label="Notifikasi"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2a5 5 0 015 5v3.5l1.5 2h-13L4 10.5V7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7.5 15a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span
              className="absolute top-1.75 right-1.75 w-1.75 h-1.75 rounded-full border-[1.5px]"
              style={{ background: 'var(--color-danger-500)', borderColor: 'white' }}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-7 py-6 pb-10 max-[640px]:gap-4 max-[640px]:p-0 max-[640px]:pb-8">

        <div
          className="hidden max-[640px]:block px-4 pt-4 pb-5 rounded-b-xl"
          style={{ background: 'var(--bg-dark)' }}
        >
          <p className="text-compact-sm" style={{ color: 'var(--text-on-dark-muted)' }}>Selamat pagi,</p>
          <h1 className="text-xl font-bold leading-snug" style={{ color: 'var(--text-on-dark)' }}>{USER.name}</h1>
          <p className="text-compact-xs mt-0.5" style={{ color: 'var(--text-on-dark-faint)' }}>{USER.date} · {USER.location}</p>
        </div>

        <div className="max-[640px]:px-4"><AlertsSection /></div>
        <div className="max-[640px]:px-4"><StatsGrid /></div>

        <div className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1 max-[640px]:px-4">
          <div className="flex flex-col gap-5">
            <KulkasDashWidget />
            <ResepWidget />
          </div>
          <div className="flex flex-col gap-5">
            <SurplusDashWidget />
            <PostingWidget />
          </div>
        </div>

      </div>
    </>
  )
}