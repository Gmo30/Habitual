import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import "./navbar.css";

const DEFAULT_HABITS = [
  "Exercise",
  "Read",
  "Meditate",
  "Drink Water",
  "Journal",
  "Sleep 8 hours",
  "No Sugar",
  "Walk 10k Steps",
];

const Navbar = ({ user, setUser, habits, loading, addHabit, removeHabit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showHabitsModal, setShowHabitsModal] = useState(false);
  const [newHabit, setNewHabit] = useState("");
  const [inputError, setInputError] = useState("");
  const modalRef = useRef(null);

  //Daily streak vars
  const [streak, setStreak] = useState(0);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    const fetchStreakStatus = async () => {
      try {
        const response = await fetch('/api/users/streak', {
          credentials: 'include' // Ensures HttpOnly cookie is sent
        });
        if (response.ok) {
          const data = await response.json();
          setStreak(data.streak);
          setHasCheckedInToday(data.hasCheckedInToday);
        }
      } catch (error) {
        console.error("Failed to fetch streak status:", error);
      }
    };

    fetchStreakStatus();
  }, []);

  const handleClaimStreak = async () => {
    if (hasCheckedInToday) return;

    setIsClaiming(true);
    try {
      const response = await fetch('/api/users/check-in', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStreak(data.streak);
        setHasCheckedInToday(true);
      }
    } catch (error) {
      console.error("Failed to claim streak:", error);
    } finally {
      setIsClaiming(false);
    }
  };


  const handleLogout = async () => {
    try {
      await api.post("/api/users/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowHabitsModal(false);
      }
    };
    if (showHabitsModal)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showHabitsModal]);

  const habitNames = habits.map((h) => h.name);

  const handleQuickAdd = async (name) => {
    if (habitNames.includes(name)) {
      const habit = habits.find((h) => h.name === name);
      if (habit) await removeHabit(habit._id);
    } else {
      await addHabit(name);
    }
  };

  const handleCustomAdd = async () => {
    const trimmed = newHabit.trim();
    if (!trimmed) return;
    const result = await addHabit(trimmed);
    if (result.success) {
      setNewHabit("");
      setInputError("");
    } else {
      setInputError(result.message);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <div className="left">
          <Link to="/">Habitual</Link>
        </div>

        <div className="right">
          {user ? (
            <>
              {/* Interactive Claim Button */}
              {/* Wrap the button in a relative div with the 'group' class */}
<div className="relative group flex">
  <button
    onClick={handleClaimStreak}
    disabled={hasCheckedInToday || isClaiming}
    // Added px-4 py-1.5 back in for spacing, and border for the active state
    className={`flex items-center space-x-2 px-4 py-1.5 rounded-full font-semibold transition-all duration-300 ${
      hasCheckedInToday
        ? 'bg-white text-gray-800 cursor-default' 
        : 'bg-orange-500/10 border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white cursor-pointer shadow-[0_0_10px_rgba(249,115,22,0.3)]'
    }`}
  >
    <span className="text-lg">🔥</span>
    <span>{hasCheckedInToday ? `${streak}` : `Claim Streak (${streak})`}</span>
  </button>

  {/* Tooltip Content - Only renders and shows on hover if they have checked in */}
  {hasCheckedInToday && (
    <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap bg-gray-800 text-white text-xs px-3 py-1.5 rounded-md shadow-lg">
      {streak} Day Streak! • Claimed today
    </div>
  )}
</div>
              <button
                className="nav-habits-btn"
                onClick={() => setShowHabitsModal(true)}
              >
                Habits
                {habits.length > 0 && (
                  <span className="habits-badge">{habits.length}</span>
                )}
              </button>

              <Link
                to="/profile"
                className={`nav-link ${isActive("/profile") ? "active" : ""}`}
              >
                Profile
              </Link>

              <button className="btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      {showHabitsModal && (
        <div className="modal-overlay">
          <div className="habits-modal" ref={modalRef}>
            <div className="modal-header">
              <h2>Your Habits</h2>
              <button
                className="modal-close"
                onClick={() => setShowHabitsModal(false)}
              >
                ✕
              </button>
            </div>

            {habits.length > 0 && (
              <div className="modal-section">
                <p className="modal-label">Active Habits ({habits.length})</p>
                <ul className="active-habits-list">
                  {habits.map((habit) => (
                    <li key={habit._id} className="active-habit-item">
                      <span className="habit-dot">◆</span>
                      {habit.name}
                      <button
                        className="remove-btn"
                        onClick={() => removeHabit(habit._id)}
                        disabled={loading}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="modal-section">
              <p className="modal-label">Quick Add</p>
              <div className="habit-chips">
                {DEFAULT_HABITS.map((name) => (
                  <button
                    key={name}
                    className={`habit-chip ${habitNames.includes(name) ? "selected" : ""}`}
                    onClick={() => handleQuickAdd(name)}
                    disabled={loading}
                  >
                    {habitNames.includes(name) ? "✓ " : "+ "}
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-section">
              <p className="modal-label">Custom Habit</p>
              <div className="custom-habit-input">
                <input
                  type="text"
                  value={newHabit}
                  onChange={(e) => {
                    setNewHabit(e.target.value);
                    setInputError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomAdd()}
                  placeholder="e.g. Cold shower..."
                  className={`habit-input ${inputError ? "input-error-border" : ""}`}
                />
                <button
                  className="add-btn"
                  onClick={handleCustomAdd}
                  disabled={loading}
                >
                  Add
                </button>
              </div>
              {inputError && <p className="input-error-msg">{inputError}</p>}
            </div>

            <button
              className="done-btn"
              onClick={() => setShowHabitsModal(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;