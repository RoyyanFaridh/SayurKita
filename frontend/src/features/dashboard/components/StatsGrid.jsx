import { Refrigerator, Clock, TrendingUp, Leaf } from 'lucide-react'

const STATS = [
  {
    id: 'kulkas',
    label: 'Bahan di kulkas',
    value: '6',
    valueUnit: 'bahan',
    badge: '+2 bahan',
    badgeType: 'green',
    noteType: 'danger',
    Icon: Refrigerator,
    iconType: 'green',
  },
  {
    id: 'posting',
    label: 'Posting aktif',
    value: '1',
    valueUnit: 'postingan',
    badge: '47 mnt tersisa',
    badgeType: 'amber',
    Icon: Clock,
    iconType: 'amber',
  },
  {
    id: 'surplus',
    label: 'Surplus diselamatkan',
    value: '12',
    valueUnit: 'surplus',
    badge: '+2 April ini',
    badgeType: 'teal',
    Icon: TrendingUp,
    iconType: 'teal',
  },
  {
    id: 'karbon',
    label: 'Karbon diselamatkan',
    value: '2',
    valueUnit: 'kg',
    badge: 'April ini',
    badgeType: 'lime',
    Icon: Leaf,
    iconType: 'lime',
  },
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
  red:   { background: 'var(--bg-danger-subtle)',    color: 'var(--text-danger)' },
}

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-4 gap-2.5 max-[900px]:grid-cols-2 max-[400px]:gap-2">
      {STATS.map(({ id, Icon, iconType, value, valueUnit, label, badge, badgeType, note, noteType }) => (
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
              style={{ color: noteType === 'danger' ? 'var(--text-danger)' : 'var(--text-muted)' }}
            >
              {note}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}