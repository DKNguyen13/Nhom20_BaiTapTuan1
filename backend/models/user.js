const mongoose = require("mongoose");  // Import Mongoose để định nghĩa schema và kết nối MongoDB

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },       // Trường name kiểu String, bắt buộc phải có
  email: { type: String, required: true, unique: true }, // Trường email kiểu String, bắt buộc và phải duy nhất
  password: { type: String, required: true },   // Trường password kiểu String, bắt buộc
  otp: { type: String },                         // Trường otp kiểu String, không bắt buộc
  otpExpiry: { type: Date },                     // Thời gian hết hạn OTP, kiểu Date, không bắt buộc
});

module.exports = mongoose.model("user", userSchema);  // Xuất model user, Mongoose sẽ tạo collection "users" trong database
