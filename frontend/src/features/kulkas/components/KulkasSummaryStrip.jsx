import { AlertTriangle, AlertCircle, Leaf, Package } from 'lucide-react'

const SUMMARY_CONFIG = [
  { type: 'total',   label: 'Total Bahan', Icon: Package,       iconType: 'green',   },
  { type: 'danger',  label: 'Kritis',      Icon: AlertCircle,   iconType: 'danger',  },
  { type: 'warning', label: 'Perhatian',   Icon: AlertTriangle, iconType: 'warning', },
  { type: 'fresh',   label: 'Segar',       Icon: Leaf,          iconType: 'teal',    },
]

const iconStyle = {
  green:   { background: 'var(--bg-success-subtle)',  color: 'var(--text-success)'      },
  danger:  { background: 'var(--bg-danger-subtle)',   color: 'var(--color-danger-800)'  },
  warning: { background: 'var(--bg-warning-subtle)',  color: 'var(--color-warning-800)' },
  teal:    { background: 'var(--bg-subtle)',           color: 'var(--text-brand)'        },
}

export default function KulkasSummaryStrip({ counts }) {
  return (
    <div className="grid grid-cols-4 gap-2.5 max-[900px]:grid-cols-2 max-[400px]:gap-1">
      {SUMMARY_CONFIG.map(({ type, label, Icon, iconType }) => (
        <div
          key={type}
          className="flex flex-col gap-1.5 rounded-md p-3.5 border transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-sm max-[480px]:p-1.5 max-[480px]:gap-0.5 max-[480px]:rounded-sm"
          style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subsub)', boxShadow: 'var(--shadow-xs)' }}
        >
          <div className="flex items-center gap-1.5 max-[480px]:gap-0.5">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 max-[480px]:w-4 max-[480px]:h-4 max-[480px]:rounded-xs"
              style={iconStyle[iconType]}
            >
              <Icon size={16} strokeWidth={1.75} className="max-[480px]:w-2.5 max-[480px]:h-2.5" />
            </div>
            <p
              className="text-compact-sm m-0 max-[480px]:text-[9px] leading-tight"
              style={{ color: 'var(--text-secondary)' }}
            >
              {label}
            </p>
          </div>

          <div className="ml-1 max-[480px]:ml-0">
            <p
              className="text-3xl font-bold m-0 max-[480px]:text-sm max-[400px]:text-xs"
              style={{ color: 'var(--text-primary)', lineHeight: 2 }}
            >
              {counts[type] ?? 0}
              <span
                className="text-sm font-medium ml-1 max-[480px]:text-[9px] max-[480px]:ml-0.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                bahan
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}