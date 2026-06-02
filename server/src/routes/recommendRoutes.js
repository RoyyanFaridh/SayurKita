const express = require("express");
const { 
  getDashboardRecommendation, 
  cookRecipe,
  getGeneralRecommendation,
  getCookingTips,
} = require("../controllers/recommendController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/dashboard", verifyToken, getDashboardRecommendation);

router.post("/cook", verifyToken, cookRecipe);

router.post("/", getGeneralRecommendation);

router.post("/cooking-tips", verifyToken, getCookingTips);

module.exports = router;
