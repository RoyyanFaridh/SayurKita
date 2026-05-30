import { useState, useEffect, useRef } from 'react'
import { MapPin, Package, MessageCircle, CheckCircle2, CheckSquare, Clock, Leaf, Wind } from 'lucide-react'
import { io } from 'socket.io-client'
import { KONDISI_MAP } from '../selamatkanData'
import { API_ORIGIN } from '../../../config/api'
import SelamatkanChatOverlay from './SelamatkanChatOverlay'

// ── Token-based badge styles ──────────────────────────────────────────────────
const KONDISI_BADGE = {
  success: { background: 'var(--bg-success-subtle)', color: 'var(--text-success)'  },
  warning: { background: 'var(--bg-warning-subtle)', color: 'var(--text-warning)'  },
  danger:  { background: 'var(--bg-danger-subtle)',  color: 'var(--text-danger)'   },
}

const STATUS_BADGE = {
  Diklaim:      { background: 'var(--bg-subtle)',           color: 'var(--text-secondary)' },
  Dikonfirmasi: { background: 'var(--bg-success-subtle)',   color: 'var(--text-success)'   },
  Selesai:      { background: 'var(--bg-subtle)',           color: 'var(--text-muted)'     },
}

// ── Carbon calculator ─────────────────────────────────────────────────────────
const CARBON_FACTOR_GRAM = {
  'Makanan Matang': 400,
  'Sayuran':        200,
  'Sayur':          200,
  'Lauk':           350,
  'Buah':           150,
  'Lainnya':        250,
}

function hitungCarbonOffset(category, quantity) {
  const factorGram = CARBON_FACTOR_GRAM[category] || 250
  const match      = String(quantity).match(/([\d,.]+)/)
  const jumlahUnit = match ? parseFloat(match[1].replace(',', '.')) : 1
  return Math.round(factorGram * jumlahUnit)
}

// ── Sub-components ────────────────────────────────────────────────────────────
function KondisiBadge({ kondisi, status }) {
  if (status && status !== 'Tersedia') {
    const style = STATUS_BADGE[status] ?? STATUS_BADGE['Selesai']
    return (
      <span
        className="inline-block px-2 py-0.5 rounded-full text-compact-xs font-semibold whitespace-nowrap shrink-0"
        style={style}
      >
        {status}
      </span>
    )
  }
  const { label, color } = KONDISI_MAP[kondisi] ?? { label: kondisi, color: 'success' }
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-compact-xs font-medium whitespace-nowrap shrink-0"
      style={KONDISI_BADGE[color]}
    >
      {label}
    </span>
  )
}

function FotoPlaceholder({ nama, imageUrl }) {
  if (imageUrl) {
    return (
      <div className="w-12 h-12 rounded-xl shrink-0 overflow-hidden"
        style={{ background: 'var(--bg-subtle)' }}>
        <img src={imageUrl} alt={nama} className="w-full h-full object-cover" />
      </div>
    )
  }
  const initials = nama.split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join('')
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: 'var(--bg-subtle)', color: 'var(--text-brand)' }}>
      <span className="text-compact-sm font-bold">{initials}</span>
    </div>
  )
}

function CountdownTimer({ claimedAt }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!claimedAt) return
    const interval = setInterval(() => {
      const endTime  = new Date(claimedAt).getTime() + 60 * 60 * 1000
      const distance = endTime - Date.now()
      if (distance < 0) { setTimeLeft('Expired'); clearInterval(interval); return }
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((distance % (1000 * 60)) / 1000)
      setTimeLeft(`${m}m ${s}s`)
    }, 1000)
    return () => clearInterval(interval)
  }, [claimedAt])

  if (!timeLeft) return null

  return (
    <span
      className="inline-flex items-center gap-1 text-compact-xs font-semibold px-2 py-0.5 rounded-md"
      style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
    >
      <Clock size={12} /> {timeLeft}
    </span>
  )
}

