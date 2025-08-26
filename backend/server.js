const express = require("express");               // Import Express để tạo server
const mongoose = require("mongoose");             // Import Mongoose để kết nối MongoDB
const cors = require("cors");                     // Import CORS middleware để cho phép request từ domain khác
require("dotenv").config();                       // Load biến môi trường từ file .env

const app = express();                            // Tạo instance Express (server chính)
app.use(cors());                                  // Sử dụng CORS middleware cho tất cả request
app.use(express.json());                          // Cho phép server parse JSON từ request body

app.use("/api/auth", require("./routes/authRoutes"));  // Khi request /api/auth/*, dùng router authRoutes.js
app.use("/api/", require("./routes/profileRoutes")); // Khi request /api/profile/*, dùng router profileRoutes.js

mongoose.connect(process.env.MONGO_URI)          // Kết nối MongoDB bằng MONGO_URI trong .env
    .then(() => console.log("MongoDB connected"))   // Nếu kết nối thành công, log ra console
    .catch((err) => console.log(err));             // Nếu lỗi kết nối, log lỗi ra console

const PORT = process.env.PORT || 5000;           // Lấy port từ .env, nếu không có dùng mặc định 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Bắt đầu server và log port
