import { Package, MapPin, Clock, Users } from 'lucide-react'

const STATS = [
  { icon: Package, value: '5',    label: 'Surplus aktif',           style: 'border-primary-200 bg-primary-50',  valueClass: 'text-primary-600',  labelClass: 'text-primary-400'  },
  { icon: MapPin,  value: '5 km', label: 'Radius lokasi',           style: 'border-neutral-100 bg-neutral-50',  valueClass: 'text-neutral-900',  labelClass: 'text-neutral-400'  },
  { icon: Clock,   value: '3',    label: 'Segera kadaluwarsa',      style: 'border-warning-200 bg-warning-50',  valueClass: 'text-warning-500',  labelClass: 'text-warning-500'  },
  { icon: Users,   value: '12',   label: 'Diselamatkan bulan ini',  style: 'border-success-200 bg-success-50',  valueClass: 'text-success-500',  labelClass: 'text-success-500'  },
]

export default function SelamatkanStatsBar() {
  return (
    <div className="grid grid-cols-4 gap-3 max-lg:grid-cols-2">
      {STATS.map(({ icon: Icon, value, label, style, valueClass, labelClass }) => (
        <div
          key={label}
          className={`flex flex-col gap-1 rounded-md border px-4 py-3 ${style}`}
        >
          <p className={`text-2xl font-bold leading-none ${valueClass}`}>
            {value}
          </p>
          <p className={`text-compact-sm font-medium ${labelClass}`}>
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}