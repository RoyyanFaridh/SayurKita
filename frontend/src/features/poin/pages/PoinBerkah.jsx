import { useState, useEffect, useCallback } from 'react'
import { Flame, Leaf, Filter, Wind, Star } from 'lucide-react'
import { API_ORIGIN } from '../../../config/api'
import PoinTopbar from '../components/PoinTopbar'

const HARI = ['S', 'S', 'R', 'K', 'J', 'S', 'M']

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
        const isToday  = i === hariIniIndex
        const isAktif  = aktif[i]
        const isFuture = i > hariIniIndex

        return (
          <div
            key={i}
            className={`
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
    streakCount === 0 ? 1 :
    streakCount <= 3  ? 1 :
    streakCount <= 10 ? 2 : 3

  const streakLabel = streakCount === 0
    ? 'Belum ada streak'
    : `Streak ${streakCount} hari`

  return (
    <div
      className="rounded-xl overflow-hidden border-[0.5px]"
      style={{ borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}
    >
      {/* Poin section */}
      <div
        className="px-5 pt-5 pb-4 flex items-start justify-between gap-4"
        style={{ background: 'var(--bg-surface-1)' }}
      >
        <div className="flex flex-col gap-1">
          <p
            className="text-compact-xs font-semibold uppercase tracking-widest m-0"
            style={{ color: 'var(--text-muted)' }}
          >
            Total Poin Berkah
          </p>
          <p
            className="text-5xl font-bold leading-[1] m-0"
            style={{ color: 'var(--text-primary)' }}
          >
            {points.toLocaleString('id-ID')}
          </p>
          <p className="text-compact-sm m-0 mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            poin terkumpul
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--bg-success-subtle)', color: 'var(--text-success)' }}
        >
          <Leaf size={18} strokeWidth={1.75} />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

      {/* Streak section */}
      <div
        className="px-5 py-4 flex flex-col gap-3"
        style={{ background: 'var(--color-primary-800, #14532d)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={14} strokeWidth={2} className="text-secondary-400 shrink-0" />
            <p className="text-compact-sm font-semibold text-white m-0">
              {streakLabel}
            </p>
          </div>
          <span
            className="text-compact-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'var(--color-secondary-300, #fcd34d)' }}
          >
            +{bonusBerikutnya} poin/hari
          </span>
        </div>

        <StreakWeek streakCount={streakCount} lastActiveDate={lastActiveDate} />

        <p className="text-compact-xs m-0" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Minggu ini · Aktif = ada transaksi berhasil hari itu
        </p>
      </div>
    </div>
  )
}

const SOURCE_LABEL = {
  KARBON: {
    label: 'Karbon',
    style: { background: 'var(--bg-success-subtle)', color: 'var(--text-success)' },
  },
  STREAK: {
    label: 'Streak',
    style: { background: 'var(--bg-warning-subtle)', color: 'var(--text-warning)' },
  },
}

function RiwayatItem({ log }) {
  const src = SOURCE_LABEL[log.source] ?? { label: log.source, style: {} }
  const tanggal = new Date(log.createdAt).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border-[0.5px]"
      style={{
        background:   'var(--bg-surface-1)',
        borderColor:  'var(--border-subtle)',
        boxShadow:    'var(--shadow-xs)',
      }}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <p
          className="text-compact-sm font-medium m-0 truncate"
          style={{ color: 'var(--text-primary)' }}
        >
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
          className="text-compact-base font-bold min-w-[2.5rem] text-right"
          style={{ color: 'var(--text-success)' }}
        >
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

export default function PoinBerkah() {
  const [summary, setSummary]               = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [logs, setLogs]                     = useState([])
  const [total, setTotal]                   = useState(0)
  const [filter, setFilter]                 = useState('SEMUA')
  const [offset, setOffset]                 = useState(0)
  const [logsLoading, setLogsLoading]       = useState(true)
  const [loadingMore, setLoadingMore]       = useState(false)
  const [error, setError]                   = useState(null)

  const LIMIT = 15

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  })

  // Fetch summary — sekali saja
  useEffect(() => {
    setSummaryLoading(true)
    fetch(`${API_ORIGIN}/api/poin`, { headers: getHeaders() })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => setSummary(d.data))
      .catch(() => setError('Gagal memuat data poin.'))
      .finally(() => setSummaryLoading(false))
  }, [])

  // Fetch riwayat — reset saat filter berubah
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
      .catch(() => setError('Gagal memuat riwayat poin.'))
      .finally(() => {
        if (append) setLoadingMore(false)
        else setLogsLoading(false)
      })
  }, [filter])

  useEffect(() => {
    setLogs([])
    setOffset(0)
    fetchLogs(0, false)
  }, [filter])

  const sudahSemua = logs.length >= total

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

  return (
    <>
      {/* Desktop topbar — konsisten dengan KulkasTopbar */}
      <PoinTopbar points={summary?.points ?? null} />

      {/* Mobile header — konsisten dengan LihatKulkas mobile header */}
      <div className="hidden items-center justify-between rounded-b-xl bg-primary-600 px-4 pb-5 pt-4 max-[640px]:flex">
        <div className="flex items-center gap-2.5">
          <Star size={16} strokeWidth={1.75} className="text-secondary-400 shrink-0" />
          <div>
            <h1 className="text-xl font-bold leading-snug text-white">Poin Berkah</h1>
            <p className="mt-1 text-compact-xs text-white/35">
              {summary !== null
                ? `${summary.points.toLocaleString('id-ID')} poin terkumpul`
                : 'Memuat...'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-col gap-5 px-7 pb-10 pt-6 max-w-xl max-[640px]:px-4 max-[640px]:pt-4 max-[640px]:pb-8">

        {/* Summary card */}
        {summaryLoading ? (
          <div
            className="rounded-xl h-52 animate-pulse"
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p
            className="text-compact-base font-semibold m-0"
            style={{ color: 'var(--text-primary)' }}
          >
            Riwayat Poin
            {total > 0 && (
              <span
                className="ml-2 text-compact-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
              >
                {total}
              </span>
            )}
          </p>

          <div className="flex items-center gap-1.5">
            <Filter size={12} strokeWidth={1.75} style={{ color: 'var(--text-muted)' }} />
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
        {logsLoading ? (
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-lg animate-pulse"
                style={{ background: 'var(--bg-subtle)' }}
              />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-1"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
            >
              <Wind size={20} strokeWidth={1.5} />
            </div>
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
        {!logsLoading && !sudahSemua && (
          <button
            onClick={() => fetchLogs(offset, true)}
            disabled={loadingMore}
            className="self-center px-5 py-2 rounded-full text-compact-sm font-medium border-[0.5px] transition-colors duration-fast cursor-pointer"
            style={{
              background:  'var(--bg-surface-1)',
              borderColor: 'var(--border-subtle)',
              color:       'var(--text-secondary)',
              opacity:     loadingMore ? 0.6 : 1,
            }}
          >
            {loadingMore ? 'Memuat...' : `Muat lebih banyak (${total - logs.length} lagi)`}
          </button>
        )}
      </div>
    </>
  )
}