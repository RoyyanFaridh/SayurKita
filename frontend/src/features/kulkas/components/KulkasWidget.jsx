import { ArrowRight } from 'lucide-react'

// Key diselaraskan dengan sistem kondisi yang ada di komponen fungsional
const kondisiConfig = {
  'mau-exp': { className: 'bg-danger-100 text-danger-600'     },
  'segar-2': { className: 'bg-secondary-100 text-secondary-700' },
  'segar-5': { className: 'bg-primary-100 text-primary-700'   },
  'segar':   { className: 'bg-primary-100 text-primary-700'   },
}

export default function KulkasWidget({ items }) {
  return (
    <div
      className="w-full max-w-full rounded-xl border p-6 max-md:p-4 max-[480px]:p-3"
      style={{
        background:   'var(--bg-surface-1)',
        borderColor:  'var(--border-subtle)',
        boxShadow:    'var(--shadow-sm)',
      }}
    >
      {/* Title */}
      <p
        className="m-0 mb-4 font-bold text-neutral-900 max-md:mb-3"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize:   'clamp(1rem, 5.5vw, 1.875rem)',
        }}
      >
        LihatKulkas
      </p>

      {/* Item list */}
      <ul className="flex flex-col m-0 p-0 list-none">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex min-w-0 items-center justify-between gap-3 py-3 max-md:gap-2 max-[480px]:py-2"
            style={{
              borderBottom: i < items.length - 1
                ? '1px solid var(--border-subtle)'
                : 'none',
            }}
          >
            <span
              className="min-w-0 flex-1 truncate whitespace-nowrap text-neutral-900 max-md:text-[0.8rem] max-[480px]:text-compact-base"
              style={{ fontSize: 'clamp(0.8125rem, 4vw, 1rem)' }}
            >
              {item.nama}
            </span>

            <span
              className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 font-semibold max-md:px-2 max-md:py-px max-[480px]:px-1.5 ${kondisiConfig[item.kondisi]?.className ?? 'bg-neutral-100 text-neutral-500'}`}
              style={{ fontSize: 'clamp(0.6875rem, 3vw, 0.8125rem)' }}
            >
              {item.exp}
            </span>
          </li>
        ))}
      </ul>

      {/* Resep suggestion */}
      <div
        className="mt-4 flex flex-col gap-2 rounded-lg px-5 py-4 max-[480px]:mt-3 max-[480px]:gap-1 max-[480px]:px-3 max-[480px]:py-2"
        style={{ background: 'var(--color-primary-900)' }}
      >
        <span
          className="leading-snug"
          style={{
            fontSize: 'clamp(0.6875rem, 3vw, 0.8125rem)',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          Saran resep dari bahan diatas:
        </span>

        <div className="flex min-w-0 items-center justify-between gap-3">
          <span
            className="min-w-0 flex-1 truncate whitespace-nowrap font-semibold max-md:text-[0.8rem] max-[480px]:text-compact-base"
            style={{
              fontSize: 'clamp(0.8125rem, 4vw, 1rem)',
              color: 'var(--color-secondary-500)',
            }}
          >
            Sayur Bening Bayam Tahu
          </span>

          <ArrowRight size={16} className="shrink-0" style={{ color: 'var(--color-secondary-500)' }} />
        </div>
      </div>
    </div>
  )
}