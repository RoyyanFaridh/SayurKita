import { useState, useEffect } from 'react'
import { ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import { API_ORIGIN } from '../../../config/api'
import ResepModal from './ResepModal'
import { formatRecipe } from '../../../utils/resepUtils'

// Fetch helper — throws on non-ok so callers can catch uniformly
async function apiFetch(path, token) {
  const res = await fetch(`${API_ORIGIN}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data
}

export default function ResepWidget({ onCookingLogged }) {
  const [recipes, setRecipes]                 = useState([])
  const [userIngredients, setUserIngredients] = useState([])
  const [masterData, setMasterData]           = useState([])
  const [loading, setLoading]                 = useState(false)
  const [error, setError]                     = useState('')
  const [hasRequested, setHasRequested]       = useState(false)
  const [selected, setSelected]               = useState(null)

  // Fetch stok dan master data sekali saat mount — non-fatal kalau gagal
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    apiFetch('/api/ingredients', token)
      .then(data => setUserIngredients(data.data || []))
      .catch(() => {}) // non-fatal

    apiFetch('/api/ingredients-master', token)
      .then(data => setMasterData(data.data || []))
      .catch(() => {}) // non-fatal
  }, [])

  async function fetchRecommendations() {
    try {
      setLoading(true)
      setError('')
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_ORIGIN}/api/recommend/dashboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
      if (!response.ok) {
        if (response.status === 502) throw new Error('Server AI sedang beristirahat, coba lagi nanti.')
        throw new Error('Gagal memuat rekomendasi resep.')
      }
      const result = await response.json()
      let rawRecipes = []
      if (Array.isArray(result))                           rawRecipes = result
      else if (result.data && Array.isArray(result.data)) rawRecipes = result.data
      else if (result.data?.recipes)                       rawRecipes = result.data.recipes
      else if (Array.isArray(result.recipes))              rawRecipes = result.recipes
      setRecipes(rawRecipes.slice(0, 3).map(formatRecipe))
    } catch (err) {
      setError(err.message || 'Gagal memuat rekomendasi otomatis.')
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  function handleRequest() {
    setHasRequested(true)
    fetchRecommendations()
  }

  const cardClass = "w-full min-w-0 overflow-hidden rounded-md border border-(--border-subtle) bg-white p-4 shadow-xs"

  const Header = () => (
    <div className="mb-3 flex min-w-0 items-start justify-between gap-3 border-b border-(--border-subtle) pb-2">
      <div className="flex min-w-0 items-start gap-2.5">
        <div
          className="mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-(--bg-secondary-subtle)"
          style={{ color: 'var(--color-secondary-600)' }}
        >
          <Sparkles size={14} strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-compact-lg font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
            Resep Rekomendasi AI
          </h2>
          <p className="mt-0.5 text-compact-sm" style={{ color: 'var(--text-muted)' }}>
            Saran resep dari bahan yang akan basi
          </p>
        </div>
      </div>
      {recipes.length > 0 && (
        <button
          onClick={handleRequest}
          className="inline-flex shrink-0 items-center gap-1 bg-transparent text-compact-base font-medium transition-colors duration-150"
          style={{ color: 'var(--text-brand)' }}
        >
          Refresh
          <ArrowRight size={14} strokeWidth={2} />
        </button>
      )}
    </div>
  )

  if (!hasRequested) {
    return (
      <div className={cardClass}>
        <Header />
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-compact-sm" style={{ color: 'var(--text-muted)' }}>
            Biarkan AI mencarikan resep terbaik dari bahan di kulkasmu
          </p>
          <button
            onClick={handleRequest}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md text-compact-base font-semibold border-0 cursor-pointer transition-colors duration-150 hover:bg-secondary-400"
            style={{ background: 'var(--color-secondary-500)', color: 'var(--color-primary-900)' }}
          >
            <Sparkles size={14} strokeWidth={2} />
            Carikan Resep
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={cardClass}>
        <Header />
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 size={16} className="animate-spin" style={{ color: 'var(--color-secondary-600)' }} />
          <p className="text-compact-base" style={{ color: 'var(--text-secondary)' }}>
            Mencari resep terbaik untuk bahanmu...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cardClass}>
        <Header />
        <div className="flex items-center gap-2.5 px-4 py-3 bg-(--bg-warning-subtle) border border-(--border-warning) rounded-md">
          <AlertCircle size={16} className="shrink-0" style={{ color: 'var(--color-warning-600)' }} />
          <p className="text-compact-sm min-w-0 overflow-hidden wrap-break-word" style={{ color: 'var(--color-warning-800)' }}>
            {error}
          </p>
        </div>
        <button
          onClick={handleRequest}
          className="mt-3 w-full py-2 rounded-md text-compact-base font-medium border border-(--border-default) bg-transparent cursor-pointer transition-colors duration-150 hover:bg-(--bg-surface-3)"
          style={{ color: 'var(--text-secondary)' }}
        >
          Coba lagi
        </button>
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className={cardClass}>
        <Header />
        <div className="flex items-center gap-2.5 px-4 py-3 bg-(--bg-surface-2) border border-(--border-subtle) rounded-md">
          <AlertCircle size={16} className="shrink-0" style={{ color: 'var(--text-muted)' }} />
          <p className="text-compact-sm min-w-0 overflow-hidden wrap-break-word" style={{ color: 'var(--text-secondary)' }}>
            Belum ada resep yang bisa direkomendasikan dari bahan di kulkas.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <ResepModal
        recipe={selected}
        onClose={() => setSelected(null)}
        userIngredients={userIngredients}
        masterData={masterData}
        onCookingLogged={onCookingLogged}
      />
      <div className={cardClass}>
        <Header />
        <ul className="flex w-full min-w-0 flex-col gap-1 overflow-hidden">
          {recipes.map(r => (
            <li
              key={r.id}
              onClick={() => setSelected(r)}
              className={`relative flex w-full min-w-0 overflow-hidden cursor-pointer items-center justify-between gap-2.5 rounded-md px-3 py-2.5 transition-colors duration-150 hover:bg-(--bg-alt) ${
                r.featured
                  ? 'bg-(--bg-alt) before:absolute before:bottom-[6px] before:left-0 before:top-[6px] before:w-0.75 before:rounded-full before:bg-secondary-500'
                  : ''
              }`}
            >
              <div className="min-w-0 flex-1 overflow-hidden">
                <p
                  className={`flex min-w-0 items-center gap-2 text-compact-lg ${r.featured ? 'font-bold' : 'font-medium'}`}
                  style={{ color: 'var(--text-primary)' }}
                >
                  <span className="truncate capitalize">{r.name}</span>
                  {r.match_score != null && (
                    <span
                      className="shrink-0 text-compact-xs px-1.5 py-0.5 rounded-full font-medium bg-(--bg-secondary-subtle)"
                      style={{ color: 'var(--color-secondary-600)', border: '1px solid var(--color-secondary-100)' }}
                    >
                      {(r.match_score * 100).toFixed(0)}% Match
                    </span>
                  )}
                </p>
                <p className="mt-0.5 w-full truncate text-compact-sm" style={{ color: 'var(--text-secondary)' }}>
                  {r.ingredients}
                </p>
              </div>
              <span className="shrink-0" style={{ color: r.featured ? 'var(--text-brand)' : 'var(--text-muted)' }}>
                <ArrowRight size={15} strokeWidth={2} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}