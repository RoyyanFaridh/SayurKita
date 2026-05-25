export const categoryColor = {
  sapi:  { background: 'var(--bg-danger-subtle)',  color: 'var(--text-danger)' },
  ayam:  { background: 'var(--bg-warning-subtle)', color: 'var(--text-warning)' },
  tempe: { background: 'var(--bg-success-subtle)', color: 'var(--text-success)' },
  tahu:  { background: 'var(--bg-success-subtle)', color: 'var(--text-success)' },
  ikan:  { background: 'var(--bg-info-subtle)',    color: 'var(--text-info)' },
}

export function parseIngredients(str = '') {
  return str.split('--').map(s => s.trim()).filter(Boolean)
}

export function parseSteps(str = '') {
  return str.split('\n').map(s => s.trim()).filter(Boolean)
}

export function formatRecipe(r, idx) {
  return {
    id: r.id || idx,
    name: r.name || r.Title || r.title || 'Resep tanpa judul',
    ingredients: r.Ingredients_Cleaned || r.ingredients || r.bahan || '',
    ingredients_raw: r.Ingredients || r.ingredients_raw || '',
    steps_raw: r.Steps || r.steps_raw || r.steps || '',
    category: r.Category || r.category || '',
    url: r.URL || r.url || '',
    match_score: r.match_score,
    featured: idx === 0,
  }
}