import { useState, useMemo, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { APIProvider } from '@vis.gl/react-google-maps'

import SelamatkanTopbar       from '../components/SelamatkanTopbar'
import SelamatkanStatsBar     from '../components/SelamatkanStatsBar'
import SelamatkanToolbar      from '../components/SelamatkanToolbar'
import SelamatkanCardList     from '../components/SelamatkanCardList'
import SelamatkanMapPanel     from '../components/SelamatkanMapPanel'
import SelamatkanPostingModal from '../components/SelamatkanPostingModal'

import { SURPLUS_ITEMS } from '../selamatkanData'
import { hitungJarak, formatJarak } from '../../../utils/geoUtils'

const KONDISI_URGENCY = { segera: 0, 'mau-habis': 1, segar: 2 }
const GMAPS_API_KEY   = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''

export default function Selamatkan() {
  const [search,     setSearch]     = useState('')
  const [kategori,   setKategori]   = useState('Semua')
  const [radius,     setRadius]     = useState('5')
  const [sortBy,     setSortBy]     = useState('jarak')
  const [modal,      setModal]      = useState(false)
  const [userCoords, setUserCoords] = useState(null)
  const [locating,   setLocating]   = useState(false)

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      () => setLocating(false)
    )
  }, [])

  useEffect(() => { handleLocate() }, [handleLocate])

  const itemsWithJarak = useMemo(() => {
    return SURPLUS_ITEMS.map(item => {
      if (!userCoords || !item.lat || !item.lng) return { ...item, _jarakRaw: Infinity }
      const km = hitungJarak(userCoords.lat, userCoords.lng, item.lat, item.lng)
      return { ...item, jarak: formatJarak(km), _jarakRaw: km }
    })
  }, [userCoords])

  const filtered = useMemo(() => {
    const radiusKm = parseFloat(radius)
    return itemsWithJarak
      .filter(i => {
        const matchKat    = kategori === 'Semua' || i.kategori === kategori
        const matchQ      = i.nama.toLowerCase().includes(search.toLowerCase()) ||
                            i.deskripsi.toLowerCase().includes(search.toLowerCase())
        const matchRadius = !userCoords || i._jarakRaw <= radiusKm
        return matchKat && matchQ && matchRadius
      })
      .sort((a, b) => {
        if (sortBy === 'jarak')   return a._jarakRaw - b._jarakRaw
        if (sortBy === 'kondisi') return KONDISI_URGENCY[a.kondisi] - KONDISI_URGENCY[b.kondisi]
        return 0
      })
  }, [itemsWithJarak, search, kategori, radius, sortBy, userCoords])

  return (
    <APIProvider apiKey={GMAPS_API_KEY}>
      <SelamatkanTopbar totalAktif={SURPLUS_ITEMS.length} onPosting={() => setModal(true)} />

      {/* ↓ breakpoint notation diseragamkan ke explicit pixel, sama seperti LihatKulkas */}
      <div className="px-7 pt-6 pb-10 flex flex-col gap-5 max-[640px]:px-0 max-[640px]:pt-0 max-[640px]:pb-8 max-[640px]:gap-4">

        {/* ↓ mobile header: bg, radius, button, subtitle sekarang konsisten */}
        <div className="hidden items-center justify-between bg-primary-600 px-4 pb-5 pt-4 rounded-b-xl max-[640px]:flex">
          <div>
            <h1 className="text-xl font-bold text-white leading-snug">Selamatkan!</h1>
            <p className="mt-1 text-compact-xs text-white/35">
              {SURPLUS_ITEMS.length} surplus aktif di sekitarmu
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/15 text-white"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>

        <div className="max-[640px]:px-4"><SelamatkanStatsBar /></div>

        <div className="max-[640px]:px-4">
          <SelamatkanToolbar
            search={search}     onSearch={setSearch}
            kategori={kategori} onKategori={setKategori}
            radius={radius}     onRadius={setRadius}
            sortBy={sortBy}     onSort={setSortBy}
          />
        </div>

        {/* ↓ breakpoint diseragamkan: max-[1024px] dan max-[768px] */}
        <div className="grid gap-5 items-start grid-cols-[3fr_1fr] max-[1024px]:grid-cols-[2fr_1fr] max-[768px]:grid-cols-1 max-[640px]:px-4">
          <div className="min-w-0">
            <SelamatkanCardList items={filtered} />
          </div>
          <aside className="min-w-0 max-[640px]:hidden">
            <SelamatkanMapPanel
              items={filtered}
              radius={radius}
              userCoords={userCoords}
              onLocate={handleLocate}
              locating={locating}
            />
          </aside>
        </div>

      </div>

      {modal && <SelamatkanPostingModal onClose={() => setModal(false)} />}
    </APIProvider>
  )
}