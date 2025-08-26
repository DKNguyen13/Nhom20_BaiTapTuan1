const mongoose = require("mongoose");  // Import Mongoose để định nghĩa schema và kết nối MongoDB
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import plugin mongoose-sequence để tự động tăng giá trị cho trường _id
const userSchema = new mongoose.Schema({
  _id: { type: Number, },
  name: { type: String, required: true },       // Trường name kiểu String, bắt buộc phải có
  email: { type: String, required: true, unique: true }, // Trường email kiểu String, bắt buộc và phải duy nhất
  password: { type: String, required: true },   // Trường password kiểu String, bắt buộc
  otp: { type: String },                         // Trường otp kiểu String, không bắt buộc
  otpExpiry: { type: Date },                     // Thời gian hết hạn OTP, kiểu Date, không bắt buộc
});

// Add plugin
userSchema.plugin(AutoIncrement);

module.exports = mongoose.model("user", userSchema);  // Xuất model user, Mongoose sẽ tạo collection "users" trong database
