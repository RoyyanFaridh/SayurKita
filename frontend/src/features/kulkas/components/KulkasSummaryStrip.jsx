import { AlertTriangle, AlertCircle, Leaf, Package } from 'lucide-react'

const SUMMARY_CONFIG = [
  { type: 'total',   label: 'Total Bahan', Icon: Package,       iconType: 'green'   },
  { type: 'danger',  label: 'Kritis',      Icon: AlertCircle,   iconType: 'danger'  },
  { type: 'warning', label: 'Perhatian',   Icon: AlertTriangle, iconType: 'warning' },
  { type: 'fresh',   label: 'Segar',       Icon: Leaf,          iconType: 'teal'    },
]

const iconStyle = {
  green:   { background: 'var(--bg-success-subtle)', color: 'var(--text-success)'      },
  danger:  { background: 'var(--bg-danger-subtle)',  color: 'var(--color-danger-800)'  },
  warning: { background: 'var(--bg-warning-subtle)', color: 'var(--color-warning-800)' },
  teal:    { background: 'var(--bg-subtle)',          color: 'var(--text-brand)'        },
}

export default function KulkasSummaryStrip({ counts }) {
  return (
    <div className="grid grid-cols-4 gap-2.5 max-sm:grid-cols-2 max-sm:gap-2">
      {SUMMARY_CONFIG.map(({ type, label, Icon, iconType }) => (
        <div
          key={type}
          className="flex flex-col gap-2 rounded-md p-3.5 border max-sm:p-3"
          style={{
            background: 'var(--bg-surface-1)',
            borderColor: 'var(--border-subsub)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          {/* Icon + label */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
              style={iconStyle[iconType]}
            >
              <Icon size={13} strokeWidth={1.75} />
            </div>
            <p className="text-compact-xs font-medium m-0 leading-tight" style={{ color: 'var(--text-muted)' }}>
              {label}
            </p>
          </div>

          {/* Angka */}
          <p className="text-2xl font-bold m-0 leading-none" style={{ color: 'var(--text-primary)' }}>
            {counts[type] ?? 0}
            <span className="text-compact-sm font-normal ml-1" style={{ color: 'var(--text-muted)' }}>
              bahan
            </span>
          </p>
        </div>
      ))}
    </div>
  )
}