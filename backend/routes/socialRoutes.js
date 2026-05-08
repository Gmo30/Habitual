import express from "express";
import User from "../models/User.js";
import Habit from "../models/Habit.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Similarity function used to find users with habits similar to you rs
function jaccardScore(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 0;
  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return Math.round((intersection / union) * 100);
}

router.get("/search", protect, async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) {
    return res.status(400).json({ message: "Search query required" });
  }
  try {
    const users = await User.find({
      username: { $regex: q.trim(), $options: "i" },
      _id: { $ne: req.user._id },
    })
      .select("username streak")
      .limit(20);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.get("/discover", protect, async (req, res) => {
  try {
    const myHabits = await Habit.find({ user: req.user._id }).select("name");
    const mySet = new Set(myHabits.map((h) => h.name.toLowerCase().trim()));

    const others = await User.find({ _id: { $ne: req.user._id } }).select(
      "username streak following followers"
    );

    const allHabits = await Habit.find({
      user: { $in: others.map((u) => u._id) },
    }).select("user name");

    const habitsByUser = new Map();
    for (const h of allHabits) {
      const uid = h.user.toString();
      if (!habitsByUser.has(uid)) habitsByUser.set(uid, new Set());
      habitsByUser.get(uid).add(h.name.toLowerCase().trim());
    }

    const followingIds = new Set(req.user.following.map((id) => id.toString()));

    const result = others
      .map((u) => ({
        _id: u._id,
        username: u.username,
        streak: u.streak,
        followersCount: u.followers.length,
        followingCount: u.following.length,
        matchScore: jaccardScore(mySet, habitsByUser.get(u._id.toString()) || new Set()),
        isFollowing: followingIds.has(u._id.toString()),
      }))
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.get("/me/following", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "following",
      "username streak"
    );
    res.json(user.following.filter(Boolean));
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.get("/me/followers", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "followers",
      "username streak"
    );
    res.json(user.followers.filter(Boolean));
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.post("/follow/:targetId", protect, async (req, res) => {
  const { targetId } = req.params;
  try {
    if (targetId === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const target = await User.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFollowing = req.user.following.some(
      (id) => id.toString() === targetId
    );
    if (alreadyFollowing) {
      return res.status(400).json({ message: "Already following this user" });
    }

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: targetId } });
    await User.findByIdAndUpdate(targetId, { $addToSet: { followers: req.user._id } });

    const updated = await User.findById(req.user._id).select("following");
    res.json({ message: `Now following ${target.username}`, followingCount: updated.following.length });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.delete("/follow/:targetId", protect, async (req, res) => {
  const { targetId } = req.params;
  try {
    const target = await User.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = req.user.following.some(
      (id) => id.toString() === targetId
    );
    if (!isFollowing) {
      return res.status(400).json({ message: "You are not following this user" });
    }

    await User.findByIdAndUpdate(req.user._id, { $pull: { following: targetId } });
    await User.findByIdAndUpdate(targetId, { $pull: { followers: req.user._id } });

    const updated = await User.findById(req.user._id).select("following");
    res.json({ message: `Unfollowed ${target.username}`, followingCount: updated.following.length });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.get("/:username/profile", protect, async (req, res) => {
  try {
    const target = await User.findOne({ username: req.params.username }).select(
      "username streak following followers createdAt"
    );
    if (!target) {
      return res.status(404).json({ message: "User not found" });
    }

    const [targetHabits, myHabits] = await Promise.all([
      Habit.find({ user: target._id }).select("name completedDates"),
      Habit.find({ user: req.user._id }).select("name"),
    ]);

    const mySet = new Set(myHabits.map((h) => h.name.toLowerCase().trim()));
    const theirSet = new Set(targetHabits.map((h) => h.name.toLowerCase().trim()));

    const isFollowing = req.user.following.some(
      (id) => id.toString() === target._id.toString()
    );

    res.json({
      _id: target._id,
      username: target.username,
      streak: target.streak,
      followersCount: target.followers.length,
      followingCount: target.following.length,
      habits: targetHabits,
      isFollowing,
      matchScore: jaccardScore(mySet, theirSet),
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

export default router;
