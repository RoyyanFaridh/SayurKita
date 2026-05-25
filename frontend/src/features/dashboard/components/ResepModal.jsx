import { X, ExternalLink, ChefHat } from 'lucide-react'
import { parseIngredients, parseSteps, categoryColor } from '../../../utils/resepUtils'

export default function ResepModal({ recipe, onClose }) {
  if (!recipe) return null

  const ingredients = parseIngredients(recipe.ingredients_raw)
  const steps = parseSteps(recipe.steps_raw)
  const catStyle = categoryColor[recipe.category?.toLowerCase()] ?? {
    background: 'var(--bg-surface-2)',
    color: 'var(--text-secondary)',
  }

  return (
    <div
      className="fixed inset-0 z-500 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl flex flex-col"
        style={{
          background: 'var(--bg-surface-1)',
          maxHeight: '88vh',
          boxShadow: '0 -2px 24px rgba(0,0,0,0.12)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div
            className="w-10 h-1 rounded-full"
            style={{ background: 'var(--border-default)' }}
          />
        </div>

        {/* Header */}
        <div
          className="flex items-start justify-between gap-3 px-5 pt-4 pb-4 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <h3
              className="text-compact-xl font-semibold m-0 capitalize leading-snug"
              style={{ color: 'var(--text-primary)' }}
            >
              {recipe.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-compact-xs font-medium px-2.5 py-0.5 rounded-full capitalize"
                style={catStyle}
              >
                {recipe.category ?? 'Umum'}
              </span>
              {recipe.match_score != null && (
                <span
                  className="text-compact-xs font-medium px-2.5 py-0.5 rounded-full"
                  style={{
                    background: 'var(--bg-surface-2)',
                    color: 'var(--text-brand)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {(recipe.match_score * 100).toFixed(0)}% cocok dengan bahanmu
                </span>
              )}
              {ingredients.length > 0 && (
                <span
                  className="text-compact-xs px-2.5 py-0.5 rounded-full"
                  style={{
                    background: 'var(--bg-surface-2)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {ingredients.length} bahan · {steps.length} langkah
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-md border-0 bg-transparent cursor-pointer transition-colors duration-150 hover:bg-(--bg-surface-2)"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Tutup modal"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-5 flex flex-col gap-6">

          {/* Bahan */}
          <section>
            <h4
              className="text-compact-sm font-semibold uppercase tracking-wide m-0 mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              Bahan-bahan
            </h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-0">
              {ingredients.map((bahan, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 py-2"
                  style={{
                    borderBottom: i < ingredients.length - 1
                      ? '0.5px solid var(--border-subsub)'
                      : 'none',
                  }}
                >
                  <span
                    className="shrink-0 mt-0.5 text-compact-xs font-medium w-5 text-right"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {i + 1}.
                  </span>
                  <span
                    className="text-compact-base"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {bahan}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Langkah */}
          <section>
            <h4
              className="text-compact-sm font-semibold uppercase tracking-wide m-0 mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              Cara membuat
            </h4>
            <ol className="list-none p-0 m-0 flex flex-col gap-4">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-compact-xs font-semibold mt-0.5"
                    style={{
                      background: 'var(--color-secondary-500)',
                      color: 'var(--color-primary-900)',
                      minWidth: '1.5rem',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-compact-base leading-relaxed"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {step.replace(/^\d+\)\s*/, '')}
                  </span>
                </li>
              ))}
            </ol>
          </section>

        </div>

        {/* Footer — hanya render kalau ada url */}
        {recipe.url && (
          <div
            className="px-5 py-4 border-t flex items-center justify-between gap-3"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <a 
              href={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-compact-sm font-medium transition-colors duration-150"
              style={{ color: 'var(--text-brand)' }}
            >
              <ChefHat size={14} strokeWidth={2} />
              Lihat di Cookpad
              <ExternalLink size={12} strokeWidth={2} />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}