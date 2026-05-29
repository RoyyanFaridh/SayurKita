const path = require('path')
const fs   = require('fs')

const DATA_PATH = path.resolve(__dirname, '../../../ai/data/ingredients_master_final.json')

const getIngredientsMaster = (req, res) => {
  try {
    const raw  = fs.readFileSync(DATA_PATH, 'utf-8')
    const data = JSON.parse(raw)

    const transformed = data.map(item => ({
      nama:         item.nama_id,
      kategori:     item.kategori,
      umur_kulkas:  item.umur_kulkas      ?? 0,
      umur_ruang:   item.umur_suhu_ruang  ?? 0,
      umur_freezer: item.umur_freezer     ?? 0,
      kkal:         item.kalori_per_100g  ?? 0,
      protein:      item.protein_g        ?? 0,
      lemak:        item.lemak_g          ?? 0,
      karbo:        item.karbo_g          ?? 0,
      karbon_co2e:  item.karbon_co2e      ?? 0,
    }))

    return res.status(200).json({ success: true, data: transformed })
  } catch (err) {
    console.error('getIngredientsMaster error:', err)
    return res.status(500).json({ success: false, message: 'Gagal memuat data master bahan.' })
  }
}

module.exports = { getIngredientsMaster }