const express = require("express");                   // Import Express để tạo router
const router = express.Router();                      // Tạo một router riêng, dùng để định nghĩa các route con
const authController = require("../controllers/authController"); // Import controller chứa các hàm xử lý logic (register, login,...)

// Định nghĩa route POST /api/auth/register
// Khi có request POST tới /api/auth/register, sẽ gọi hàm register trong authController
router.post("/register", authController.register);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/verify-otp", authController.verifyOtp);

module.exports = router;                              // Xuất router này để dùng trong server.js
