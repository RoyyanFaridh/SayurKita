const express = require('express')
const router = express.Router()
const { createCookingLog, getCookingLogs } = require('../controllers/cookingLogController')
const { verifyToken } = require('../middleware/authMiddleware')

router.post('/', verifyToken, createCookingLog)
router.get('/', verifyToken, getCookingLogs)

module.exports = router