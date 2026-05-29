const express = require("express");
const { createSurplusPost, getAllSurplusPosts, getMySurplusPosts, claimSurplusPost, confirmSurplusPost, completeSurplusPost, getChatMessages, sendChatMessage, getSurplusStats } = require("../controllers/surplusController");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Route untuk membuat postingan surplus baru
router.post("/", verifyToken, (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, createSurplusPost);

// Route untuk mengambil statistik reaktif
router.get("/stats", verifyToken, getSurplusStats);

// Route untuk mengambil history donasi pribadi
router.get("/my-posts", verifyToken, getMySurplusPosts);

// Route untuk mengambil semua postingan surplus yang "Tersedia"
router.get("/", verifyToken, getAllSurplusPosts);

// Route untuk State Machine: Klaim -> Konfirmasi -> Selesai
router.patch("/:id/claim", verifyToken, claimSurplusPost);
router.patch("/:id/confirm", verifyToken, confirmSurplusPost);
router.patch("/:id/complete", verifyToken, completeSurplusPost);

// Route untuk Chat Surplus
router.get("/:id/chat", verifyToken, getChatMessages);
router.post("/:id/chat", verifyToken, sendChatMessage);

module.exports = router;
