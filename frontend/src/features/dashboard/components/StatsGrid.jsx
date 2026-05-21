import { useState, useEffect } from 'react'
import { Refrigerator, Clock, TrendingUp, Leaf } from 'lucide-react'
import { API_ORIGIN } from '../../../config/api'

const STAT_TEMPLATES = [
  { id: 'kulkas',  label: 'Bahan di kulkas',       valueUnit: 'bahan',    badgeType: 'green', Icon: Refrigerator, iconType: 'green' },
  { id: 'posting', label: 'Posting aktif',          valueUnit: 'postingan', badgeType: 'amber', Icon: Clock,        iconType: 'amber' },
  { id: 'surplus', label: 'Surplus diselamatkan',   valueUnit: 'surplus',  badgeType: 'teal',  Icon: TrendingUp,   iconType: 'teal'  },
  { id: 'karbon',  label: 'Karbon diselamatkan',    valueUnit: 'kg CO₂',   badgeType: 'lime',  Icon: Leaf,         iconType: 'lime'  },
]

const iconStyle = {
  green: { background: 'var(--bg-success-subtle)',    color: 'var(--text-success)' },
  amber: { background: 'var(--bg-secondary-subtle)',  color: 'var(--color-secondary-600)' },
  teal:  { background: 'var(--bg-subtle)',             color: 'var(--text-brand)' },
  lime:  { background: 'var(--bg-success-subtle)',    color: 'var(--text-success)' },
}

const badgeStyle = {
  green: { background: 'var(--bg-success-subtle)',    color: 'var(--text-success)' },
  amber: { background: 'var(--bg-secondary-subtle)',  color: 'var(--color-secondary-600)' },
  teal:  { background: 'var(--bg-subtle)',             color: 'var(--text-brand)' },
  lime:  { background: 'var(--bg-success-subtle)',    color: 'var(--text-success)' },
  red:   { background: 'var(--bg-danger-subtle)',     color: 'var(--color-danger-800)' },
}

export default function StatsGrid({ stats }) {
  const [kulkasSummary, setKulkasSummary] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch(`${API_ORIGIN}/api/ingredients/stats/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.data) setKulkasSummary(data.data) })
      .catch(console.error)
  }, [])

  const resolvedStats = [
    {
      ...STAT_TEMPLATES[0],
      value: stats ? String(stats.totalBahanKulkas) : '—',
      badge: kulkasSummary
        ? kulkasSummary.critical > 0
          ? `${kulkasSummary.critical} bahan kritis`
          : 'Semua aman'
        : stats ? `${stats.totalBahanKulkas} bahan` : '...',
      badgeType: kulkasSummary?.critical > 0 ? 'red' : 'green',
    },
    {
      ...STAT_TEMPLATES[1],
      value: stats ? String(stats.postingAktif) : '—',
      badge: stats?.postingAktif === 0 ? 'Belum ada posting' : `${stats?.postingAktif ?? '...'} aktif`,
    },
    {
      ...STAT_TEMPLATES[2],
      value: stats ? String(stats.surplusDiselamatkan) : '—',
      badge: stats?.surplusDiselamatkan > 0 ? `+${stats.surplusDiselamatkan} total` : 'Mulai selamatkan!',
    },
    {
      ...STAT_TEMPLATES[3],
      value: stats ? String(stats.karbonDiselamatkan) : '—',
      badge: 'Estimasi dampak',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-2.5 max-[900px]:grid-cols-2 max-[400px]:gap-2">
      {resolvedStats.map(({ id, Icon, iconType, value, valueUnit, label, badge, badgeType, note, noteType }) => (
        <div
          key={id}
          className="flex flex-col gap-2 rounded-md p-3.5 border transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-sm max-[400px]:p-3"
          style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subsub)', boxShadow: 'var(--shadow-xs)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={iconStyle[iconType]}>
              <Icon size={16} strokeWidth={1.75} />
            </div>
            <p className="text-compact-sm m-0" style={{ color: 'var(--text-secondary)' }}>{label}</p>
          </div>

          <div className="flex items-baseline gap-2 ml-1">
            <p
              className="text-3xl font-bold m-0 max-[400px]:text-xl"
              style={{ color: 'var(--text-primary)', lineHeight: 2 }}
            >
              {value}
              {valueUnit && (
                <span className="text-sm font-medium ml-1" style={{ color: 'var(--text-secondary)' }}>
                  {valueUnit}
                </span>
              )}
            </p>
          </div>

          <span
            className="self-start text-compact-xs font-medium px-2 py-0.5 rounded-full"
            style={badgeStyle[badgeType]}
          >
            {badge}
          </span>

          {note && (
            <p
              className="text-compact-xs m-0"
              style={{ color: noteType === 'danger' ? 'var(--color-danger-800)' : 'var(--text-muted)' }}
            >
              {note}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}