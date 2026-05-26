const express = require("express");
const { createSurplusPost, getAllSurplusPosts, claimSurplusPost } = require("../controllers/surplusController");
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

// Route untuk mengambil semua postingan surplus yang "Tersedia"
router.get("/", getAllSurplusPosts);

// Route untuk mengklaim makanan surplus
router.patch("/:id/claim", verifyToken, claimSurplusPost);

module.exports = router;
