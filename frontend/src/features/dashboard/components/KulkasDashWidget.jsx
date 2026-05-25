import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const badgeStyle = {
  expired: { background: 'var(--bg-danger-subtle)',  color: 'var(--text-danger)' },
  danger:  { background: 'var(--bg-danger-subtle)',  color: 'var(--text-danger)' },
  warning: { background: 'var(--bg-warning-subtle)', color: 'var(--text-warning)' },
  ok:      { background: 'var(--bg-success-subtle)', color: 'var(--text-success)' },
  fresh:   { background: 'var(--bg-success-subtle)', color: 'var(--text-success)' },
}

export default function KulkasDashWidget({ items }) {
  const list = items ?? []

  return (
    <div
      // border-[0.5px] — konsisten dengan komponen lain, --border-subsub → --border-subtle
      className="rounded-md overflow-hidden p-4 border-[0.5px]"
      style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}
    >
      <div
        className="flex justify-between items-center pb-2 mb-2 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {/* Tidak ada icon wrap di sini — intentional karena ini bukan AI card.
            Jika card lain di grid dashboard semua punya icon header, pertimbangkan
            tambah ikon kulkas (Refrigerator dari lucide) agar konsisten. */}
        <h2 className="text-compact-lg font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
          Lihat Kulkas
        </h2>
        {/* Hapus onMouseEnter/onMouseLeave — gunakan Tailwind hover atau CSS class.
            Inline event handler untuk hover adalah anti-pattern di React. */}
        <Link
          to="/kulkas"
          className="inline-flex items-center gap-1 text-compact-base font-medium transition-colors duration-150 hover:opacity-75"
          style={{ color: 'var(--text-brand)' }}
        >
          Lihat semua <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </div>

      {list.length === 0 ? (
        <p className="text-compact-sm py-6 text-center m-0" style={{ color: 'var(--text-muted)' }}>
          Kulkas masih kosong.{' '}
          <Link to="/kulkas" style={{ color: 'var(--text-brand)' }}>Tambah bahan →</Link>
        </p>
      ) : (
        <ul className="list-none p-0 m-0">
          {list.map(({ id, nama, jumlah, expStatus, expLabel }, i) => (
            <li
              key={id}
              // items-center — bukan items-baseline, agar badge tidak menggantung jika nama wrap
              className="flex justify-between items-center py-3"
              style={{
                borderBottom: i < list.length - 1
                  ? '0.5px solid var(--border-subtle)'  // --border-subsub → --border-subtle
                  : 'none',
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-compact-base truncate capitalize" style={{ color: 'var(--text-primary)' }}>
                  {nama}
                </span>
                {jumlah && jumlah !== '-' && (
                  <span className="text-compact-sm shrink-0" style={{ color: 'var(--text-muted)' }}>
                    · {jumlah}
                  </span>
                )}
              </div>
              <span
                className="shrink-0 ml-3 text-compact-xs font-medium px-2.5 py-0.5 rounded-full"
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