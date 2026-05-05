import express from "express";
import Habit from "../models/Habit.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected — user must be logged in

// GET /api/habits — get all habits for the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.status(200).json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// POST /api/habits — create a new habit
router.post("/", protect, async (req, res) => {
  const { name } = req.body;
  try {
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Habit name is required" });
    }

    const existing = await Habit.findOne({ user: req.user._id, name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Habit already exists" });
    }

    const habit = await Habit.create({ user: req.user._id, name: name.trim() });
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// DELETE /api/habits/:id — delete a habit
router.delete("/:id", protect, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    await habit.deleteOne();
    res.status(200).json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// PATCH /api/habits/:id/toggle — toggle today's completion
router.patch("/:id/toggle", protect, async (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const alreadyDone = habit.completedDates.includes(today);
    if (alreadyDone) {
      habit.completedDates = habit.completedDates.filter((d) => d !== today);
    } else {
      habit.completedDates.push(today);
    }

    await habit.save();
    res.status(200).json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

export default router;