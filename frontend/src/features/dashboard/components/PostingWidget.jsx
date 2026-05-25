import { ArrowRight } from 'lucide-react'

const POSTINGS = [
  {
    id: 1,
    name: 'Rendang Sisa Lebaran',
    statusLabel: 'Aktif',
    statusType: 'aktif',
    sub: 'Menunggu klaim',
    note: 'Jika tidak diklaim, otomatis akan dikirim ke Mitra Organik',
  },
]

const BADGE_MAP = {
  aktif:   'bg-(--bg-dark) text-(--text-brand-dark)',
  selesai: 'bg-(--bg-success-subtle) text-(--text-success)',
  expired: 'bg-(--bg-danger-subtle) text-(--text-danger)',
  // fallback ditangani di bawah via ?? operator
}

export default function PostingWidget() {
  return (
    <div
      // rounded-md — konsisten dengan semua card lain di dashboard
      // border-[0.5px] + inline borderColor — konsisten, --border-subsub dihapus
      // shadow via inline style — konsisten dengan KulkasDashWidget
      className="rounded-md overflow-hidden border-[0.5px]"
      style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}
    >
      {/* Header: ganti px-4 py-3.5 → p-4 pb-2 + border-b, konsisten dengan KulkasDashWidget */}
      <div
        className="flex justify-between items-center px-4 pt-4 pb-2 mb-0 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <h2 className="text-compact-lg font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
          Posting Aktifmu
        </h2>
        <button
          className="inline-flex items-center gap-1 text-compact-base font-medium border-none bg-transparent cursor-pointer transition-colors duration-150 hover:opacity-75"
          style={{ color: 'var(--text-brand)' }}
        >
          Lihat semua <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      <ul className="list-none p-0 m-0">
        {POSTINGS.map((p, i) => (
          <li
            key={p.id}
            className={i < POSTINGS.length - 1 ? 'border-b' : ''}
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <div
                // tambah border tipis agar thumbnail terlihat di dark mode
                className="w-10 h-10 rounded-md shrink-0 border-[0.5px]"
                style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-subtle)' }}
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                {/* font-medium — bukan semibold, agar hierarki terbaca: title card (semibold) > item name (medium) */}
                <p className="text-compact-lg font-medium truncate m-0" style={{ color: 'var(--text-primary)' }}>
                  {p.name}
                </p>
                <p className="text-compact-sm mt-0.5 m-0" style={{ color: 'var(--text-muted)' }}>
                  {p.sub}
                </p>
              </div>
              <span
                className={`text-compact-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${BADGE_MAP[p.statusType] ?? 'bg-(--bg-subtle) text-(--text-secondary)'}`}
              >
                {p.statusLabel}
              </span>
            </div>

            {p.note && (
              // --text-secondary bukan --text-brand — note adalah info pasif, bukan aksi
              <p
                className="text-compact-sm px-4 py-2.5 m-0 border-t"
                style={{
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                {p.note}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}