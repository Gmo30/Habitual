import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { useHabits } from "../api/habitAPI";
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

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showHabitsModal, setShowHabitsModal] = useState(false);
  const [newHabit, setNewHabit] = useState("");
  const [inputError, setInputError] = useState("");
  const modalRef = useRef(null);

  const { habits, loading, addHabit, removeHabit } = useHabits(user);

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

              <button className="bg-red-500" onClick={handleLogout}>
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