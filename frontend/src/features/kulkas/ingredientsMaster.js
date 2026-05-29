import { API_ORIGIN } from '../../config/api'

let cache = null
export let INGREDIENTS_MAP    = {}
export let INGREDIENTS_MASTER = []

export async function fetchIngredientsMaster() {
  if (cache) return cache
  const res  = await fetch(`${API_ORIGIN}/api/ingredients-master`)
  const json = await res.json()
  cache              = Object.fromEntries(json.data.map(item => [item.nama, item]))
  INGREDIENTS_MAP    = cache
  INGREDIENTS_MASTER = json.data
  return cache
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalize(s) {
  return s.toLowerCase().replace(/\s+/g, ' ').trim()
}

function fuzzyMatch(a, b) {
  const na = normalize(a)
  const nb = normalize(b)

  // 1. substring match
  if (nb.includes(na) || (na.includes(nb) && nb.length >= 4)) return true

  // 2. token match: semua kata dari string pendek ada di string panjang
  //    menangani kasus kata sisipan seperti "penyedap rasa sapi" vs "penyedap sapi"
  const shorter = na.length <= nb.length ? na : nb
  const longer  = na.length <= nb.length ? nb : na
  const tokens  = shorter.split(' ').filter(t => t.length >= 3)
  return tokens.length > 0 && tokens.every(t => longer.includes(t))
}

export function findMasterByNama(nama) {
  if (!INGREDIENTS_MASTER.length) return null
  const clean = normalize(nama)

  // exact match dulu
  const exact = INGREDIENTS_MASTER.find(m => normalize(m.nama) === clean)
  if (exact) return exact

  // fuzzy fallback
  const candidates = INGREDIENTS_MASTER.filter(
    m => fuzzyMatch(nama, m.nama) || fuzzyMatch(m.nama, nama)
  )
  return candidates.length
    ? candidates.sort((a, b) => b.nama.length - a.nama.length)[0]
    : null
}

fetchIngredientsMaster()