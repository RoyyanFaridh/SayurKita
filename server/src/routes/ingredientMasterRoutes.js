const express = require('express')
const { getIngredientsMaster } = require('../controllers/ingredientMasterController')

const router = express.Router()

router.get('/', getIngredientsMaster)

module.exports = router