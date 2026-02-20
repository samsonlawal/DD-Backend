const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const crypto = require("crypto");

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
    role: user.role,
    isActive: user.isActive,
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

    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
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

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });

  res.json({ message: "Logged out" });
};
