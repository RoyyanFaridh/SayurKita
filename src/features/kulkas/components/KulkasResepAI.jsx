import { ArrowRight, Sparkles } from 'lucide-react'

const RESEP = [
  {
    id: 1,
    nama: 'Sayur Lodeh Bayam Tahu Tempe',
    bahan: ['Bayam segar', 'Tahu putih', 'Tempe'],
    waktu: '30 mnt',
    featured: true,
  },
  {
    id: 2,
    nama: 'Sayur Bening Bayam Tahu',
    bahan: ['Bayam segar', 'Tahu putih'],
    waktu: '20 mnt',
    featured: false,
  },
  {
    id: 3,
    nama: 'Tumis Toge Tahu',
    bahan: ['Toge', 'Tahu putih', 'Cabai merah'],
    waktu: '15 mnt',
    featured: false,
  },
]

export default function KulkasResepAI() {
  return (
    <div className="overflow-hidden rounded-md border border-neutral-100 bg-white p-4 shadow-xs">
      <div className="mb-3 flex items-start justify-between gap-3 border-b border-neutral-100 pb-2">
        <div className="flex items-start gap-2.5">
          <div className="mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-secondary-50 text-secondary-600">
            <Sparkles size={14} strokeWidth={2} />
          </div>

          <div>
            <h2 className="text-compact-lg font-semibold leading-snug text-neutral-900">
              Rekomendasi Resep AI
            </h2>

            <p className="mt-0.5 text-compact-sm text-neutral-400">
              Saran dari bahan yang akan kadaluwarsa
            </p>
          </div>
        </div>

        <button className="inline-flex whitespace-nowrap font-body items-center gap-1 bg-transparent text-compact-base font-medium text-primary-600 transition-colors duration-fast ease-out hover:text-primary-100">
          Lihat semua
          <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      <ul className="flex flex-col gap-1">
        {RESEP.map(r => (
          <li
            key={r.id}
            className={`relative flex cursor-pointer items-center justify-between gap-2.5 rounded-md px-3 py-2.5 transition-colors duration-fast ease-out hover:bg-primary-50 ${
              r.featured ? 'bg-primary-50 before:absolute before:bottom-[6px] before:left-0 before:top-[6px] before:w-0.75 before:rounded-full before:bg-secondary-500' : ''
            }`}
          >
            <div className="min-w-0 flex-1">
              <p
                className={`text-compact-lg text-neutral-900 ${
                  r.featured ? 'font-bold' : 'font-medium'
                }`}
              >
                {r.nama}
              </p>

              <p className="mt-0.5 text-compact-sm text-neutral-600">
                {r.bahan.join(' · ')} · {r.waktu}
              </p>
            </div>

            <span
              className={`shrink-0 transition-transform duration-fast ease-out group-hover:translate-x-0.5 ${
                r.featured ? 'text-primary-600' : 'text-neutral-400'
              }`}
            >
              <ArrowRight size={15} strokeWidth={2} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}