import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Helper to set cookie (keeps code DRY)
const sendTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true, // Secure: Prevents JS access
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in prod
    sameSite: "strict", // CSRF protection
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days (matches JWT)
  });
};

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });
    const token = await generateToken(user._id);

    //Set the cookie
    sendTokenCookie(res, token);

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    
    //Set the cookie
    sendTokenCookie(res, token);
    
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// Logout (New route needed to clear the cookie)
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

// Me
router.get("/me", protect, async (req, res) => {
  res.status(200).json(req.user);
});

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export default router;