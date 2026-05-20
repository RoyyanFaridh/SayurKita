import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const badgeStyle = {
  expired: { background: 'var(--bg-danger-subtle)',  color: 'var(--text-danger)' },
  danger:  { background: 'var(--bg-danger-subtle)',  color: 'var(--text-danger)' },
  warning: { background: 'var(--bg-warning-subtle)', color: 'var(--text-warning)' },
  ok:      { background: 'var(--bg-success-subtle)', color: 'var(--text-success)' },
  fresh:   { background: 'var(--bg-success-subtle)', color: 'var(--text-success)' },
}

/**
 * @param {{ items?: Array<{ id: string, nama: string, jumlah: string, expStatus: string, expLabel: string }> }} props
 */
export default function KulkasDashWidget({ items }) {
  const list = items ?? []

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

      {list.length === 0 ? (
        <p className="text-compact-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>
          Kulkas masih kosong. <Link to="/kulkas" style={{ color: 'var(--text-brand)' }}>Tambah bahan →</Link>
        </p>
      ) : (
        <ul>
          {list.map(({ id, nama, jumlah, expStatus, expLabel }, i) => (
            <li
              key={id}
              className="flex justify-between items-center py-4"
              style={{ borderBottom: i < list.length - 1 ? '1px solid var(--border-subsub)' : 'none' }}
            >
              <div>
                <span className="text-compact-base" style={{ color: 'var(--text-primary)' }}>{nama}</span>
                {jumlah && (
                  <span className="ml-1.5 text-compact-sm" style={{ color: 'var(--text-muted)' }}>
                    · {jumlah}
                  </span>
                )}
              </div>
              <span
                className="text-compact-sm font-medium px-3 py-1 rounded-full"
                style={badgeStyle[expStatus] ?? badgeStyle.ok}
              >
                {expLabel}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}