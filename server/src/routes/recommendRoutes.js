const express = require("express");
const { getDashboardRecommendation, getGeneralRecommendation } = require("../controllers/recommendController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Route untuk widget resep di dashboard (mengambil dari kulkas user)
router.post("/dashboard", verifyToken, getDashboardRecommendation);

// Route general proxy (seperti sebelumnya)
router.post("/", getGeneralRecommendation);

module.exports = router;
