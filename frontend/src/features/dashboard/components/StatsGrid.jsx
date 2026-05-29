import { Refrigerator, Clock, TrendingUp, Leaf } from 'lucide-react'

const STAT_TEMPLATES = [
  { id: 'kulkas',  label: 'Bahan di kulkas',     valueUnit: 'bahan',     badgeType: 'green', Icon: Refrigerator, iconType: 'green' },
  { id: 'posting', label: 'Posting aktif',        valueUnit: 'postingan', badgeType: 'amber', Icon: Clock,        iconType: 'amber' },
  { id: 'surplus', label: 'Surplus diselamatkan', valueUnit: 'surplus',   badgeType: 'teal',  Icon: TrendingUp,   iconType: 'teal'  },
  { id: 'karbon',  label: 'Karbon diselamatkan',  valueUnit: 'kg CO₂',   badgeType: 'lime',  Icon: Leaf,         iconType: 'lime'  },
]

const iconStyle = {
  green: { background: 'var(--bg-success-subtle)',   color: 'var(--text-success)' },
  amber: { background: 'var(--bg-secondary-subtle)', color: 'var(--color-secondary-600)' },
  teal:  { background: 'var(--bg-subtle)',            color: 'var(--text-brand)' },
  lime:  { background: 'var(--bg-success-subtle)',   color: 'var(--text-success)' },
}

const badgeStyle = {
  green: { background: 'var(--bg-success-subtle)',   color: 'var(--text-success)' },
  amber: { background: 'var(--bg-secondary-subtle)', color: 'var(--color-secondary-600)' },
  teal:  { background: 'var(--bg-subtle)',            color: 'var(--text-brand)' },
  lime:  { background: 'var(--bg-success-subtle)',   color: 'var(--text-success)' },
  red:   { background: 'var(--bg-danger-subtle)',    color: 'var(--color-danger-800)' },
}

export default function StatsGrid({ stats }) {
  // console.log dihapus — debug log tidak boleh ada di production component

  const kulkasBadge = !stats
    ? '...'
    : stats.expired > 0
      ? `${stats.expired} kadaluarsa`
      : stats.critical > 0
        ? `${stats.critical} bahan kritis`
        : stats.warning > 0
          ? `${stats.warning} hampir kadaluwarsa`
          : 'Semua aman'

  const kulkasBadgeType = (stats?.expired > 0 || stats?.critical > 0)
    ? 'red'
    : stats?.warning > 0
      ? 'amber'
      : 'green'

  const resolvedStats = [
    {
      ...STAT_TEMPLATES[0],
      value:     stats ? String(stats.totalBahanKulkas) : '—',
      badge:     kulkasBadge,
      badgeType: kulkasBadgeType,
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
          // border-[0.5px] + --border-subtle — konsisten dengan semua card lain
          // hover lift dihapus — false affordance untuk elemen non-interaktif
          className="flex flex-col rounded-md p-3.5 border-[0.5px] max-[400px]:p-3"
          style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}
        >
          {/* Icon + label row */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={iconStyle[iconType]}>
              <Icon size={15} strokeWidth={1.75} />
            </div>
            <p className="text-compact-sm m-0" style={{ color: 'var(--text-secondary)' }}>{label}</p>
          </div>

          <div className="flex items-baseline gap-1.5 mb-2.5">
            <p
              className="text-2xl font-semibold m-0 max-[400px]:text-xl"
              style={{ color: 'var(--text-primary)', lineHeight: 1.1 }}
            >
              {value}
            </p>
            {valueUnit && (
              <span className="text-compact-sm font-normal" style={{ color: 'var(--text-secondary)' }}>
                {valueUnit}
              </span>
            )}
          </div>

          <span
            className="self-start text-compact-xs font-medium px-2 py-0.5 rounded-full"
            style={badgeStyle[badgeType]}
          >
            {badge}
          </span>

          {note && (
            <p
              className="text-compact-xs mt-2 m-0"
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