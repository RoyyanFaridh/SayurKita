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

      <div className="px-7 pt-6 pb-10 flex flex-col gap-5 max-md:px-0 max-md:pt-0 max-md:gap-4">

        <div className="hidden max-sm:flex items-center justify-between bg-(--bg-dark) px-4 pt-4 pb-5 rounded-b-2xl">
          <div>
            <h1 className="text-xl font-bold text-white leading-snug">Selamatkan!</h1>
            <p className="text-(--text-compact-xs) text-white/35 mt-0.5">
              {SURPLUS_ITEMS.length} surplus aktif di sekitarmu
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="w-9 h-9 flex items-center justify-center bg-secondary-500 text-primary-900 rounded-lg border-0 cursor-pointer"
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

        <div className="grid gap-5 items-start grid-cols-[3fr_1fr] max-lg:grid-cols-[2fr_1fr] max-md:grid-cols-1 max-sm:px-4">
          <div className="min-w-0">
            <SelamatkanCardList items={filtered} />
          </div>
          <aside className="min-w-0 max-sm:hidden">
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