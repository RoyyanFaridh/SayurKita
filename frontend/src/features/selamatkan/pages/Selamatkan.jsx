import { useState, useMemo, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { API_ORIGIN } from '../../../config/api'

import SelamatkanTopbar       from '../components/SelamatkanTopbar'
import SelamatkanStatsBar     from '../components/SelamatkanStatsBar'
import SelamatkanToolbar      from '../components/SelamatkanToolbar'
import SelamatkanCardList     from '../components/SelamatkanCardList'
import SelamatkanMapPanel     from '../components/SelamatkanMapPanel'
import SelamatkanPostingModal from '../components/SelamatkanPostingModal'
import SelamatkanDetailModal  from '../components/SelamatkanDetailModal'

import { hitungJarak, formatJarak } from '../../../utils/geoUtils'

const KONDISI_URGENCY = { segera: 0, 'mau-habis': 1, segar: 2 }

const isValidCoord  = (v) => Number.isFinite(Number(v))
const isValidLatLng = (lat, lng) => isValidCoord(lat) && isValidCoord(lng)

export default function Selamatkan() {
  const [surplusItems,    setSurplusItems]    = useState([])
  const [search,          setSearch]          = useState('')
  const [kategori,        setKategori]        = useState('Semua')
  const [radius,          setRadius]          = useState('5')
  const [sortBy,          setSortBy]          = useState('jarak')
  const [modal,           setModal]           = useState(false)
  const [detailModalItem, setDetailModalItem] = useState(null)
  const [userCoords,      setUserCoords]      = useState(null)
  const [locating,        setLocating]        = useState(false)
  const [loading,         setLoading]         = useState(true)
  const [currentUserId,   setCurrentUserId]   = useState(null)
  const [activeTab,       setActiveTab]       = useState('feed')
  const [stats,           setStats]           = useState({ active: 0, expiring: 0, savedThisMonth: 0 })

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        if (isValidLatLng(lat, lng)) setUserCoords({ lat, lng })
        setLocating(false)
      },
      () => setLocating(false)
    )
  }, [])

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const res  = await fetch(`${API_ORIGIN}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) setCurrentUserId(data.data.id)
    } catch (err) {
      console.error(err)
    }
  }, [])

  const fetchSurplus = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')

      let url      = `${API_ORIGIN}/api/surplus`
      let statsUrl = `${API_ORIGIN}/api/surplus/stats`

      if (activeTab === 'my-donations') {
        url = `${API_ORIGIN}/api/surplus/my-posts`
      } else {
        if (userCoords && isValidLatLng(userCoords.lat, userCoords.lng)) {
          url      += `?lat=${userCoords.lat}&lng=${userCoords.lng}&radius=${radius}`
          statsUrl += `?lat=${userCoords.lat}&lng=${userCoords.lng}&radius=${radius}`
          if (kategori && kategori !== 'Semua') {
            url += `&category=${encodeURIComponent(kategori)}`
          }
        } else if (kategori && kategori !== 'Semua') {
          url += `?category=${encodeURIComponent(kategori)}`
        }
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      if (activeTab === 'feed') {
        const statsResponse = await fetch(statsUrl, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const statsData = await statsResponse.json()
        if (statsData.success) setStats(statsData.data)
      }

      if (data.success) {
        const mappedData = data.data.map(item => ({
          id:               item.id,
          nama:             item.title,
          deskripsi:        item.description,
          kategori:         item.category,
          jumlah:           item.quantity,
          kondisi:          item.pickupTime === 'Hari ini!'
                              ? 'segera'
                              : item.pickupTime === 'Segera ambil'
                              ? 'mau-habis'
                              : 'segar',
          lat:              item.latitude  != null ? parseFloat(item.latitude)  : null,
          lng:              item.longitude != null ? parseFloat(item.longitude) : null,
          lokasi:           item.address,
          pemilik:          item.user?.name || 'User',
          receiver:         item.receiver || null,
          imageUrl:         item.imageUrl ? `${API_ORIGIN}${item.imageUrl}` : null,
          status:           item.status,
          userId:           item.userId,
          receiverId:       item.receiverId,
          claimedAt:        item.claimedAt,
          expiredReceivers: item.expiredReceivers || [],
        }))
        setSurplusItems(mappedData)
      }
    } catch (err) {
      console.error('Gagal fetch data surplus:', err)
    } finally {
      setLoading(false)
    }
  }, [userCoords, radius, kategori, activeTab])

  useEffect(() => { handleLocate() }, [handleLocate])
  useEffect(() => { fetchUser()    }, [fetchUser])
  useEffect(() => {
    if (currentUserId) fetchSurplus()
  }, [fetchSurplus, currentUserId])

  const itemsWithJarak = useMemo(() => {
    return surplusItems.map(item => {
      if (
        !userCoords ||
        !isValidLatLng(item.lat, item.lng) ||
        !isValidLatLng(userCoords.lat, userCoords.lng)
      ) {
        return { ...item, _jarakRaw: Infinity }
      }
      const km = hitungJarak(userCoords.lat, userCoords.lng, item.lat, item.lng)
      return { ...item, jarak: formatJarak(km), _jarakRaw: km }
    })
  }, [surplusItems, userCoords])

  const filtered = useMemo(() => {
    const radiusKm = parseFloat(radius)
    return itemsWithJarak
      .filter(i => {
        if (activeTab === 'my-donations') return true
        if (i.expiredReceivers?.includes(String(currentUserId))) return false
        const matchKat    = kategori === 'Semua' || i.kategori === kategori
        const matchQ      = i.nama.toLowerCase().includes(search.toLowerCase()) ||
                            i.deskripsi.toLowerCase().includes(search.toLowerCase())
        const matchRadius = !userCoords || i._jarakRaw <= radiusKm
        return matchKat && matchQ && matchRadius
      })
      .sort((a, b) => {
        if (activeTab === 'my-donations') return 0
        if (sortBy === 'jarak')   return a._jarakRaw - b._jarakRaw
        if (sortBy === 'kondisi') return KONDISI_URGENCY[a.kondisi] - KONDISI_URGENCY[b.kondisi]
        return 0
      })
  }, [itemsWithJarak, search, kategori, radius, sortBy, userCoords, activeTab, currentUserId])

  return (
    <>
      <SelamatkanTopbar totalAktif={surplusItems.length} onPosting={() => setModal(true)} />

      <div className="px-7 pt-6 pb-10 flex flex-col gap-5 max-[640px]:px-0 max-[640px]:pt-0 max-[640px]:pb-8 max-[640px]:gap-4">

        <div className="hidden items-center justify-between bg-primary-600 px-4 pb-5 pt-4 rounded-b-xl max-[640px]:flex">
          <div>
            <h1 className="text-xl font-bold text-white leading-snug">Selamatkan!</h1>
            <p className="mt-1 text-compact-xs text-white/35">
              {surplusItems.length} surplus aktif di sekitarmu
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/15 text-white"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>

        <div className="max-[640px]:px-4">
          <SelamatkanStatsBar stats={{ ...stats, radius }} />
        </div>

        <div className="max-[640px]:px-4">
          <div className="flex bg-gray-100/80 p-1 rounded-xl w-max">
            {[
              { key: 'feed',         label: 'Cari Makanan' },
              { key: 'my-donations', label: 'Donasi Saya'  },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === key
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'feed' && (
          <div className="max-[640px]:px-4">
            <SelamatkanToolbar
              search={search}     onSearch={setSearch}
              kategori={kategori} onKategori={setKategori}
              radius={radius}     onRadius={setRadius}
              sortBy={sortBy}     onSort={setSortBy}
            />
          </div>
        )}

        {activeTab === 'feed' && (
          <div className="hidden max-[640px]:block max-[640px]:px-4">
            <div className="h-48 rounded-xl overflow-hidden">
              <SelamatkanMapPanel
                items={filtered}
                radius={radius}
                userCoords={userCoords}
                onLocate={handleLocate}
                locating={locating}
              />
            </div>
          </div>
        )}

        <div className="grid gap-5 items-start grid-cols-[3fr_1fr] max-[1024px]:grid-cols-[2fr_1fr] max-[768px]:grid-cols-1 max-[640px]:px-4">
          <div className="min-w-0">
            <SelamatkanCardList
              items={filtered}
              currentUserId={currentUserId}
              onRefresh={fetchSurplus}
              activeTab={activeTab}
              loading={loading}
              onDetail={setDetailModalItem}
            />
          </div>
          {activeTab === 'feed' && (
            <aside className="min-w-0 max-[640px]:hidden">
              <SelamatkanMapPanel
                items={filtered}
                radius={radius}
                userCoords={userCoords}
                onLocate={handleLocate}
                locating={locating}
              />
            </aside>
          )}
        </div>
      </div>

      {modal && (
        <SelamatkanPostingModal
          onClose={() => setModal(false)}
          onSuccess={fetchSurplus}
        />
      )}

      {detailModalItem && (
        <SelamatkanDetailModal
          item={detailModalItem}
          onClose={() => setDetailModalItem(null)}
          currentUserId={currentUserId}
          activeTab={activeTab}
          onAction={async (action) => {
            try {
              const token = localStorage.getItem('token')
              const res   = await fetch(
                `${API_ORIGIN}/api/surplus/${detailModalItem.id}/${action}`,
                {
                  method:  'PATCH',
                  headers: { Authorization: `Bearer ${token}` },
                }
              )
              const data = await res.json()
              if (data.success) {
                alert(data.message)
                fetchSurplus()
              } else {
                alert(data.message || 'Terjadi kesalahan')
              }
            } catch (err) {
              console.error(err)
              alert('Gagal memproses permintaan')
            }
          }}
          onOpenChat={() => {
            alert('Silakan tekan tombol Chat pada kartu makanan di daftar depan.')
          }}
        />
      )}
    </>
  )
}