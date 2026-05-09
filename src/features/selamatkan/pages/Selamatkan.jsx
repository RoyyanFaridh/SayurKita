import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'

import SelamatkanTopbar       from '../components/SelamatkanTopbar'
import SelamatkanStatsBar     from '../components/SelamatkanStatsBar'
import SelamatkanToolbar      from '../components/SelamatkanToolbar'
import SelamatkanCardList     from '../components/SelamatkanCardList'
import SelamatkanMapPanel     from '../components/SelamatkanMapPanel'
import SelamatkanPostingModal from '../components/SelamatkanPostingModal'

import { SURPLUS_ITEMS } from '../selamatkanData'

const KONDISI_URGENCY = { segera: 0, 'mau-habis': 1, segar: 2 }

export default function Selamatkan() {
  const [search,   setSearch]   = useState('')
  const [kategori, setKategori] = useState('Semua')
  const [radius,   setRadius]   = useState('5')
  const [sortBy,   setSortBy]   = useState('waktu')
  const [modal,    setModal]    = useState(false)

  const filtered = useMemo(() => {
    return SURPLUS_ITEMS
      .filter(i => {
        const matchKat = kategori === 'Semua' || i.kategori === kategori
        const matchQ   = i.nama.toLowerCase().includes(search.toLowerCase()) ||
                         i.deskripsi.toLowerCase().includes(search.toLowerCase())
        return matchKat && matchQ
      })
      .sort((a, b) => {
        if (sortBy === 'jarak')   return parseFloat(a.jarak) - parseFloat(b.jarak)
        if (sortBy === 'kondisi') return KONDISI_URGENCY[a.kondisi] - KONDISI_URGENCY[b.kondisi]
        return 0
      })
  }, [search, kategori, sortBy])

  return (
    <>
      <SelamatkanTopbar totalAktif={SURPLUS_ITEMS.length} onPosting={() => setModal(true)} />

      <div className="px-7 pt-6 pb-10 flex flex-col gap-5 max-md:px-0 max-md:pt-0 max-md:gap-4">

        {/* Mobile heading */}
        <div className="hidden max-sm:flex items-center justify-between
                        bg-(--bg-dark) px-4 pt-4 pb-5 rounded-b-2xl">
          <div>
            <h1 className="text-xl font-bold text-white leading-snug">Selamatkan!</h1>
            <p className="text-compact-xs text-white/35 mt-0.5">
              {SURPLUS_ITEMS.length} surplus aktif di sekitarmu
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="w-9 h-9 flex items-center justify-center
                       bg-secondary-500 text-primary-900 rounded-lg
                       border-0 cursor-pointer"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>

        <div className="max-sm:px-4"><SelamatkanStatsBar /></div>

        <div className="max-sm:px-4">
          <SelamatkanToolbar
            search={search}     onSearch={setSearch}
            kategori={kategori} onKategori={setKategori}
            radius={radius}     onRadius={setRadius}
            sortBy={sortBy}     onSort={setSortBy}
          />
        </div>

        {/* 3/4 list + 1/4 map */}
        <div className="grid gap-5 items-start
                        grid-cols-[3fr_1fr]
                        max-lg:grid-cols-[2fr_1fr]
                        max-md:grid-cols-1
                        max-sm:px-4">
          <div className="min-w-0">
            <SelamatkanCardList items={filtered} />
          </div>
          <aside className="min-w-0 max-sm:hidden">
            <SelamatkanMapPanel items={filtered} radius={radius} />
          </aside>
        </div>

      </div>

      {modal && <SelamatkanPostingModal onClose={() => setModal(false)} />}
    </>
  )
}