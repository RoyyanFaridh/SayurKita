import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const ITEMS = [
  { id: 1, name: 'Bayam segar', expLabel: 'Besok!', expType: 'danger' },
  { id: 2, name: 'Tahu putih',  expLabel: '2 hari',  expType: 'warning' },
  { id: 3, name: 'Tempe',       expLabel: '5 hari',  expType: 'ok' },
  { id: 4, name: 'Santan Kara', expLabel: '12 hari', expType: 'fresh' },
]

const badgeStyle = {
  danger:  { background: 'var(--bg-danger-subtle)',  color: 'var(--text-danger)' },
  warning: { background: 'var(--bg-warning-subtle)', color: 'var(--text-warning)' },
  ok:      { background: 'var(--bg-success-subtle)', color: 'var(--text-success)' },
  fresh:   { background: 'var(--bg-success-subtle)', color: 'var(--text-success)' },
}

export default function KulkasDashWidget() {
  return (
    <div
      className="rounded-md overflow-hidden p-4 border"
      style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subsub)', boxShadow: 'var(--shadow-xs)' }}
    >
      <div
        className="flex justify-between items-center pb-2.5 mb-2.5 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <h2 className="text-compact-lg font-semibold leading-snug m-0" style={{ color: 'var(--text-primary)' }}>
          Lihat Kulkas
        </h2>
        <Link
          to="/kulkas"
          className="inline-flex items-center gap-1 text-compact-base font-medium transition-colors duration-150"
          style={{ color: 'var(--text-brand)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-green-light)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-brand)'}
        >
          Lihat semua <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </div>

      <ul>
        {ITEMS.map(({ id, name, expLabel, expType }, i) => (
          <li
            key={id}
            className="flex justify-between items-center py-4"
            style={{ borderBottom: i < ITEMS.length - 1 ? '1px solid var(--border-subsub)' : 'none' }}
          >
            <span className="text-compact-base" style={{ color: 'var(--text-primary)' }}>{name}</span>
            <span
              className="text-compact-sm font-medium px-3 py-1 rounded-full"
              style={badgeStyle[expType]}
            >
              {expLabel}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}