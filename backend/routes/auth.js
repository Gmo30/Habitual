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

//Streak Route
router.post('/check-in', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const now = new Date();

    // Standardize to UTC midnight to avoid timezone timezone jumps
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const lastCheckIn = user.streak.lastCheckIn
      ? new Date(Date.UTC(user.streak.lastCheckIn.getUTCFullYear(), user.streak.lastCheckIn.getUTCMonth(), user.streak.lastCheckIn.getUTCDate()))
      : null;

    let responseData = { streak: user.streak.current, updated: false };

    if (!lastCheckIn) {
      // First time checking in
      user.streak.current = 1;
      user.streak.longest = 1;
      user.streak.lastCheckIn = now;
      responseData = { streak: 1, updated: true };
    } else {
      const diffTime = Math.abs(today - lastCheckIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Checked in yesterday - increment streak
        user.streak.current += 1;
        user.streak.lastCheckIn = now;
        if (user.streak.current > user.streak.longest) {
          user.streak.longest = user.streak.current;
        }
        responseData = { streak: user.streak.current, updated: true };
      } else if (diffDays > 1) {
        // Missed a day - reset streak
        user.streak.current = 1;
        user.streak.lastCheckIn = now;
        responseData = { streak: 1, updated: true };
      }
      // If diffDays === 0, they already checked in today. Do nothing.
    }

    if (responseData.updated) {
      await user.save();
    }

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: 'Server error during check-in' });
  }
});

// NEW: Get current streak status on page load
router.get('/streak', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    
    let hasCheckedInToday = false;
    
    if (user.streak.lastCheckIn) {
      const lastCheckInDate = new Date(Date.UTC(
        user.streak.lastCheckIn.getUTCFullYear(), 
        user.streak.lastCheckIn.getUTCMonth(), 
        user.streak.lastCheckIn.getUTCDate()
      ));
      
      if (today.getTime() === lastCheckInDate.getTime()) {
        hasCheckedInToday = true;
      }
    }

    res.json({ 
      streak: user.streak.current, 
      hasCheckedInToday 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching streak' });
  }
});

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export default router;