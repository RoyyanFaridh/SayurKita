import { useState, useEffect } from 'react'
import { ChefHat } from 'lucide-react'
import { API_ORIGIN } from '../../../config/api'
import { useNavigate } from 'react-router-dom'

const config = {
  danger: {
    wrapper: { background: 'var(--bg-danger-subtle)', borderColor: 'var(--color-danger-500)' },
    dot:     { background: 'var(--color-danger-500)' },
    title:   { color: 'var(--color-danger-800)' },
    sub:     { color: 'var(--color-danger-700)' },
    btn:     { background: 'var(--color-danger-500)', color: '#ffffff' },
  },
  warning: {
    wrapper: { background: 'var(--bg-warning-subtle)', borderColor: 'var(--color-warning-600)' },
    dot:     { background: 'var(--color-warning-600)' },
    title:   { color: 'var(--color-warning-800)' },
    sub:     { color: 'var(--color-warning-700)' },
    btn:     { background: 'var(--color-warning-600)', color: '#ffffff' },
  },
}

export default function AlertsSection() {
  const [alerts, setAlerts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch(`${API_ORIGIN}/api/ingredients/alerts/expiry`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.data) setAlerts(data.data) })
      .catch(console.error)

    // Catatan: tidak ada loading state → layout shift saat fetch lambat.
    // Pertimbangkan tambah `useState(true)` untuk isLoading + skeleton
    // jika AlertsSection ini di atas fold dashboard.
  }, [])

  if (!alerts.length) return null

  return (
    <div className="flex flex-col gap-2">
      {alerts.slice(0, 2).map(a => {
        const type = a.alertStatus === 'danger' ? 'danger' : 'warning'
        const c = config[type]

        const title = a.daysRemaining === 0
          ? `${a.nama} kadaluwarsa hari ini!`
          : `${a.nama} kadaluwarsa ${a.daysRemaining === 1 ? 'besok' : `${a.daysRemaining} hari lagi`}`

        return (
          <div
            key={a.id}
            // border-[0.5px] agar konsisten dengan komponen lain di dashboard
            className="flex items-center gap-3 px-4 py-3 rounded-md border-[0.5px] max-[480px]:px-3 max-[480px]:py-2.5"
            style={c.wrapper}
          >
            {/* w-2.5 h-2.5 (10px) — sedikit lebih besar dari 8px agar lebih intentional sebagai status dot */}
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={c.dot} />
            <div className="flex-1 min-w-0">
              {/* font-medium — semibold terlalu berat di atas warning/danger background */}
              <p className="text-compact-lg font-medium capitalize truncate m-0" style={c.title}>{title}</p>
              {/* truncate 1 baris di mobile, bukan hidden — beri konteks minimal */}
              <p className="text-compact-sm mt-0.5 m-0 truncate" style={c.sub}>
                Jangan biarkan terbuang! Masak sekarang dengan ide resep AI.
              </p>
            </div>
            <button
              // rounded-md — konsisten dengan elemen lain, bukan rounded-sm
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-compact-base font-semibold whitespace-nowrap cursor-pointer border-none transition-opacity duration-150 hover:opacity-85"
              style={c.btn}
              onClick={() => navigate('/kulkas')}
              // Pertimbangkan label lebih spesifik, misal: "Lihat Resep" atau "Ke Kulkas"
              // agar lebih clear bahwa ini navigasi, bukan aksi langsung
            >
              <ChefHat size={14} strokeWidth={2} />
              Cari Resep
            </button>
          </div>
        )
      })}

      {alerts.length > 2 && (
        <p className="text-compact-xs m-0 px-1" style={{ color: 'var(--text-muted)' }}>
          +{alerts.length - 2} item lainnya akan segera kadaluwarsa
        </p>
      )}
    </div>
  )
}