import { useState, useEffect, useRef } from 'react'
import { MapPin, Package, MessageCircle, CheckCircle2, CheckSquare, Clock, Leaf } from 'lucide-react'
import { io } from 'socket.io-client'
import { KONDISI_MAP } from '../selamatkanData'
import { API_ORIGIN } from '../../../config/api'
import SelamatkanChatOverlay from './SelamatkanChatOverlay'

const BADGE_CLS = {
  success: 'bg-(--bg-success-subtle) text-(--text-success)',
  warning: 'bg-(--bg-warning-subtle) text-(--text-warning)',
  danger:  'bg-(--bg-danger-subtle)  text-(--text-danger)',
}

// ─── Kalkulator Jejak Karbon Sama Seperti Backend ──────────────
const CARBON_FACTOR_GRAM = {
  "Makanan Matang": 400,
  "Sayuran":        200,
  "Sayur":          200,
  "Lauk":           350,
  "Buah":           150,
  "Lainnya":        250,
};

function hitungCarbonOffset(category, quantity) {
  const factorGram = CARBON_FACTOR_GRAM[category] || 250;
  const match = String(quantity).match(/([\d,.]+)/);
  const jumlahUnit = match ? parseFloat(match[1].replace(",", ".")) : 1;
  return Math.round(factorGram * jumlahUnit);
}

function KondisiBadge({ kondisi, status }) {
  if (status && status !== 'Tersedia') {
    let statusCls = 'bg-(--bg-secondary-subtle) text-secondary-600';
    if (status === 'Diklaim') statusCls = 'bg-blue-50 text-blue-600';
    if (status === 'Dikonfirmasi') statusCls = 'bg-indigo-50 text-indigo-600';
    if (status === 'Selesai') statusCls = 'bg-gray-100 text-gray-500';
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-compact-sm font-bold whitespace-nowrap shrink-0 ${statusCls}`}>
        {status}
      </span>
    )
  }

  const { label, color } = KONDISI_MAP[kondisi] ?? { label: kondisi, color: 'success' }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-compact-sm font-medium whitespace-nowrap shrink-0 ${BADGE_CLS[color]}`}>
      {label}
    </span>
  )
}

function FotoPlaceholder({ nama, imageUrl }) {
  if (imageUrl) {
    return (
      <div className="w-12 h-12 rounded-xl shrink-0 overflow-hidden bg-(--bg-subtle)">
        <img src={imageUrl} alt={nama} className="w-full h-full object-cover" />
      </div>
    )
  }
  const initials = nama.split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join('')
  return (
    <div className="w-12 h-12 rounded-xl bg-(--bg-subtle) flex items-center justify-center shrink-0">
      <span className="text-sm font-bold text-(--text-brand)">{initials}</span>
    </div>
  )
}

// ─── Komponen Timer 1 Jam ──────────────
function CountdownTimer({ claimedAt }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!claimedAt) return;

    const interval = setInterval(() => {
      // Waktu 1 jam dari saat diklaim
      const endTime = new Date(claimedAt).getTime() + (60 * 60 * 1000); 
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        setTimeLeft('Expired');
        clearInterval(interval);
        return;
      }

      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [claimedAt]);

  if (!timeLeft) return null;

  return (
    <span className="inline-flex items-center gap-1 text-compact-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
      <Clock size={12} /> {timeLeft}
    </span>
  );
}

