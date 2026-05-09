import { Package, MapPin, Clock, Users } from 'lucide-react'

const STATS = [
  { icon: Package, value: '5',    label: 'Surplus aktif'   },
  { icon: MapPin,  value: '5 km', label: 'Radius lokasi'   },
  { icon: Clock,   value: '3',    label: 'Segera kadaluwarsa' },
  { icon: Users,   value: '12',   label: 'Diselamatkan bulan ini' },
]

export default function SelamatkanStatsBar() {
  return (
    <div className="grid grid-cols-4 gap-3 max-lg:grid-cols-2">
      {STATS.map(({ icon: Icon, value, label }) => (
        <div
          key={label}
          className="flex items-center gap-3
                     bg-white border border-(--border-subtle)
                     rounded-xl px-4 py-3 shadow-(--shadow-xs)"
        >
          <Icon size={16} strokeWidth={1.75} className="text-(--text-brand) shrink-0" />
          <div>
            <p className="text-xl font-bold text-(--text-primary) leading-none">
              {value}
            </p>
            <p className="text-compact-sm text-(--text-muted) mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}