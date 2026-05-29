import { useState, useEffect, useCallback } from 'react'
import { Flame, Leaf, Filter } from 'lucide-react'
import { API_ORIGIN } from '../../../config/api'

const HARI = ['S', 'S', 'R', 'K', 'J', 'S', 'M']

/**
 * Hitung array 7 boolean (Senin–Minggu minggu ini) yang aktif,
 * berdasarkan lastActiveDate dan streakCount dari API.
 */
function hitungStreakMingguIni(streakCount, lastActiveDate) {
  const active = Array(7).fill(false)
  if (!lastActiveDate || streakCount === 0) return active

  const last = new Date(lastActiveDate)
  last.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24))

  // Streak sudah putus jika lastActiveDate > kemarin
  if (diffDays > 1) return active

  // Hari dalam minggu: 0=Minggu, perlu dikonversi ke 0=Senin
  const hariIniIndex = (today.getDay() + 6) % 7 // Senin=0, Minggu=6

  // Isi mundur dari hari ini sebanyak streakCount (max 7)
  const jumlahAktif = Math.min(streakCount, hariIniIndex + 1)
  for (let i = 0; i < jumlahAktif; i++) {
    active[hariIniIndex - i] = true
  }

  return active
}

function StreakWeek({ streakCount, lastActiveDate }) {
  const aktif = hitungStreakMingguIni(streakCount, lastActiveDate)
  const hariIniIndex = (new Date().getDay() + 6) % 7

  return (
    <div className="flex gap-1.5">
      {HARI.map((d, i) => {
        const isToday   = i === hariIniIndex
        const isAktif   = aktif[i]
        const isFuture  = i > hariIniIndex

        return (
          <div
            key={i}
            className={`
              flex h-8 w-8 items-center justify-center rounded-full
              text-compact-xs font-semibold transition-all duration-fast
              ${isFuture
                ? 'bg-white/8 text-white/30'
                : isAktif && isToday
                  ? 'bg-white text-primary-900 ring-2 ring-secondary-400 ring-offset-1 ring-offset-primary-800'
                  : isAktif
                    ? 'bg-secondary-400 text-primary-900'
                    : 'bg-white/8 text-white/35'
              }
            `}
          >
            {d}
          </div>
        )
      })}
    </div>
  )
}

function SummaryCard({ points, streakCount, lastActiveDate }) {
  const bonusBerikutnya =
    streakCount <= 3  ? 1 :
    streakCount <= 10 ? 2 : 3

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--bg-primary-subtle, #f0fdf4)', border: '1px solid var(--border-subtle)' }}
    >
      {/* Poin utama */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-compact-xs font-semibold uppercase tracking-wide m-0"
             style={{ color: 'var(--text-muted)' }}>
            Total Poin Berkah
          </p>
          <p className="text-4xl font-bold leading-[1.1] m-0 mt-1"
             style={{ color: 'var(--text-primary)' }}>
            {points.toLocaleString('id-ID')}
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--bg-success-subtle)', color: 'var(--text-success)' }}
        >
          <Leaf size={22} strokeWidth={1.75} />
        </div>
      </div>

      {/* Streak */}
      <div
        className="rounded-lg px-4 py-3.5 flex flex-col gap-3"
        style={{ background: 'var(--color-primary-800, #166534)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={15} strokeWidth={1.75} className="text-secondary-400" />
            <p className="text-compact-sm font-semibold text-white m-0">
              Streak {streakCount} hari
            </p>
          </div>
          <span
            className="text-compact-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'var(--bg-warning-subtle)', color: 'var(--text-warning)' }}
          >
            +{bonusBerikutnya} poin/hari
          </span>
        </div>

        <StreakWeek streakCount={streakCount} lastActiveDate={lastActiveDate} />

        <p className="text-compact-xs text-white/50 m-0">
          Streak minggu ini · Aktif = ada transaksi berhasil hari itu
        </p>
      </div>
    </div>
  )
}

const SOURCE_LABEL = {
  KARBON: { label: 'Karbon',  style: { background: 'var(--bg-success-subtle)', color: 'var(--text-success)' } },
  STREAK: { label: 'Streak',  style: { background: 'var(--bg-warning-subtle)', color: 'var(--text-warning)' } },
}

function RiwayatItem({ log }) {
  const src = SOURCE_LABEL[log.source] ?? { label: log.source, style: {} }
  const tanggal = new Date(log.createdAt).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border-[0.5px]"
      style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-compact-sm font-medium m-0 truncate"
           style={{ color: 'var(--text-primary)' }}>
          {log.note ?? '—'}
        </p>
        <p className="text-compact-xs m-0" style={{ color: 'var(--text-muted)' }}>
          {tanggal}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className="text-compact-xs font-medium px-2 py-0.5 rounded-full"
          style={src.style}
        >
          {src.label}
        </span>
        <span
          className="text-compact-sm font-semibold"
          style={{ color: 'var(--text-success)' }}
        >
          +{log.delta}
        </span>
      </div>
    </div>
  )
}