// Action button styles — konsisten dengan tombol di halaman lain
const btnPrimary = "inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-compact-xs font-medium cursor-pointer transition-colors duration-fast border-0 bg-primary-600 text-white hover:bg-primary-700"
const btnSubtle  = "inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-compact-xs font-medium cursor-pointer transition-colors duration-fast border-[0.5px]"

function SurplusCard({ item, onDetail, currentUserId, onRefresh, activeTab }) {
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    if (item.status === 'Tersedia' && showChat) setShowChat(false)
  }, [item.status, showChat])

  const handleAction = async (action) => {
    try {
      const token = localStorage.getItem('token')
      const res   = await fetch(`${API_ORIGIN}/api/surplus/${item.id}/${action}`, {
        method:  'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        alert(data.message)
        onRefresh?.()
      } else {
        alert(data.message || 'Terjadi kesalahan')
      }
    } catch {
      alert('Gagal memproses permintaan')
    }
  }

  const isOwner      = String(currentUserId) === String(item.userId)
  const isReceiver   = String(currentUserId) === String(item.receiverId)
  const hasExpired   = item.expiredReceivers?.includes(String(currentUserId))
  const estimasiCarbon = hitungCarbonOffset(item.kategori, item.jumlah)

  return (
    <div
      className="flex items-start gap-3 rounded-xl p-4 border-[0.5px] transition-shadow duration-fast max-[580px]:flex-col max-[580px]:gap-2"
      style={{
        background:  'var(--bg-surface-1)',
        borderColor: 'var(--border-subtle)',
        boxShadow:   'var(--shadow-xs)',
      }}
    >
      <FotoPlaceholder nama={item.nama} imageUrl={item.imageUrl} />

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">

        {/* Title + badge */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h3 className="text-compact-base font-semibold leading-snug m-0"
            style={{ color: 'var(--text-primary)' }}>
            {item.nama}
          </h3>
          <div className="flex gap-1.5 items-center">
            {item.status === 'Diklaim' && <CountdownTimer claimedAt={item.claimedAt} />}
            <KondisiBadge kondisi={item.kondisi} status={item.status} />
          </div>
        </div>

        {/* Deskripsi */}
        <p className="text-compact-sm leading-relaxed line-clamp-2 m-0"
          style={{ color: 'var(--text-secondary)' }}>
          {item.deskripsi}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-3 flex-wrap">
          {[
            {
              icon: MapPin,
              text: <>{item.lokasi} · <strong className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{item.jarak}</strong></>
            },
            { icon: Package, text: item.jumlah },
            {
              icon: Leaf,
              text: <span style={{ color: 'var(--text-success)', fontWeight: 500 }}>-{estimasiCarbon}g CO₂</span>
            },
          ].map(({ icon: Icon, text }, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-compact-xs"
              style={{ color: 'var(--text-muted)' }}>
              <Icon size={12} strokeWidth={2} />{text}
            </span>
          ))}
        </div>

        {/* Footer: avatar + actions */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t-[0.5px] flex-wrap"
          style={{ borderColor: 'var(--border-subtle)' }}>

          {/* Avatar pemilik */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-compact-xs font-bold"
              style={{ background: 'var(--bg-success-subtle)', color: 'var(--text-success)' }}>
              {item.pemilik[0].toUpperCase()}
            </div>
            <span className="text-compact-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {item.pemilik}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {activeTab === 'feed' ? (
              <>
                {item.status === 'Tersedia' && !isOwner && !hasExpired && (
                  <button onClick={() => handleAction('claim')} className={btnPrimary}>
                    Klaim Makanan
                  </button>
                )}
                {item.status === 'Tersedia' && !isOwner && hasExpired && (
                  <span className={btnSubtle}
                    style={{ background: 'var(--bg-danger-subtle)', borderColor: 'var(--border-subtle)', color: 'var(--text-danger)' }}>
                    Batas waktu habis
                  </span>
                )}
                {item.status === 'Dikonfirmasi' && !isOwner && isReceiver && (
                  <span className={btnSubtle}
                    style={{ background: 'var(--bg-success-subtle)', borderColor: 'var(--border-subtle)', color: 'var(--text-success)' }}>
                    Menunggu pendonor
                  </span>
                )}
              </>
            ) : (
              <>
                {item.status === 'Tersedia' && (
                  <span className={btnSubtle}
                    style={{ background: 'var(--bg-warning-subtle)', borderColor: 'var(--border-subtle)', color: 'var(--text-warning)' }}>
                    <Clock size={12} /> Menunggu Pengklaim
                  </span>
                )}
                {item.status === 'Diklaim' && (
                  <div className="flex items-center gap-1.5">
                    <span className={btnSubtle}
                      style={{ background: 'var(--bg-success-subtle)', borderColor: 'var(--border-subtle)', color: 'var(--text-success)' }}>
                      {item.receiver?.name || 'Seseorang'}
                    </span>
                    <button onClick={() => handleAction('confirm')} className={btnPrimary}>
                      <CheckSquare size={13} /> Konfirmasi
                    </button>
                  </div>
                )}
                {item.status === 'Dikonfirmasi' && (
                  <button onClick={() => handleAction('complete')} className={btnPrimary}>
                    <CheckCircle2 size={13} /> Selesai (+10 Poin)
                  </button>
                )}
                {item.status === 'Selesai' && (
                  <span className={btnSubtle}
                    style={{ background: 'var(--bg-success-subtle)', borderColor: 'var(--border-subtle)', color: 'var(--text-success)' }}>
                    <CheckCircle2 size={13} /> Donasi Berhasil (+10 Poin)
                  </span>
                )}
              </>
            )}

            {(item.status === 'Diklaim' || item.status === 'Dikonfirmasi') && (isOwner || isReceiver) && (
              <button
                onClick={() => setShowChat(true)}
                className={btnSubtle}
                style={{ background: 'var(--bg-success-subtle)', borderColor: 'var(--border-subtle)', color: 'var(--text-success)' }}
              >
                <MessageCircle size={13} strokeWidth={2} />
                Chat {isOwner ? 'Klaimer' : 'Pendonor'}
              </button>
            )}

            <button
              onClick={() => onDetail?.(item)}
              className={`${btnSubtle} max-[580px]:hidden`}
              style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              Detail
            </button>
          </div>
        </div>
      </div>

      {showChat && (
        <SelamatkanChatOverlay
          item={item}
          currentUserId={currentUserId}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  )
}

// ── List wrapper ──────────────────────────────────────────────────────────────
export default function SelamatkanCardList({ items, onDetail, currentUserId, onRefresh, activeTab, loading }) {
  const onRefreshRef = useRef(onRefresh)

  useEffect(() => { onRefreshRef.current = onRefresh }, [onRefresh])

  useEffect(() => {
    const socket = io(API_ORIGIN)
    socket.on('statusUpdated', () => onRefreshRef.current?.())
    socket.on('newSurplus',    () => onRefreshRef.current?.())
    return () => socket.disconnect()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map(n => (
          <div key={n} className="h-36 w-full rounded-xl animate-pulse border-[0.5px]"
            style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-subtle)' }} />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center rounded-xl border-[0.5px]"
        style={{
          background:  'var(--bg-surface-1)',
          borderColor: 'var(--border-subtle)',
          boxShadow:   'var(--shadow-xs)',
        }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-1"
          style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
          <Wind size={22} strokeWidth={1.5} />
        </div>
        <p className="text-compact-base font-medium m-0" style={{ color: 'var(--text-secondary)' }}>
          Belum ada makanan surplus di sekitarmu
        </p>
        <p className="text-compact-sm m-0" style={{ color: 'var(--text-muted)' }}>
          Coba perluas radius pencarian atau ubah filter kategori.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map(item => (
        <SurplusCard
          key={item.id}
          item={item}
          onDetail={onDetail}
          currentUserId={currentUserId}
          onRefresh={onRefresh}
          activeTab={activeTab}
        />
      ))}
    </div>
  )
}