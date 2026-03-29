const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const crypto = require("crypto");
const { sendWelcomeEmail, sendPasswordResetOTP, sendPasswordResetSuccess } = require("../../utils/email");

const maxAge = 3 * 24 * 60 * 60;
const createToken = ({ id, email }) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

const formattedUser = (user) => {
  return {
    userId: user._id,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
    isActive: user.isActive,
    addresses: user.addresses,
  };
};

exports.signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already in use" });
    }
    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    // Send Welcome Email asynchronously
    sendWelcomeEmail(user.email, user.name).catch(console.error);

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user is admin (for admin login endpoint)
    // if (user.role !== "admin") {
    //   return res.status(403).json({ message: "Admin access required" });
    // }

    const token = createToken({ id: user._id, email: user.email });

    // Guard: prevent admins from logging into the customer store
    if (user.role === "admin") {
      return res.status(403).json({ message: "Please use the admin portal to login." });
    }

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: formattedUser(user),
      token,
      success: true,
      message: "Login Successful",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Only allow admins to use this endpoint
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin accounts only." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken({ id: user._id, email: user.email });

    // Use a DIFFERENT cookie name so admin sessions never collide with customer sessions
    res.cookie("admin_token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: formattedUser(user),
      token,
      success: true,
      message: "Admin Login Successful",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });

  res.json({ message: "Logged out" });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    // Always return generic success to prevent email enumeration
    if (!user) {
      return res.status(200).json({ message: "If an account exists, a reset code has been sent.", success: true });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiry (10 minutes)
    const expireTime = Date.now() + 10 * 60 * 1000;

    user.resetPasswordOTP = otpCode;
    user.resetPasswordExpire = expireTime;
    await user.save({ validateBeforeSave: false });

    // Send the email
    await sendPasswordResetOTP(user.email, user.name, otpCode);

    res.status(200).json({ message: "If an account exists, a reset code has been sent.", success: true });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Error processing request", success: false });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required", success: false });
    }

    const user = await User.findOne({
      email,
      resetPasswordOTP: code,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset code", success: false });
    }

    res.status(200).json({ message: "Code verified successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Error verifying code", success: false });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword, new_password } = req.body;
    const finalPassword = newPassword || new_password;

    if (!email || !code || !finalPassword) {
      return res.status(400).json({ message: "Please provide all required fields", success: false });
    }

    const user = await User.findOne({
      email,
      resetPasswordOTP: code,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset code", success: false });
    }

    // Update password (pre-save hook will hash it automatically)
    user.password = finalPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send Success Email
    sendPasswordResetSuccess(user.email, user.name).catch(console.error);

    res.status(200).json({ message: "Password reset successfully", success: true });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Error resetting password", success: false });
  }
};
