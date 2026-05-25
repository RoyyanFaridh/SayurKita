import { MapPin, Clock, Package, MessageCircle, Bookmark, ChevronRight } from 'lucide-react'
import { KONDISI_MAP } from '../selamatkanData'

const BADGE_CLS = {
  success: 'bg-(--bg-success-subtle) text-(--text-success)',
  warning: 'bg-(--bg-warning-subtle) text-(--text-warning)',
  danger:  'bg-(--bg-danger-subtle)  text-(--text-danger)',
}

function KondisiBadge({ kondisi }) {
  const { label, color } = KONDISI_MAP[kondisi] ?? { label: kondisi, color: 'success' }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-compact-sm font-medium whitespace-nowrap shrink-0 ${BADGE_CLS[color]}`}>
      {label}
    </span>
  )
}

function FotoPlaceholder({ nama }) {
  const initials = nama.split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join('')
  return (
    <div className="w-12 h-12 rounded-xl bg-(--bg-subtle) flex items-center justify-center shrink-0">
      <span className="text-sm font-bold text-(--text-brand)">{initials}</span>
    </div>
  )
}

function SurplusCard({ item, onDetail }) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl p-3 border transition-[box-shadow,border-color] duration-150 max-[580px]:flex-col max-[580px]:gap-2"
      style={{
        background:   'var(--bg-surface-1)',
        borderColor:  'var(--border-subtle)',
        boxShadow:    'var(--shadow-xs)',
      }}
    >
      <FotoPlaceholder nama={item.nama} />

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">

        {/* Nama + badge */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h3 className="text-compact-base font-semibold text-(--text-primary) leading-snug">{item.nama}</h3>
          <KondisiBadge kondisi={item.kondisi} />
        </div>

        {/* Deskripsi — naik ke line-clamp-2 agar info tidak terpotong terlalu agresif */}
        <p className="text-compact-sm text-(--text-secondary) leading-relaxed line-clamp-2">{item.deskripsi}</p>

        {/* Metadata row — ikon naik ke 12px */}
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { icon: MapPin,  text: <>{item.lokasi} · <strong className="text-(--text-secondary) font-semibold">{item.jarak}</strong></> },
            { icon: Clock,   text: item.waktu },
            { icon: Package, text: item.jumlah },
          ].map(({ icon: Icon, text }, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-compact-xs text-(--text-muted)">
              <Icon size={12} strokeWidth={2} />{text}
            </span>
          ))}
        </div>

        {/* Footer — hapus opacity modifier pada border, seragamkan token */}
        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-(--border-subsub)">

          {/* Avatar pemilik — naik ke w-6 h-6 */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-compact-xs font-bold flex items-center justify-center shrink-0">
              {item.pemilik[0].toUpperCase()}
            </div>
            <span className="text-compact-sm text-(--text-secondary) font-medium">{item.pemilik}</span>
          </div>

          {/* Actions — primary button turun ke primary-600 */}
          <div className="flex items-center gap-1.5">
            <button
              aria-label="Simpan"
              className="w-7 h-7 flex items-center justify-center bg-transparent border border-(--border-default) rounded-lg text-(--text-muted) cursor-pointer transition-all duration-150 hover:bg-(--bg-secondary-subtle) hover:border-secondary-300 hover:text-secondary-600"
            >
              <Bookmark size={13} strokeWidth={1.75} />
            </button>
            <button
              onClick={() => onDetail?.(item)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-transparent border border-(--border-default) rounded-lg text-compact-xs font-medium text-(--text-secondary) cursor-pointer transition-all duration-150 hover:bg-(--bg-surface-3) hover:border-(--border-strong) hover:text-(--text-primary) max-[580px]:hidden"
            >
              <MessageCircle size={13} strokeWidth={1.75} /> Hubungi
            </button>
            <button
              onClick={() => onDetail?.(item)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-600 text-white border-0 rounded-lg text-compact-xs font-medium cursor-pointer transition-colors duration-150 hover:bg-primary-700"
            >
              Detail <ChevronRight size={12} strokeWidth={2} />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function SelamatkanCardList({ items, onDetail }) {
  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-2 py-12 px-6 text-center border rounded-xl"
        style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subtle)' }}
      >
        <Package size={36} strokeWidth={1} className="text-(--border-strong)" />
        <p className="text-compact-lg font-semibold text-(--text-secondary)">Tidak ada surplus ditemukan</p>
        <p className="text-compact-base text-(--text-muted)">Coba perluas radius atau ubah filter</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map(item => <SurplusCard key={item.id} item={item} onDetail={onDetail} />)}
    </div>
  )
}