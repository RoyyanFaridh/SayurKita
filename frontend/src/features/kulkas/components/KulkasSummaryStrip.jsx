const SUMMARY_CONFIG = [
  { type: 'danger', label: 'Kritis' },
  { type: 'warning', label: 'Perhatian' },
  { type: 'ok', label: 'Oke' },
  { type: 'fresh', label: 'Segar' },
]

export default function KulkasSummaryStrip({ counts }) {
  const styles = {
    danger: {
      card: 'border-danger-200 bg-danger-50',
      count: 'text-danger-500',
      label: 'text-danger-500',
    },
    warning: {
      card: 'border-warning-200 bg-warning-50',
      count: 'text-warning-500',
      label: 'text-warning-500',
    },
    ok: {
      card: 'border-success-200 bg-success-50',
      count: 'text-success-500',
      label: 'text-success-500',
    },
    fresh: {
      card: 'border-neutral-100 bg-neutral-50',
      count: 'text-neutral-900',
      label: 'text-neutral-400',
    },
  }

  return (
    <div className="grid grid-cols-4 gap-3 max-[900px]:grid-cols-2">
      {SUMMARY_CONFIG.map(({ type, label }) => (
        <div
          key={type}
          className={`flex flex-col gap-1 rounded-md border px-4 py-3 ${styles[type].card}`}
        >
          <p className={`text-2xl font-bold leading-none ${styles[type].count}`}>
            {counts[type]}
          </p>

          <p className={`text-compact-sm font-medium ${styles[type].label}`}>
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}