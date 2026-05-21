import { useState, useEffect } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { API_ORIGIN } from '../../../config/api'

export default function ResepWidget() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchRecommendations() {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('token')

      const response = await fetch(`${API_ORIGIN}/api/recommend/dashboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        if (response.status === 502) {
          throw new Error('Server AI sedang beristirahat, coba lagi nanti.')
        }
        throw new Error('Gagal memuat rekomendasi.')
      }

      const result = await response.json()

      let rawRecipes = []
      if (Array.isArray(result)) rawRecipes = result
      else if (result.data && Array.isArray(result.data)) rawRecipes = result.data
      else if (result.data && Array.isArray(result.data.recipes)) rawRecipes = result.data.recipes
      else if (Array.isArray(result.recipes)) rawRecipes = result.recipes

      const formatted = rawRecipes.slice(0, 3).map((r, idx) => ({
        id: r.id || idx,
        name: r.name || r.title || 'Resep tanpa judul',
        ingredients: r.ingredients || r.bahan || r.description || '',
        match_score: r.match_score,
        featured: idx === 0,
      }))

      setRecipes(formatted)
    } catch (err) {
      setError(err.message || 'Gagal memuat rekomendasi otomatis.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRecommendations() }, [])

  return (
    <div
      className="rounded-md overflow-hidden p-4 border"
      style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subsub)', boxShadow: 'var(--shadow-xs)' }}
    >
      <div
        className="flex justify-between items-start gap-3 pb-2 mb-3 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div>
          <h2 className="text-compact-lg font-semibold leading-snug m-0" style={{ color: 'var(--text-primary)' }}>
            Resep Rekomendasi AI
          </h2>
          <p className="text-compact-sm mt-0.5 m-0" style={{ color: 'var(--text-muted)' }}>
            Saran resep dari bahan yang akan basi
          </p>
        </div>
        <button
          className="inline-flex items-center gap-1 text-compact-base font-medium border-none bg-transparent cursor-pointer shrink-0 transition-colors duration-150"
          style={{ color: 'var(--text-brand)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand-green-light)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-brand)')}
        >
          Lihat semua <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col gap-1 min-h-[100px] justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <Loader2 className="animate-spin mb-2" size={24} style={{ color: 'var(--text-brand)' }} />
            <p className="text-compact-sm m-0" style={{ color: 'var(--text-muted)' }}>
              Memuat rekomendasi resep...
            </p>
          </div>
        ) : error ? (
          <div
            className="py-3 px-3 rounded-md border"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-subsub)' }}
          >
            <p className="text-compact-sm text-center m-0" style={{ color: 'var(--text-secondary)' }}>
              {error}
            </p>
            <button
              onClick={fetchRecommendations}
              className="mt-2 w-full py-1.5 rounded-md text-compact-sm font-medium border border-(--border-default) bg-transparent cursor-pointer transition-colors duration-150 hover:bg-(--bg-surface-3)"
              style={{ color: 'var(--text-secondary)' }}
            >
              Coba lagi
            </button>
          </div>
        ) : recipes.length === 0 ? (
          <div
            className="py-3 px-3 rounded-md border"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-subsub)' }}
          >
            <p className="text-compact-sm text-center m-0" style={{ color: 'var(--text-secondary)' }}>
              Belum ada resep yang bisa direkomendasikan dari bahan di kulkas.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1 p-0 m-0 list-none">
            {recipes.map((r) => (
              <li
                key={r.id}
                className={`relative flex justify-between items-center gap-2.5 px-3 py-2.5 rounded-md cursor-pointer transition-colors duration-150 hover:bg-(--bg-subtle) ${
                  r.featured ? 'bg-(--bg-subtle)' : ''
                }`}
              >
                {r.featured && (
                  <span
                    className="absolute left-0 top-1.5 bottom-1.5 w-0.75 rounded-full"
                    style={{ background: 'var(--accent-primary)' }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-compact-lg m-0"
                    style={{ color: 'var(--text-primary)', fontWeight: r.featured ? 700 : 500 }}
                  >
                    <span className="capitalize">{r.name}</span>
                    {r.match_score != null && (
                      <span
                        className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: 'var(--bg-surface-2)', color: 'var(--text-brand)', border: '1px solid var(--border-subtle)' }}
                      >
                        {(r.match_score * 100).toFixed(0)}% Match
                      </span>
                    )}
                  </p>
                  <p className="text-compact-sm mt-0.5 m-0 truncate" style={{ color: 'var(--text-secondary)' }}>
                    {r.ingredients}
                  </p>
                </div>
                <span
                  className="shrink-0 ml-2 transition-transform duration-150 group-hover:translate-x-0.5"
                  style={{ color: r.featured ? 'var(--text-brand)' : 'var(--text-muted)' }}
                >
                  <ArrowRight size={16} strokeWidth={2} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}