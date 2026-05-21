const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getIngredients,
  addIngredient,
  updateIngredient,
  deleteIngredient,
  getExpiryAlerts,
  getIngredientsSummary,
} = require("../controllers/ingredientController");

const router = express.Router();

// Semua route ingredient memerlukan autentikasi
router.use(verifyToken);

// GET /api/ingredients - Ambil semua ingredients user
router.get("/", getIngredients);

// GET /api/ingredients/alerts/expiry - Ambil items yang hampir kadaluwarsa
router.get("/alerts/expiry", getExpiryAlerts);

// GET /api/ingredients/stats/summary - Ambil ringkasan statistik
router.get("/stats/summary", getIngredientsSummary);

// POST /api/ingredients - Tambah ingredient baru
router.post("/", addIngredient);

// PUT /api/ingredients/:id - Update ingredient
router.put("/:id", updateIngredient);

// DELETE /api/ingredients/:id - Hapus ingredient
router.delete("/:id", deleteIngredient);

module.exports = router;
