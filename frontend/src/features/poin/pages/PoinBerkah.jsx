import { useState, useEffect, useCallback } from 'react'
import { Flame, Leaf, Filter, Wind, Star, Lock, Trophy, ChevronDown } from 'lucide-react'
import { API_ORIGIN } from '../../../config/api'
import PoinTopbar from '../components/PoinTopbar'

const HARI = ['S', 'S', 'R', 'K', 'J', 'S', 'M']

// ── Tier config ───────────────────────────────────────────────────────────────
const TIERS = [
  { nama: 'Benih',      min: 0,    max: 500  },
  { nama: 'Tunas',      min: 500,  max: 1200  },
  { nama: 'Tumbuh',     min: 1200,  max: 2400  },
  { nama: 'Hijau Muda', min: 2400,  max: 4000 },
  { nama: 'Hijau Tua',  min: 4000, max: 8000 },
  { nama: 'Panen',      min: 8000, max: null },
]

function getTierInfo(points) {
  for (let i = 0; i < TIERS.length; i++) {
    const t = TIERS[i]
    if (t.max === null || points < t.max) {
      const next     = TIERS[i + 1] ?? null
      const progress = t.max
        ? Math.min(((points - t.min) / (t.max - t.min)) * 100, 100)
        : 100
      return { current: t, next, progress: Math.round(progress) }
    }
  }
  return { current: TIERS[TIERS.length - 1], next: null, progress: 100 }
}

// ── Streak helpers ────────────────────────────────────────────────────────────
function hitungStreakMingguIni(streakCount, lastActiveDate) {
  const active = Array(7).fill(false)
  if (!lastActiveDate || streakCount === 0) return active
  const last = new Date(lastActiveDate)
  last.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24))
  if (diffDays > 1) return active
  const hariIniIndex = (today.getDay() + 6) % 7
  const jumlahAktif  = Math.min(streakCount, hariIniIndex + 1)
  for (let i = 0; i < jumlahAktif; i++) active[hariIniIndex - i] = true
  return active
}

function StreakWeek({ streakCount, lastActiveDate }) {
  const aktif        = hitungStreakMingguIni(streakCount, lastActiveDate)
  const hariIniIndex = (new Date().getDay() + 6) % 7
  return (
    <div className="flex gap-1.5">
      {HARI.map((d, i) => {
        const isToday  = i === hariIniIndex
        const isAktif  = aktif[i]
        const isFuture = i > hariIniIndex
        return (
          <div key={i} className={`
            flex h-8 w-8 items-center justify-center rounded-full
            text-compact-xs font-semibold transition-all duration-fast
            ${isFuture
              ? 'bg-white/8 text-white/25'
              : isAktif && isToday
                ? 'bg-white text-primary-900 ring-2 ring-secondary-400 ring-offset-1 ring-offset-primary-800'
                : isAktif
                  ? 'bg-secondary-400 text-primary-900'
                  : 'bg-white/10 text-white/30'
            }
          `}>{d}</div>
        )
      })}
    </div>
  )
}

