const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { getDashboardSummary } = require("../controllers/dashboardController");

const router = express.Router();

// Semua route dashboard memerlukan autentikasi
router.use(verifyToken);

// GET /api/dashboard/summary - Ambil semua data ringkasan dashboard user
router.get("/summary", getDashboardSummary);

module.exports = router;
