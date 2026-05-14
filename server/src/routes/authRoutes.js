const express = require("express");
const {
  register,
  verifyOTP,
  login,
  resendOTP,
  getMe,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/resend-otp", resendOTP);
router.get("/me", verifyToken, getMe);

module.exports = router;
