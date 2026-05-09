import { MapPin, Clock, Package, MessageCircle, Bookmark, ChevronRight } from 'lucide-react'
import { KONDISI_MAP } from '../selamatkanData'

const BADGE_CLS = {
  success: 'bg-[var(--bg-success-subtle)] text-[var(--text-success)]',
  warning: 'bg-[var(--bg-warning-subtle)] text-[var(--text-warning)]',
  danger:  'bg-[var(--bg-danger-subtle)]  text-[var(--text-danger)]',
}

function KondisiBadge({ kondisi }) {
  const { label, color } = KONDISI_MAP[kondisi] ?? { label: kondisi, color: 'success' }
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-[0.6875rem] font-medium
                      whitespace-nowrap shrink-0 ${BADGE_CLS[color]}`}>
      {label}
    </span>
  )
}

function FotoPlaceholder({ nama }) {
  const initials = nama.split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join('')
  return (
    <div className="w-[72px] h-[72px] rounded-xl bg-[var(--bg-subtle)]
                    flex items-center justify-center shrink-0">
      <span className="text-xl font-bold text-[var(--text-brand)]">{initials}</span>
    </div>
  )
}

function SurplusCard({ item, onDetail }) {
  return (
    <div className="flex gap-4 bg-white border border-[var(--border-subtle)]
                    rounded-2xl p-4 shadow-[var(--shadow-xs)]
                    transition-[box-shadow,border-color] duration-150
                    hover:shadow-[var(--shadow-md)] hover:border-[var(--border-default)]
                    max-[580px]:flex-col max-[580px]:gap-3">
      <FotoPlaceholder nama={item.nama} />

      <div className="flex-1 min-w-0 flex flex-col gap-2.5">
        {/* Title + badge */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
              {item.nama}
            </h3>
            <KondisiBadge kondisi={item.kondisi} />
          </div>
          <p className="text-[0.75rem] text-[var(--text-secondary)] leading-relaxed
                        line-clamp-2">
            {item.deskripsi}
          </p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 flex-wrap">
          {[
            { icon: MapPin,  text: <>{item.lokasi} · <strong className="text-[var(--text-secondary)] font-semibold">{item.jarak}</strong></> },
            { icon: Clock,   text: item.waktu },
            { icon: Package, text: item.jumlah },
          ].map(({ icon: Icon, text }, i) => (
            <span key={i}
              className="inline-flex items-center gap-1 text-[0.6875rem] text-[var(--text-muted)]">
              <Icon size={12} strokeWidth={2} />
              {text}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3
                        pt-2 border-t border-[var(--border-subsub)]">
          {/* Pemilik */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700
                            text-[0.6875rem] font-bold flex items-center justify-center">
              {item.pemilik[0].toUpperCase()}
            </div>
            <span className="text-[0.75rem] text-[var(--text-secondary)] font-medium">
              {item.pemilik}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              className="w-[30px] h-[30px] flex items-center justify-center
                         bg-transparent border border-[var(--border-default)] rounded-lg
                         text-[var(--text-muted)] cursor-pointer
                         transition-all duration-150
                         hover:bg-[var(--bg-secondary-subtle)] hover:border-secondary-300 hover:text-secondary-600"
              aria-label="Simpan"
            >
              <Bookmark size={14} strokeWidth={1.75} />
            </button>

            <button
              onClick={() => onDetail?.(item)}
              className="hidden max-sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5
                         bg-transparent border border-[var(--border-default)] rounded-lg
                         text-[0.6875rem] font-medium font-[var(--font-body)]
                         text-[var(--text-secondary)] cursor-pointer
                         transition-all duration-150
                         hover:bg-[var(--bg-surface-3)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]
                         max-[580px]:hidden"
            >
              <MessageCircle size={14} strokeWidth={1.75} /> Hubungi
            </button>

            <button
              onClick={() => onDetail?.(item)}
              className="inline-flex items-center gap-1 px-3 py-1.5
                         bg-primary-900 text-white border-0 rounded-lg
                         text-[0.6875rem] font-medium font-[var(--font-body)]
                         cursor-pointer transition-colors duration-150
                         hover:bg-primary-700"
            >
              Detail <ChevronRight size={13} strokeWidth={2} />
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
      <div className="flex flex-col items-center gap-2 py-12 px-6 text-center
                      bg-white border border-[var(--border-subtle)] rounded-xl">
        <Package size={36} strokeWidth={1} className="text-[var(--border-strong)]" />
        <p className="text-[0.8125rem] font-semibold text-[var(--text-secondary)]">
          Tidak ada surplus ditemukan
        </p>
        <p className="text-[0.75rem] text-[var(--text-muted)]">
          Coba perluas radius atau ubah filter
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map(item => (
        <SurplusCard key={item.id} item={item} onDetail={onDetail} />
      ))}
    </div>
  )
}