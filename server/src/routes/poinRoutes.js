const express = require("express");
const router  = express.Router();
const { getPoinSummary, getRiwayatPoin } = require("../controllers/poinController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/",        verifyToken, getPoinSummary);
router.get("/riwayat", verifyToken, getRiwayatPoin);

module.exports = router;