function SurplusCard({ item, onDetail, currentUserId, onRefresh, activeTab }) {
  const [showChat, setShowChat] = useState(false)

  // Tutup overlay chat secara otomatis jika postingan direvert / statusnya berubah jadi Tersedia (misal akibat expired timer)
  useEffect(() => {
    if (item.status === 'Tersedia' && showChat) {
      setShowChat(false);
    }
  }, [item.status, showChat]);

  const handleAction = async (action) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ORIGIN}/api/surplus/${item.id}/${action}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        if (onRefresh) onRefresh();
      } else {
        alert(data.message || 'Terjadi kesalahan');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal memproses permintaan');
    }
  }

  const isOwner = String(currentUserId) === String(item.userId);
  const isReceiver = String(currentUserId) === String(item.receiverId);
  const hasExpired = item.expiredReceivers?.includes(String(currentUserId));
  const estimasiCarbon = hitungCarbonOffset(item.kategori, item.jumlah);

  return (
    <div
      className="flex items-start gap-3 rounded-2xl p-3 border transition-[box-shadow,border-color] duration-150 max-[580px]:flex-col max-[580px]:gap-2"
      style={{
        background:   'var(--bg-surface-1)',
        borderColor:  'var(--border-subtle)',
        boxShadow:    'var(--shadow-xs)',
      }}
    >
      <FotoPlaceholder nama={item.nama} imageUrl={item.imageUrl} />

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">

        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h3 className="text-compact-base font-semibold text-(--text-primary) leading-snug">{item.nama}</h3>
          <div className="flex gap-2 items-center">
            {item.status === 'Diklaim' && <CountdownTimer claimedAt={item.claimedAt} />}
            <KondisiBadge kondisi={item.kondisi} status={item.status} />
          </div>
        </div>

        <p className="text-compact-sm text-(--text-secondary) leading-relaxed line-clamp-2">{item.deskripsi}</p>

        <div className="flex items-center gap-3 flex-wrap">
          {[
            { icon: MapPin,  text: <>{item.lokasi} · <strong className="text-(--text-secondary) font-semibold">{item.jarak}</strong></> },
            { icon: Package, text: item.jumlah },
            { icon: Leaf, text: <span className="text-green-600 font-medium">-{estimasiCarbon}g CO₂</span> }
          ].map(({ icon: Icon, text }, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-compact-xs text-(--text-muted)">
              <Icon size={12} strokeWidth={2} />{text}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-(--border-subsub)">

          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-compact-xs font-bold flex items-center justify-center shrink-0">
              {item.pemilik[0].toUpperCase()}
            </div>
            <span className="text-compact-sm text-(--text-secondary) font-medium">{item.pemilik}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {activeTab === 'feed' ? (
              <>
                {item.status === 'Tersedia' && !isOwner && !hasExpired && (
                  <button
                    onClick={() => handleAction('claim')}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600 text-white border-0 rounded-lg text-compact-xs font-medium cursor-pointer transition-colors duration-150 hover:bg-primary-700"
                  >
                    Klaim Makanan
                  </button>
                )}

                {item.status === 'Tersedia' && !isOwner && hasExpired && (
                  <span className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 border-0 rounded-lg text-compact-xs font-medium border-red-200">
                    Batas waktu klaim Anda habis
                  </span>
                )}
                
                {item.status === 'Dikonfirmasi' && !isOwner && isReceiver && (
                  <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 border-0 rounded-lg text-compact-xs font-medium border-green-200">
                    Menunggu diselesaikan pendonor
                  </span>
                )}
              </>
            ) : (
              <>
                {item.status === 'Tersedia' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 border-0 rounded-lg text-compact-xs font-medium border-orange-200">
                    <Clock size={12} /> Menunggu Pengklaim
                  </span>
                )}

                {item.status === 'Diklaim' && (
                  <div className="flex items-center gap-2">
                    <span className="text-compact-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                      Diklaim oleh {item.receiver?.name || 'Seseorang'}
                    </span>
                    <button
                      onClick={() => handleAction('confirm')}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500 text-white border-0 rounded-lg text-compact-xs font-medium cursor-pointer transition-colors duration-150 hover:bg-indigo-600"
                    >
                      <CheckSquare size={13} /> Konfirmasi Diambil
                    </button>
                  </div>
                )}

                {item.status === 'Dikonfirmasi' && (
                  <button
                    onClick={() => handleAction('complete')}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white border-0 rounded-lg text-compact-xs font-medium cursor-pointer transition-colors duration-150 hover:bg-green-600"
                  >
                    <CheckCircle2 size={13} /> Selesai (+10 Poin)
                  </button>
                )}

                {item.status === 'Selesai' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 border-0 rounded-lg text-compact-xs font-medium">
                    <CheckCircle2 size={13} /> Donasi Berhasil (+10 Poin)
                  </span>
                )}
              </>
            )}

            {(item.status === 'Diklaim' || item.status === 'Dikonfirmasi') && (isOwner || isReceiver) && (
              <button
                onClick={() => setShowChat(true)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 border-0 rounded-lg text-compact-xs font-bold cursor-pointer transition-colors duration-150 hover:bg-emerald-200"
              >
                <MessageCircle size={13} strokeWidth={2} /> Chat {isOwner ? 'Klaimer' : 'Pendonor'}
              </button>
            )}

            <button
              onClick={() => onDetail?.(item)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-transparent border border-(--border-default) rounded-lg text-compact-xs font-medium text-(--text-secondary) cursor-pointer transition-all duration-150 hover:bg-(--bg-surface-3) hover:border-(--border-strong) hover:text-(--text-primary) max-[580px]:hidden"
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

export default function SelamatkanCardList({ items, onDetail, currentUserId, onRefresh, activeTab, loading }) {
  const onRefreshRef = useRef(onRefresh);

  // Simpan fungsi terbaru di ref agar Socket tidak perlu dibuat ulang jika onRefresh berubah
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);
  
  useEffect(() => {
    // Membangun koneksi socket.io ke API server hanya sekali
    const socket = io(API_ORIGIN);
    
    socket.on('statusUpdated', (updatedPost) => {
      if (onRefreshRef.current) {
        onRefreshRef.current();
      }
    });

    socket.on('newSurplus', (newPost) => {
      if (onRefreshRef.current) {
        onRefreshRef.current();
      }
    });

    return () => {
      socket.disconnect();
    }
  }, []); // Kosongkan dependency agar tidak terjadi connect-disconnect loop

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-36 w-full bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center border border-dashed rounded-2xl bg-emerald-50/50 border-emerald-100"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
          <Leaf size={28} strokeWidth={1.5} />
        </div>
        <p className="text-compact-base font-medium text-emerald-800">
          Belum ada makanan surplus di sekitarmu saat ini. Tetap pantau ya! 🌿
        </p>
        <p className="text-compact-sm text-emerald-600/70">
          Coba perluas radius pencarian atau ubah filter kategori.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map(item => <SurplusCard key={item.id} item={item} onDetail={onDetail} currentUserId={currentUserId} onRefresh={onRefresh} activeTab={activeTab} />)}
    </div>
  )
}