const FILTER_OPTIONS = [
  { value: 'SEMUA',  label: 'Semua' },
  { value: 'KARBON', label: 'Karbon' },
  { value: 'STREAK', label: 'Streak' },
]

export default function PoinBerkah() {
  const [summary, setSummary]     = useState(null)
  const [logs, setLogs]           = useState([])
  const [total, setTotal]         = useState(0)
  const [filter, setFilter]       = useState('SEMUA')
  const [offset, setOffset]       = useState(0)
  const [loading, setLoading]     = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError]         = useState(null)

  const LIMIT = 15

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  // Fetch summary
  useEffect(() => {
    fetch(`${API_ORIGIN}/api/poin`, { headers })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => setSummary(d.data))
      .catch(() => setError('Gagal memuat data poin.'))
  }, [])

  // Fetch riwayat — reset saat filter berubah
  const fetchLogs = useCallback((currentOffset, append = false) => {
    const params = new URLSearchParams({ limit: LIMIT, offset: currentOffset })
    if (filter !== 'SEMUA') params.set('source', filter)

    const setter = append ? setLoadingMore : setLoading

    setter(true)
    fetch(`${API_ORIGIN}/api/poin/riwayat?${params}`, { headers })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => {
        setLogs(prev => append ? [...prev, ...d.data.logs] : d.data.logs)
        setTotal(d.data.total)
        setOffset(currentOffset + d.data.logs.length)
      })
      .catch(() => setError('Gagal memuat riwayat poin.'))
      .finally(() => setter(false))
  }, [filter])

  useEffect(() => {
    setLogs([])
    setOffset(0)
    fetchLogs(0, false)
  }, [filter])

  const sudahSemua = logs.length >= total

  if (error) {
    return (
      <div className="flex items-center justify-center py-24 px-6">
        <p className="text-compact-base m-0" style={{ color: 'var(--text-danger)' }}>{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 p-5 max-w-2xl mx-auto pb-10">

      {/* Summary card */}
      {loading && !summary ? (
        <div
          className="rounded-xl p-5 h-48 animate-pulse"
          style={{ background: 'var(--bg-subtle)' }}
        />
      ) : summary ? (
        <SummaryCard
          points={summary.points}
          streakCount={summary.streakCount}
          lastActiveDate={summary.lastActiveDate}
        />
      ) : null}

      {/* Riwayat header + filter */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-compact-base font-semibold m-0"
           style={{ color: 'var(--text-primary)' }}>
          Riwayat Poin
        </p>
        <div className="flex items-center gap-1.5">
          <Filter size={13} strokeWidth={1.75} style={{ color: 'var(--text-muted)' }} />
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className="px-2.5 py-1 rounded-full text-compact-xs font-medium transition-colors duration-fast cursor-pointer border-[0.5px]"
              style={filter === opt.value
                ? { background: 'var(--bg-brand)', color: 'var(--text-on-brand)', borderColor: 'transparent' }
                : { background: 'var(--bg-surface-1)', color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)' }
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Riwayat list */}
      {loading ? (
        <div className="flex flex-col gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg animate-pulse"
                 style={{ background: 'var(--bg-subtle)' }} />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-compact-base font-medium m-0" style={{ color: 'var(--text-secondary)' }}>
            Belum ada riwayat poin
          </p>
          <p className="text-compact-sm m-0" style={{ color: 'var(--text-muted)' }}>
            Mulai selamatkan makanan untuk mendapat poin pertamamu!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {logs.map(log => <RiwayatItem key={log.id} log={log} />)}
        </div>
      )}

      {/* Load more */}
      {!loading && !sudahSemua && (
        <button
          onClick={() => fetchLogs(offset, true)}
          disabled={loadingMore}
          className="self-center px-5 py-2 rounded-full text-compact-sm font-medium border-[0.5px] transition-colors duration-fast cursor-pointer"
          style={{
            background: 'var(--bg-surface-1)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)',
            opacity: loadingMore ? 0.6 : 1,
          }}
        >
          {loadingMore ? 'Memuat...' : `Muat lebih banyak (${total - logs.length} lagi)`}
        </button>
      )}
    </div>
  )
}