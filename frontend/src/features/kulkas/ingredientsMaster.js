import { API_ORIGIN } from '../../config/api'

let cache = null
export let INGREDIENTS_MAP    = {}
export let INGREDIENTS_MASTER = []

export async function fetchIngredientsMaster() {
  if (cache) return cache
  const res  = await fetch(`${API_ORIGIN}/api/ingredients-master`)
  const json = await res.json()
  cache            = Object.fromEntries(json.data.map(item => [item.nama, item]))
  INGREDIENTS_MAP    = cache
  INGREDIENTS_MASTER = json.data
  return cache
}

fetchIngredientsMaster()