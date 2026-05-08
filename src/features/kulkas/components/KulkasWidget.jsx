import { ArrowRight } from 'lucide-react'

const kondisiConfig = {
  'mau-exp': {
    className: 'bg-danger-100 text-danger-500',
  },
  'segar-2': {
    className: 'bg-secondary-100 text-secondary-600',
  },
  'segar-5': {
    className: 'bg-primary-100 text-primary-600',
  },
  'segar': {
    className: 'bg-primary-100 text-primary-600',
  },
}

export default function KulkasWidget({ items }) {
  return (
    <div className="w-full max-w-[420px] rounded-xl border border-neutral-50 bg-white p-6 shadow-sm max-md:p-4 max-[480px]:rounded-lg max-[480px]:p-3">
      <p className="mb-6 font-display text-[clamp(1.1rem,5.5vw,1.875rem)] font-bold text-neutral-900 max-md:mb-3 max-md:text-[0.95rem] max-[480px]:mb-2 max-[480px]:text-[0.85rem]">
        LihatKulkas
      </p>

      <ul className="flex flex-col">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex min-w-0 items-center justify-between gap-3 border-b border-neutral-100 py-4 last:border-b-0 max-md:gap-2 max-[480px]:py-2"
          >
            <span className="min-w-0 flex-1 truncate whitespace-nowrap text-[clamp(0.875rem,4vw,1rem)] text-neutral-900 max-md:text-[0.8rem] max-[480px]:text-[0.75rem]">
              {item.nama}
            </span>

            <span
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[clamp(0.7rem,3vw,0.8125rem)] font-semibold leading-[1.4] max-md:px-2 max-md:py-[2px] max-md:text-[0.65rem] max-[480px]:px-[6px] max-[480px]:text-[0.6rem] ${kondisiConfig[item.kondisi]?.className}`}
            >
              {item.exp}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-col gap-2 rounded-lg bg-primary-900 px-5 py-4 max-[480px]:mt-3 max-[480px]:gap-1 max-[480px]:px-3 max-[480px]:py-2">
        <span className="text-[clamp(0.7rem,3vw,0.8125rem)] leading-[1.4] text-white/60 max-md:text-[0.65rem] max-[480px]:text-[0.6rem]">
          Saran resep dari bahan diatas:
        </span>

        <div className="flex min-w-0 items-center justify-between gap-3">
          <span className="min-w-0 flex-1 truncate whitespace-nowrap text-[clamp(0.875rem,4vw,1rem)] font-semibold text-secondary-500 max-md:text-[0.8rem] max-[480px]:text-[0.75rem]">
            Sayur Bening Bayam Tahu
          </span>

          <ArrowRight
            size={18}
            className="shrink-0 text-secondary-500"
          />
        </div>
      </div>
    </div>
  )
}