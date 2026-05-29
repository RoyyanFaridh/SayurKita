const express = require("express");
const { 
  getDashboardRecommendation, 
  cookRecipe,
  getGeneralRecommendation 
} = require("../controllers/recommendController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Route untuk widget resep di dashboard (mengambil dari kulkas user)
router.post("/dashboard", verifyToken, getDashboardRecommendation);

// Route untuk aksi "Sudah Dimasak" (hapus bahan + catat log)
router.post("/cook", verifyToken, cookRecipe);

// Route general proxy (seperti sebelumnya)
router.post("/", getGeneralRecommendation);

module.exports = router;