// ── Hero card (kiri desktop) ──────────────────────────────────────────────────
function HeroCard({ points, streakCount, lastActiveDate }) {
  const { current, next, progress } = getTierInfo(points)
  const bonusBerikutnya =
    streakCount === 0 ? 1 : streakCount <= 3 ? 1 : streakCount <= 10 ? 2 : 3
  const streakLabel    = streakCount === 0 ? 'Belum ada streak' : `Tanamanku — Hari ke-${streakCount}`
  const STREAK_MILESTONE = 30
  const sisaHari       = Math.max(STREAK_MILESTONE - streakCount, 0)

  return (
    <div className="rounded-xl overflow-hidden border-[0.5px]"
      style={{ borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>

      {/* Poin + tier */}
      <div className="px-5 pt-5 pb-5 flex flex-col items-center text-center gap-2"
        style={{ background: 'var(--color-primary-800, #14532d)' }}>
        <p className="text-compact-xs font-semibold uppercase tracking-widest m-0"
          style={{ color: 'rgba(255,255,255,0.4)' }}>
          Total Poin Berkah
        </p>
        <p className="text-7xl font-bold leading-[1] m-0"
          style={{ color: 'var(--color-secondary-400, #fbbf24)' }}>
          {points.toLocaleString('id-ID')}
        </p>
        <span className="mt-1 px-3 py-1 rounded-full text-compact-xs font-semibold"
          style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.75)' }}>
          Tier {current.nama}
        </span>
      </div>

      <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

      {/* Streak */}
      <div className="px-5 py-4 flex flex-col gap-3"
        style={{ background: 'var(--bg-surface-1)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={14} strokeWidth={2} style={{ color: 'var(--text-warning)' }} className="shrink-0" />
            <p className="text-compact-sm font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
              {streakLabel}
            </p>
          </div>
          <span className="text-compact-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'var(--bg-warning-subtle)', color: 'var(--text-warning)' }}>
            +{bonusBerikutnya} poin/hari
          </span>
        </div>

        {streakCount > 0 && sisaHari > 0 && (
          <p className="text-compact-xs m-0" style={{ color: 'var(--text-muted)' }}>
            {sisaHari} hari lagi berbuah! Jangan putus streaknya
          </p>
        )}

        {streakCount > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="h-1.5 w-full rounded-full overflow-hidden"
              style={{ background: 'var(--bg-subtle)' }}>
              <div className="h-full rounded-full transition-all duration-slow"
                style={{
                  width:      `${Math.min((streakCount / STREAK_MILESTONE) * 100, 100)}%`,
                  background: 'var(--color-primary-600, #16a34a)',
                }} />
            </div>
            <div className="flex justify-between">
              <span className="text-compact-xs" style={{ color: 'var(--text-muted)' }}>Benih</span>
              <span className="text-compact-xs" style={{ color: 'var(--text-muted)' }}>Berbuah (30 hari)</span>
            </div>
          </div>
        )}

        <div className="rounded-lg px-4 py-3 flex flex-col gap-2.5"
          style={{ background: 'var(--color-primary-800, #14532d)' }}>
          <StreakWeek streakCount={streakCount} lastActiveDate={lastActiveDate} />
          <p className="text-compact-xs m-0" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Minggu ini · Aktif = ada transaksi berhasil hari itu
          </p>
        </div>
      </div>

      {next && (
        <>
          <div style={{ height: '1px', background: 'var(--border-subtle)' }} />
          <div className="px-5 py-4 flex flex-col gap-2.5"
            style={{ background: 'var(--bg-surface-1)' }}>
            <p className="text-compact-xs font-semibold uppercase tracking-wide m-0"
              style={{ color: 'var(--text-muted)' }}>
              Progress ke Tier {next.nama}
            </p>
            <div className="flex items-center justify-between gap-3">
              <span className="text-compact-xs" style={{ color: 'var(--text-secondary)' }}>
                {points.toLocaleString('id-ID')} / {next.min.toLocaleString('id-ID')} poin
              </span>
              <span className="text-compact-xs font-semibold" style={{ color: 'var(--text-success)' }}>
                {progress}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden"
              style={{ background: 'var(--bg-subtle)' }}>
              <div className="h-full rounded-full transition-all duration-slow"
                style={{ width: `${progress}%`, background: 'var(--color-primary-600, #16a34a)' }} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── Jejak Hijau ───────────────────────────────────────────────────────────────
function JejakHijau({ totalKarbon }) {
  return (
    <div className="rounded-xl border-[0.5px] px-5 py-4 flex items-center justify-between gap-4"
      style={{
        background:  'var(--bg-success-subtle)',
        borderColor: 'var(--border-subtle)',
        boxShadow:   'var(--shadow-xs)',
      }}>
      <div className="flex flex-col gap-0.5">
        <p className="text-compact-xs font-semibold uppercase tracking-wide m-0"
          style={{ color: 'var(--text-muted)' }}>
          Total Karbon Diselamatkan
        </p>
        <p className="text-3xl font-bold leading-[1.1] m-0"
          style={{ color: 'var(--text-success)' }}>
          {totalKarbon.toLocaleString('id-ID', { maximumFractionDigits: 2 })}
        </p>
        <p className="text-compact-xs m-0" style={{ color: 'var(--text-success)' }}>
          kg CO₂ dicegah
        </p>
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'var(--bg-surface-1)', color: 'var(--text-success)' }}>
        <Leaf size={22} strokeWidth={1.75} />
      </div>
    </div>
  )
}

// ── Kartu Berkah placeholder ──────────────────────────────────────────────────
function KartuBerkah() {
  return (
    <div className="rounded-xl border-[0.5px] px-5 py-4 flex flex-col gap-3"
      style={{
        background:  'var(--bg-surface-1)',
        borderColor: 'var(--border-subtle)',
        boxShadow:   'var(--shadow-xs)',
      }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={15} strokeWidth={1.75} style={{ color: 'var(--text-muted)' }} />
          <p className="text-compact-sm font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
            Koleksi Kartu Berkah
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-compact-xs font-medium"
          style={{ background: 'var(--bg-warning-subtle)', color: 'var(--text-warning)' }}>
          Segera Hadir
        </span>
      </div>
      <div className="flex gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
              <Lock size={16} strokeWidth={1.75} />
            </div>
            <span className="text-compact-xs" style={{ color: 'var(--text-muted)' }}>Terkunci</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Riwayat panel (kanan desktop) ─────────────────────────────────────────────
const SOURCE_LABEL = {
  KARBON: { label: 'Karbon', style: { background: 'var(--bg-success-subtle)', color: 'var(--text-success)' } },
  STREAK: { label: 'Streak', style: { background: 'var(--bg-warning-subtle)', color: 'var(--text-warning)' } },
}

function RiwayatItem({ log }) {
  const src     = SOURCE_LABEL[log.source] ?? { label: log.source, style: {} }
  const tanggal = new Date(log.createdAt).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border-[0.5px]"
      style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-compact-sm font-medium m-0 truncate" style={{ color: 'var(--text-primary)' }}>
          {log.note ?? '—'}
        </p>
        <p className="text-compact-xs m-0" style={{ color: 'var(--text-muted)' }}>{tanggal}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-compact-xs font-medium px-2 py-0.5 rounded-full" style={src.style}>
          {src.label}
        </span>
        <span className="text-compact-base font-bold min-w-[2.5rem] text-right"
          style={{ color: 'var(--text-success)' }}>
          +{log.delta}
        </span>
      </div>
    </div>
  )
}

const FILTER_OPTIONS = [
  { value: 'SEMUA',  label: 'Semua'  },
  { value: 'KARBON', label: 'Karbon' },
  { value: 'STREAK', label: 'Streak' },
]

// Riwayat sebagai panel mandiri — bisa dipakai di kolom kanan desktop
// atau di bawah hero card di mobile
function RiwayatPanel({ compact = false }) {
  const [logs, setLogs]           = useState([])
  const [total, setTotal]         = useState(0)
  const [filter, setFilter]       = useState('SEMUA')
  const [offset, setOffset]       = useState(0)
  const [logsLoading, setLogsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [expanded, setExpanded]   = useState(false)

  // compact mode: tampilkan 5 item, expandable jadi semua
  // non-compact: tampilkan 15 + load more
  const LIMIT       = compact ? (expanded ? 50 : 5) : 15
  const sudahSemua  = logs.length >= total

  const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const fetchLogs = useCallback((currentOffset, append = false) => {
    const params = new URLSearchParams({ limit: LIMIT, offset: currentOffset })
    if (filter !== 'SEMUA') params.set('source', filter)

    if (append) setLoadingMore(true)
    else setLogsLoading(true)

    fetch(`${API_ORIGIN}/api/poin/riwayat?${params}`, { headers: getHeaders() })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => {
        setLogs(prev => append ? [...prev, ...d.data.logs] : d.data.logs)
        setTotal(d.data.total)
        setOffset(currentOffset + d.data.logs.length)
      })
      .catch(() => {})
      .finally(() => {
        if (append) setLoadingMore(false)
        else setLogsLoading(false)
      })
  }, [filter, LIMIT])

  useEffect(() => {
    setLogs([])
    setOffset(0)
    fetchLogs(0, false)
  }, [filter, expanded])

  return (
    <div className="rounded-xl border-[0.5px] overflow-hidden"
      style={{ borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>

      {/* Panel header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b-[0.5px]"
        style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subtle)' }}>
        <p className="text-compact-sm font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
          Riwayat Poin
          {total > 0 && (
            <span className="ml-2 text-compact-xs font-medium px-1.5 py-0.5 rounded-full"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
              {total}
            </span>
          )}
        </p>
        <div className="flex items-center gap-1">
          <Filter size={11} strokeWidth={1.75} style={{ color: 'var(--text-muted)' }} />
          {FILTER_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => setFilter(opt.value)}
              className="px-2 py-0.5 rounded-full text-compact-xs font-medium transition-colors duration-fast cursor-pointer border-[0.5px]"
              style={filter === opt.value
                ? { background: 'var(--bg-brand)', color: 'var(--text-on-brand)', borderColor: 'transparent' }
                : { background: 'transparent', color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)' }
              }>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 p-3"
        style={{ background: 'var(--bg-subtle)' }}>
        {logsLoading ? (
          [...Array(compact ? 3 : 5)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg animate-pulse"
              style={{ background: 'var(--bg-surface-1)' }} />
          ))
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Wind size={18} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
            <p className="text-compact-sm m-0" style={{ color: 'var(--text-muted)' }}>
              Belum ada riwayat poin
            </p>
          </div>
        ) : (
          logs.map(log => <RiwayatItem key={log.id} log={log} />)
        )}
      </div>

      {/* Footer: expand atau load more */}
      {!logsLoading && (
        compact ? (
          total > 5 && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-compact-xs font-medium border-t-[0.5px] transition-colors duration-fast cursor-pointer"
              style={{
                background:  'var(--bg-surface-1)',
                borderColor: 'var(--border-subtle)',
                color:       'var(--text-secondary)',
              }}>
              {expanded ? 'Sembunyikan' : `Lihat semua (${total - 5} lagi)`}
              <ChevronDown size={13} strokeWidth={2}
                style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>
          )
        ) : (
          !sudahSemua && (
            <button
              onClick={() => fetchLogs(offset, true)}
              disabled={loadingMore}
              className="w-full py-2.5 text-compact-xs font-medium border-t-[0.5px] transition-colors duration-fast cursor-pointer"
              style={{
                background:  'var(--bg-surface-1)',
                borderColor: 'var(--border-subtle)',
                color:       'var(--text-secondary)',
                opacity:     loadingMore ? 0.6 : 1,
              }}>
              {loadingMore ? 'Memuat...' : `Muat lebih banyak (${total - logs.length} lagi)`}
            </button>
          )
        )
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PoinBerkah() {
  const [summary, setSummary]               = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [totalKarbon, setTotalKarbon]       = useState(0)
  const [error, setError]                   = useState(null)

  const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  useEffect(() => {
    setSummaryLoading(true)
    fetch(`${API_ORIGIN}/api/poin`, { headers: getHeaders() })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => setSummary(d.data))
      .catch(() => setError('Gagal memuat data poin.'))
      .finally(() => setSummaryLoading(false))
  }, [])

  useEffect(() => {
    fetch(`${API_ORIGIN}/api/dashboard/summary`, { headers: getHeaders() })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => setTotalKarbon(d.data?.stats?.karbonDiselamatkan ?? 0))
      .catch(() => {})
  }, [])

  if (error) {
    return (
      <>
        <PoinTopbar points={null} />
        <div className="flex items-center justify-center h-96">
          <p className="text-compact-base m-0" style={{ color: 'var(--text-danger)' }}>{error}</p>
        </div>
      </>
    )
  }

  const skeletonHero = (
    <div className="rounded-xl animate-pulse"
      style={{ background: 'var(--bg-subtle)', height: '22rem' }} />
  )

  return (
    <>
      <PoinTopbar points={summary?.points ?? null} />

      {/* Mobile header */}
      <div className="hidden items-center gap-2.5 rounded-b-xl bg-primary-600 px-4 pb-5 pt-4 max-[640px]:flex">
        <Star size={16} strokeWidth={1.75} className="text-secondary-400 shrink-0" />
        <div>
          <h1 className="text-xl font-bold leading-snug text-white">Poin Berkah</h1>
          <p className="mt-1 text-compact-xs text-white/35">
            {summary !== null
              ? `${summary.points.toLocaleString('id-ID')} poin terkumpul`
              : 'Memuat...'}
          </p>
        </div>
      </div>

      {/* ── Desktop: dua kolom ── */}
      <div className="hidden min-[641px]:flex items-start gap-5 px-7 pt-6 pb-10">

        {/* Kolom kiri — hero + jejak + kartu */}
        <div className="flex flex-col gap-4 min-w-0 flex-1">
          {summaryLoading ? skeletonHero : summary ? (
            <HeroCard
              points={summary.points}
              streakCount={summary.streakCount}
              lastActiveDate={summary.lastActiveDate}
            />
          ) : null}
          <JejakHijau totalKarbon={totalKarbon} />
          <KartuBerkah />
        </div>

        {/* Kolom kanan — riwayat compact + expandable, sticky */}
        <div className="w-80 shrink-0 sticky top-[73px] max-[900px]:w-64">
          <RiwayatPanel compact={true} />
        </div>
      </div>

      {/* ── Mobile: satu kolom ── */}
      <div className="flex min-[641px]:hidden flex-col gap-4 px-4 pt-4 pb-8">
        {summaryLoading ? skeletonHero : summary ? (
          <HeroCard
            points={summary.points}
            streakCount={summary.streakCount}
            lastActiveDate={summary.lastActiveDate}
          />
        ) : null}
        <JejakHijau totalKarbon={totalKarbon} />
        <KartuBerkah />
        <RiwayatPanel compact={false} />
      </div>
    </>
  )
}