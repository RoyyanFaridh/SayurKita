import { Package, MapPin, Clock, Users } from 'lucide-react'

const ICON_STYLE = {
  primary: { background: 'var(--bg-primary-subtle)', color: 'var(--text-brand)'    },
  neutral: { background: 'var(--bg-subtle)',          color: 'var(--text-muted)'    },
  warning: { background: 'var(--bg-warning-subtle)', color: 'var(--color-warning-800)' },
  success: { background: 'var(--bg-success-subtle)', color: 'var(--text-success)'  },
}

export default function SelamatkanStatsBar({ stats = { active: 0, radius: 5, expiring: 0, savedThisMonth: 0 } }) {
  const STATS_CONFIG = [
    {
      key:      'surplus',
      icon:     Package,
      value:    stats.active.toString(),
      label:    'Surplus aktif',
      iconType: 'primary',
    },
    {
      key:      'radius',
      icon:     MapPin,
      value:    `${stats.radius} km`,
      label:    'Radius lokasi',
      iconType: 'neutral',
    },
    {
      key:      'expiring',
      icon:     Clock,
      value:    stats.expiring.toString(),
      label:    'Segera kadaluwarsa',
      iconType: 'warning',
    },
    {
      key:      'saved',
      icon:     Users,
      value:    stats.savedThisMonth.toString(),
      label:    'Diselamatkan bulan ini',
      iconType: 'success',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-2.5 max-sm:grid-cols-2 max-sm:gap-2">
      {STATS_CONFIG.map(({ key, icon: Icon, value, label, iconType }) => (
        <div
          key={key}
          className="flex flex-col gap-2 rounded-md p-3.5 border max-sm:p-3"
          style={{
            background:   'var(--bg-surface-1)',
            borderColor:  'var(--border-subsub)',
            boxShadow:    'var(--shadow-xs)',
          }}
        >
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
              style={ICON_STYLE[iconType]}
            >
              <Icon size={13} strokeWidth={1.75} />
            </div>
            <p className="text-compact-xs font-medium m-0 leading-tight" style={{ color: 'var(--text-muted)' }}>
              {label}
            </p>
          </div>

          <p className="text-2xl font-bold m-0 leading-none" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
        </div>
      ))}
    </div>
  )
}