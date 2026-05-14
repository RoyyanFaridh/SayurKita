const ALERTS = [
  { id: 1, type: 'danger',  title: 'Bayam segar kadaluwarsa besok',      sub: 'Segera masak atau posting sebagai surplus', btnLabel: 'Tangani' },
  { id: 2, type: 'warning', title: 'Tahu putih kadaluwarsa 2 hari lagi', sub: 'Segera masak atau posting sebagai surplus', btnLabel: 'Lihat' },
]

const config = {
  danger: {
    wrapper: { background: 'var(--bg-danger-subtle)', borderColor: 'var(--border-danger)' },
    dot:     { background: 'var(--color-danger-500)' },
    title:   { color: 'var(--text-danger)' },
    sub:     { color: 'var(--color-danger-500)' },
    btn:     { background: 'var(--color-danger-500)', color: '#ffffff' },
  },
  warning: {
    wrapper: { background: 'var(--bg-warning-subtle)', borderColor: 'var(--border-warning)' },
    dot:     { background: 'var(--color-warning-500)' },
    title:   { color: 'var(--text-warning)' },
    sub:     { color: 'var(--color-warning-500)' },
    btn:     { background: 'var(--color-warning-500)', color: '#ffffff' },
  },
}

export default function AlertsSection() {
  if (!ALERTS.length) return null
  return (
    <div className="flex flex-col gap-2">
      {ALERTS.map(a => {
        const c = config[a.type]
        return (
          <div
            key={a.id}
            className="flex items-center gap-3 px-4 py-3 rounded-md border max-[480px]:px-3 max-[480px]:py-2.5"
            style={c.wrapper}
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={c.dot} />
            <div className="flex-1 min-w-0">
              <p className="text-compact-lg font-regular truncate m-0" style={c.title}>{a.title}</p>
              <p className="text-compact-sm mt-0.5 m-0 max-[480px]:hidden" style={c.sub}>{a.sub}</p>
            </div>
            <button
              className="shrink-0 px-4 py-1.5 rounded-sm text-compact-base font-medium whitespace-nowrap cursor-pointer border-none transition-opacity duration-150 hover:opacity-85"
              style={c.btn}
            >
              {a.btnLabel}
            </button>
          </div>
        )
      })}
    </div>
  )
}