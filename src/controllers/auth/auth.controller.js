const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const crypto = require("crypto");
const { sendWelcomeEmail, sendPasswordResetOTP, sendPasswordResetSuccess } = require("../../utils/email");

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "3d" } // 🧪 TESTING: change back to "3d" for production
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
    { expiresIn: "14d" }
  );
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
    profileImage:user.profileImage,
    dob: user.dob,
    gender: user.gender,
    
  };
};

exports.signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: "Username already in use" });
    }
    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    // Send Welcome Email asynchronously
    sendWelcomeEmail(user.email, user.name).catch(console.error);

    res.status(201).json({ success: true, message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    console.log(user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Check if user is admin (for admin login endpoint)
    // if (user.role !== "admin") {
    //   return res.status(403).json({ message: "Admin access required" });
    // }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Guard: prevent admins from logging into the customer store
    if (user.role === "admin") {
      return res.status(403).json({ success: false, message: "Please use the admin portal to login." });
    }

    // Set Access Token Cookie (Web)
    res.cookie("token", accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 🧪 TESTING: 30 seconds — change back to 3 * 24 * 60 * 60 * 1000 for production
    });

    // Set Refresh Token Cookie (Web)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    });

    res.status(200).json({
      user: formattedUser(user),
      token: accessToken, // Access token for Bearer (iOS/Mobile)
      refreshToken,       // Refresh token for storage (iOS/Mobile)
      success: true,
      message: "Login Successful",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Only allow admins to use this endpoint
    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admin accounts only." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Use a DIFFERENT cookie names so admin sessions never collide with customer sessions
    res.cookie("admin_token", accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("admin_refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: formattedUser(user),
      token: accessToken,
      refreshToken,
      success: true,
      message: "Admin Login Successful",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.logout = (req, res) => {
  // Clear all potential auth cookies
  ["token", "refreshToken", "admin_token", "admin_refreshToken"].forEach(c => {
    res.clearCookie(c, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
  });

  res.json({ success: true, message: "Logged out" });
};

exports.refreshToken = async (req, res) => {
  try {
    // 1. Get refresh token from Cookie OR Body (iOS/Mobile)
    const rf_token = req.cookies.refreshToken || req.cookies.admin_refreshToken || req.body.refreshToken;

    if (!rf_token) {
      return res.status(401).json({ success: false, message: "Refresh token missing" });
    }

    // 2. Verify Refresh Token
    const decoded = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);
    
    // 3. Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // 4. Generate NEW Access Token
    const accessToken = generateAccessToken(user);

    // 5. Update Cookie (if applicable)
    const cookieName = user.role === "admin" ? "admin_token" : "token";
    res.cookie(cookieName, accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      token: accessToken,
    });
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
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
