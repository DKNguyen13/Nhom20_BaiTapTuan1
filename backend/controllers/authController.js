const User = require("../models/user");        // Import model User để thao tác với collection users
const bcrypt = require("bcryptjs");            // Import bcryptjs để hash password (mã hóa)
const nodemailer = require("nodemailer");      // Import nodemailer để gửi email
const jwt = require("jsonwebtoken");

// Hàm gửi OTP qua email
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({  // Tạo transporter để gửi email
    service: "gmail",                              // Dùng Gmail làm dịch vụ gửi mail
    auth: {
      user: process.env.EMAIL_USER,               // Email gửi (lấy từ .env)
      pass: process.env.EMAIL_PASS                // Password hoặc app password (lấy từ .env)
    },
  });

  await transporter.sendMail({                     // Gửi email
    from: process.env.EMAIL_USER,                 // Người gửi
    to: email,                                    // Người nhận
    subject: "Your OTP Code",                     // Tiêu đề email
    text: `Your OTP is ${otp}. Expires in 5 mins.`, // Nội dung email, hiển thị OTP
  });
};

// Controller xử lý đăng ký
exports.register = async (req, res) => {
  const { name, email, password } = req.body;     // Lấy dữ liệu name, email, password từ request body
  try {
    if (await User.findOne({ email }))            // Kiểm tra email đã tồn tại trong DB chưa
      return res.status(400).json({ message: "Email exists" }); // Nếu có rồi thì trả lỗi 400

    const hashedPassword = await bcrypt.hash(password, 10);  // Mã hóa password với salt 10

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Sinh OTP 6 số ngẫu nhiên

    const user = new User({                        // Tạo instance User mới
      name,
      email,
      password: hashedPassword,                    // Lưu password đã hash
      otp,                                         // Lưu OTP vừa tạo
      otpExpiry: new Date(Date.now() + 5 * 60 * 1000) // OTP hết hạn sau 5 phút
    });

    await user.save();                             // Lưu user vào MongoDB
    await sendOtpEmail(email, otp);                // Gửi email OTP cho user
    res.status(201).json({ message: "OTP sent to email" }); // Trả về response thành công
  } catch (err) {
    res.status(500).json({ message: err.message }); // Nếu lỗi server, trả về 500 và message lỗi
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 phút
    await user.save();

    await sendOtpEmail(email, otp); // gửi OTP thực qua email
    res.json({ message: "OTP sent for password reset" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10); // hash password mới
    user.otp = null;                                     // xóa OTP sau khi dùng
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;           // Xóa OTP sau khi xác nhận
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Account verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(email);
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: "Invalid request" });
    }
    return res.json({
      email: email,
      token: generateJWT(email)
    })
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const generateJWT = (email) => {
  const payload = { email: email };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
    algorithm: 'HS256',
    expiresIn: '60m'
  });
}


