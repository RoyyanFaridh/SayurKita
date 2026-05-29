import { X, MapPin, Package, Leaf, Clock, CheckSquare, MessageCircle, CheckCircle2 } from 'lucide-react'
import { API_ORIGIN } from '../../../config/api'

// Kalkulator estimasi jejak karbon disalin agar konsisten
const CARBON_FACTOR_GRAM = {
  "Makanan Matang": 400,
  "Sayuran":        200,
  "Sayur":          200,
  "Lauk":           350,
  "Buah":           150,
  "Lainnya":        250,
}

function hitungCarbonOffset(category, quantity) {
  const factorGram = CARBON_FACTOR_GRAM[category] || 250
  const match = String(quantity).match(/([\d,.]+)/)
  const jumlahUnit = match ? parseFloat(match[1].replace(",", ".")) : 1
  return Math.round(factorGram * jumlahUnit)
}

export default function SelamatkanDetailModal({ 
  item, 
  onClose, 
  onAction, 
  activeTab, 
  currentUserId,
  onOpenChat
}) {
  if (!item) return null

  const estimasiCarbon = hitungCarbonOffset(item.kategori, item.jumlah)
  const isOwner = String(currentUserId) === String(item.userId)
  const hasExpired = item.expiredReceivers?.includes(String(currentUserId))
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
        
        {/* Gambar Atas */}
        <div className="relative w-full h-56 bg-slate-100 shrink-0">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.nama} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <Package size={48} strokeWidth={1} />
            </div>
          )}
          
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-md"
          >
            <X size={18} />
          </button>
        </div>

        {/* Konten Tengah */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-md uppercase tracking-wide">
                {item.kategori}
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-600 text-compact-xs font-semibold bg-emerald-50 px-2 py-1 rounded-md">
                <Leaf size={12} /> -{estimasiCarbon}g CO₂
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 leading-tight mb-1">{item.nama}</h2>
            <div className="flex items-center gap-1.5 text-compact-sm text-slate-500">
              <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                {item.pemilik?.[0]?.toUpperCase()}
              </div>
              <span className="font-medium text-slate-700">{item.pemilik}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-500 text-compact-xs mb-1">
                <Package size={14} /> Jumlah
              </div>
              <p className="font-semibold text-slate-800">{item.jumlah}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-500 text-compact-xs mb-1">
                <Clock size={14} /> Batas Waktu
              </div>
              <p className="font-semibold text-slate-800">{item.kondisi === 'segera' ? 'Hari ini' : item.kondisi === 'mau-habis' ? 'Segera Ambil' : 'Segar'}</p>
            </div>
          </div>

          <div className="mt-2">
            <h4 className="text-compact-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-400" /> Lokasi Penjemputan
            </h4>
            <p className="text-compact-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {item.lokasi}
            </p>
          </div>

          <div className="mt-2">
            <h4 className="text-compact-sm font-semibold text-slate-800 mb-1.5">Deskripsi</h4>
            <p className="text-compact-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {item.deskripsi}
            </p>
          </div>
        </div>

        {/* Footer & Aksi Dinamis */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3 shrink-0">
          
          {activeTab === 'feed' ? (
            <>
              {item.status === 'Tersedia' && !isOwner && !hasExpired && (
                <button
                  onClick={() => { onAction('claim'); onClose(); }}
                  className="flex-1 inline-flex justify-center items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-compact-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <Package size={16} /> Klaim Makanan
                </button>
              )}
              
              {item.status === 'Tersedia' && !isOwner && hasExpired && (
                <span className="flex-1 inline-flex justify-center items-center px-4 py-2.5 bg-red-50 text-red-700 rounded-xl text-compact-sm font-semibold border border-red-200">
                  Batas waktu klaim Anda habis
                </span>
              )}

              {item.status === 'Tersedia' && !isOwner && !hasExpired && (
                <button
                  onClick={() => { onOpenChat(); onClose(); }}
                  className="inline-flex justify-center items-center gap-1.5 px-4 py-2.5 bg-slate-200 text-slate-700 rounded-xl text-compact-sm font-semibold hover:bg-slate-300 transition-colors"
                >
                  <MessageCircle size={16} /> Chat
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex justify-end">
              {item.status === 'Diklaim' && isOwner && (
                <button
                  onClick={() => { onAction('confirm'); onClose(); }}
                  className="flex-1 inline-flex justify-center items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-compact-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <CheckSquare size={16} /> Konfirmasi Diambil
                </button>
              )}
              {item.status === 'Selesai' && (
                <div className="w-full text-center p-2 text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-100 text-compact-sm font-medium">
                  <CheckCircle2 size={16} className="inline-block mr-1.5 mb-0.5" />
                  Terima kasih! Donasi ini berhasil diselesaikan.
                </div>
              )}
              {item.status === 'Dikonfirmasi' && isOwner && (
                <button
                  onClick={() => { onAction('complete'); onClose(); }}
                  className="flex-1 inline-flex justify-center items-center gap-1.5 px-4 py-2.5 bg-green-600 text-white rounded-xl text-compact-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
                >
                  <CheckCircle2 size={16} /> Selesai (+10 Poin)
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
