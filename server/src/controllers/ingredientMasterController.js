const axios = require('axios')

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8003'

const getIngredientsMaster = async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/ingredients-master`)
    return res.status(200).json(response.data)
  } catch (err) {
    console.error('getIngredientsMaster error:', err)
    return res.status(500).json({ success: false, message: 'Gagal memuat data master bahan.' })
  }
}

module.exports = { getIngredientsMaster }