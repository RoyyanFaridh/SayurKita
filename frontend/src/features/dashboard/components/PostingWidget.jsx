import { useState, useEffect } from 'react'
import { ArrowRight, Loader2, AlertCircle, PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { API_ORIGIN } from '../../../config/api'

const BADGE_MAP = {
  'Tersedia':     { cls: 'bg-(--bg-dark) text-(--text-brand-dark)',          label: 'Aktif'        },
  'Diklaim':      { cls: 'bg-(--bg-warning-subtle) text-(--text-warning)',   label: 'Diklaim'      },
  'Dikonfirmasi': { cls: 'bg-(--bg-info-subtle) text-(--text-info)',         label: 'Dikonfirmasi' },
  'Selesai':      { cls: 'bg-(--bg-success-subtle) text-(--text-success)',   label: 'Selesai'      },
}

// Hanya tampilkan postingan yang masih aktif di widget ini
const ACTIVE_STATUSES = ['Tersedia', 'Diklaim', 'Dikonfirmasi']

export default function PostingWidget() {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const navigate              = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }

    setLoading(true)
    setError('')

    fetch(`${API_ORIGIN}/api/surplus/my-posts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject(`HTTP ${res.status}`))
      .then(data => {
        // Filter hanya postingan aktif untuk widget ini
        const active = (data.data || []).filter(p => ACTIVE_STATUSES.includes(p.status))
        setPosts(active)
      })
      .catch(() => setError('Gagal memuat postingan.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div
      className="rounded-md overflow-hidden border-[0.5px]"
      style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center px-4 pt-4 pb-2 mb-0 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <h2 className="text-compact-lg font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
          Posting Aktifmu
        </h2>
        <button
          className="inline-flex items-center gap-1 text-compact-base font-medium border-none bg-transparent cursor-pointer transition-colors duration-150 hover:opacity-75"
          style={{ color: 'var(--text-brand)' }}
        >
          Lihat semua <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 size={16} className="animate-spin" style={{ color: 'var(--color-secondary-600)' }} />
          <p className="text-compact-sm m-0" style={{ color: 'var(--text-muted)' }}>
            Memuat postinganmu...
          </p>
        </div>
      ) : error ? (
        <div
          className="flex items-center gap-2 mx-4 my-4 px-3 py-2.5 rounded-md"
          style={{ background: 'var(--bg-warning-subtle)', border: '0.5px solid var(--border-warning)' }}
        >
          <AlertCircle size={14} className="shrink-0" style={{ color: 'var(--color-warning-600)' }} />
          <p className="text-compact-sm m-0" style={{ color: 'var(--color-warning-800)' }}>{error}</p>
        </div>
      ) : posts.length === 0 ? (
        /* ── Empty State ── */
        <div className="flex flex-col items-center gap-3 px-5 py-7 text-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'var(--bg-surface-2)' }}
          >
            <PlusCircle size={20} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-compact-base font-medium m-0" style={{ color: 'var(--text-primary)' }}>
              Belum ada postingan aktif
            </p>
            <p className="text-compact-sm m-0" style={{ color: 'var(--text-muted)' }}>
              Punya makanan sisa layak konsumsi? Yuk, bagikan ke orang sekitar!
            </p>
          </div>
          <button
            onClick={() => navigate('/selamatkan')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-compact-sm font-semibold border-0 cursor-pointer transition-colors duration-150"
            style={{ background: 'var(--color-secondary-500)', color: 'var(--color-primary-900)' }}
          >
            <PlusCircle size={14} strokeWidth={2} />
            Bagikan Makanan
          </button>
        </div>
      ) : (
        /* ── List Postingan Aktif ── */
        <ul className="list-none p-0 m-0">
          {posts.map((p, i) => {
            const badge = BADGE_MAP[p.status] ?? { cls: 'bg-(--bg-subtle) text-(--text-secondary)', label: p.status }
            const subText = p.status === 'Diklaim'
              ? `Diklaim oleh ${p.receiver?.name ?? 'seseorang'}`
              : p.status === 'Dikonfirmasi'
                ? 'Menunggu selesai'
                : 'Menunggu klaim'

            return (
              <li
                key={p.id}
                className={i < posts.length - 1 ? 'border-b' : ''}
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Thumbnail gambar atau placeholder */}
                  {p.imageUrl ? (
                    <img
                      src={`${API_ORIGIN}${p.imageUrl}`}
                      alt={p.title}
                      className="w-10 h-10 rounded-md shrink-0 object-cover border-[0.5px]"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-md shrink-0 border-[0.5px]"
                      style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-subtle)' }}
                      aria-hidden="true"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-compact-lg font-medium truncate m-0" style={{ color: 'var(--text-primary)' }}>
                      {p.title}
                    </p>
                    <p className="text-compact-sm mt-0.5 m-0" style={{ color: 'var(--text-muted)' }}>
                      {subText}
                    </p>
                  </div>
                  <span className={`text-compact-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Note informatif untuk postingan yang masih menunggu klaim */}
                {p.status === 'Tersedia' && (
                  <p
                    className="text-compact-sm px-4 py-2.5 m-0 border-t"
                    style={{
                      color: 'var(--text-secondary)',
                      background: 'var(--bg-subtle)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    Jika tidak diklaim, otomatis akan dikirim ke Mitra Organik
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
