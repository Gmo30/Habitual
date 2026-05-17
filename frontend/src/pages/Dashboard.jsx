import React, { useState } from "react";
import { Link } from "react-router-dom";

const getMotivation = (streak) => {
  if (streak === 0) return "Start your streak today!";
  if (streak < 3) return "Great start";
  if (streak < 7) return "You're building momentum";
  if (streak < 14) return "You're doing great";
  if (streak < 30) return "Consistency is the secret of change. You've been mindful for two weeks straight";
  return "You're unstoppable";
};

// 5-row x 7-col grid (35 days) ending today
const buildHeatmapData = (habits) => {
  const today = new Date();
  const days = [];
  for (let i = 34; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const completed = habits?.filter(h => h.completedDates?.includes(dateStr)).length ?? 0;
    const total = habits?.length ?? 0;
    days.push({ dateStr, completed, total, date: d });
  }
  return days;
};

const HeatmapCell = ({ day, total }) => {
  const [hovered, setHovered] = useState(false);
  const ratio = total > 0 ? day.completed / total : 0;

  let bg;
  if (total === 0 || day.completed === 0) bg = "#ede8e2";
  else if (ratio <= 0.33) bg = "#c8dfc8";
  else if (ratio <= 0.66) bg = "#7aab7a";
  else bg = "#3d5a3e";

  const label = day.date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: "36px", height: "36px", borderRadius: "6px",
        background: bg,
        cursor: "default",
        transition: "transform 0.1s",
        transform: hovered ? "scale(1.15)" : "scale(1)",
      }} />
      {hovered && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
          transform: "translateX(-50%)",
          background: "#1c1917", color: "white",
          fontSize: "0.7rem", fontFamily: "sans-serif",
          padding: "0.3rem 0.6rem", borderRadius: "0.4rem",
          whiteSpace: "nowrap", zIndex: 10,
          pointerEvents: "none",
        }}>
          {label}: {day.completed}/{total} habits
        </div>
      )}
    </div>
  );
};

const Heatmap = ({ habits }) => {
  const days = buildHeatmapData(habits);
  const total = habits?.length ?? 0;
  const rows = [days.slice(0, 7), days.slice(7, 14), days.slice(14, 21), days.slice(21, 28), days.slice(28, 35)];
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={{ background: "#f5f0eb", borderRadius: "1rem", padding: "1.5rem", border: "1px solid #e8ddd4" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#1c1917", margin: "0 0 0.2rem", fontFamily: "Georgia, serif" }}>Habit Activity</h3>
          <p style={{ color: "#9ca3af", fontSize: "0.8rem", margin: 0, fontFamily: "sans-serif" }}>Visualize your progress over time.</p>
        </div>
        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "sans-serif", fontSize: "0.72rem", color: "#9ca3af" }}>
          <span>Less</span>
          {["#ede8e2", "#c8dfc8", "#7aab7a", "#3d5a3e"].map(c => (
            <div key={c} style={{ width: "14px", height: "14px", borderRadius: "3px", background: c }} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Day labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 36px)", gap: "6px", marginBottom: "4px" }}>
        {dayLabels.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "0.65rem", color: "#9ca3af", fontFamily: "sans-serif" }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: "grid", gridTemplateColumns: "repeat(7, 36px)", gap: "6px" }}>
            {row.map((day) => (
              <HeatmapCell key={day.dateStr} day={day} total={total} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = ({ user, error, habits, toggleHabit, isCompletedToday, streak = 0, hasCheckedInToday, checkIn, longestStreak = 0 }) => {
  const completedCount = habits?.filter(isCompletedToday).length ?? 0;
  const totalCount = habits?.length ?? 0;
  const consistency = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0eb", fontFamily: "Georgia, serif", padding: "2rem 1.5rem" }}>
      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: "0.75rem 1rem", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.875rem" }}>
          {error}
        </div>
      )}

      {user ? (
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Row 1: Streak cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>

            {/* Daily Streak */}
            <div style={{
              background: "#3d5a3e", borderRadius: "1.25rem", padding: "2rem",
              color: "white", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
              <p style={{ fontSize: "0.8rem", color: "#a8c5a0", letterSpacing: "0.08em", marginBottom: "0.75rem", textTransform: "uppercase", fontFamily: "sans-serif" }}>Daily Streak</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <span style={{ fontSize: "4.5rem", fontWeight: "700", lineHeight: 1 }}>{streak}</span>
                <span style={{ fontSize: "1.75rem", color: "#a8c5a0", fontWeight: "400" }}>{streak === 1 ? "Day" : "Days"}</span>
              </div>
              <p style={{ color: "#c8dfc8", fontSize: "0.9rem", fontFamily: "sans-serif", marginBottom: "1.5rem" }}>
                {getMotivation(streak)}, {user.username}!
              </p>
              <button
                onClick={checkIn}
                disabled={hasCheckedInToday}
                style={{
                  padding: "0.5rem 1.5rem", borderRadius: "9999px", border: "none",
                  background: hasCheckedInToday ? "rgba(255,255,255,0.12)" : "#e8a87c",
                  color: hasCheckedInToday ? "#a8c5a0" : "#3d2b1f",
                  fontWeight: "600", fontSize: "0.875rem", fontFamily: "sans-serif",
                  cursor: hasCheckedInToday ? "default" : "pointer", transition: "all 0.2s",
                }}
              >
                {hasCheckedInToday ? "✓ Checked In" : "Check In"}
              </button>
            </div>

            {/* Longest Streak */}
            <div style={{ background: "#fdf8f4", borderRadius: "1.25rem", padding: "2rem", border: "1px solid #e8ddd4" }}>
              <p style={{ fontSize: "0.8rem", color: "#9ca3af", letterSpacing: "0.08em", marginBottom: "0.75rem", textTransform: "uppercase", fontFamily: "sans-serif" }}>Longest Streak</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <span style={{ fontSize: "4.5rem", fontWeight: "700", lineHeight: 1, color: "#1c1917" }}>{Math.max(longestStreak, streak)}</span>
                <span style={{ fontSize: "1.75rem", color: "#9ca3af", fontWeight: "400" }}>{Math.max(longestStreak, streak) === 1 ? "Day" : "Days"}</span>
              </div>
              {streak > 0 && (
                <p style={{ color: "#e8a87c", fontSize: "0.875rem", fontFamily: "sans-serif", fontStyle: "italic" }}>New record in sight 🎯</p>
              )}
            </div>
          </div>

          {/* Row 2: Habits + Right sidebar */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>

            {/* Daily Habits */}
            <div style={{ background: "#fdf8f4", borderRadius: "1.25rem", padding: "2rem", border: "1px solid #e8ddd4" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#1c1917", margin: "0 0 0.2rem", fontFamily: "Georgia, serif" }}>Daily Habits</h2>
                  <p style={{ color: "#9ca3af", fontSize: "0.82rem", margin: 0, fontFamily: "sans-serif" }}>Focus on today's rhythm</p>
                </div>
                <Link to="/habits" style={{ color: "#6b7280", fontSize: "0.8rem", textDecoration: "none", fontFamily: "sans-serif", marginTop: "0.25rem" }}>
                  Edit List ✏️
                </Link>
              </div>

              {habits?.length === 0 ? (
                <p style={{ color: "#9ca3af", textAlign: "center", padding: "2rem 0", fontFamily: "sans-serif" }}>
                  No habits yet. <Link to="/habits" style={{ color: "#3d5a3e" }}>Add some!</Link>
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {habits?.map((habit) => {
                    const done = isCompletedToday(habit);
                    return (
                      <div key={habit._id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "1rem 1.25rem",
                        background: done ? "#f0f5f0" : "white",
                        borderRadius: "0.875rem",
                        border: `1px solid ${done ? "#c8dfc8" : "#f0ebe5"}`,
                        transition: "all 0.2s",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <div style={{
                            width: "40px", height: "40px", borderRadius: "50%",
                            background: done ? "#e0f0e0" : "#f5f0eb",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "1.1rem", flexShrink: 0,
                          }}>🌿</div>
                          <span style={{
                            fontWeight: "600", color: done ? "#9ca3af" : "#1c1917",
                            textDecoration: done ? "line-through" : "none",
                            fontSize: "0.95rem", fontFamily: "sans-serif",
                          }}>{habit.name}</span>
                        </div>
                        <button
                          onClick={() => toggleHabit(habit._id)}
                          style={{
                            width: "30px", height: "30px", borderRadius: "50%",
                            border: `2px solid ${done ? "#3d5a3e" : "#d1c9c0"}`,
                            background: done ? "#3d5a3e" : "transparent",
                            color: "white", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.8rem", flexShrink: 0, transition: "all 0.2s",
                          }}
                        >{done ? "✓" : ""}</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Habit Consistency */}
              <div style={{ background: "#fdf8f4", borderRadius: "1.25rem", padding: "1.5rem", border: "1px solid #e8ddd4" }}>
                <p style={{ fontSize: "0.78rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.4rem", fontFamily: "sans-serif" }}>↗ Habit Consistency</p>
                <p style={{ fontSize: "2.75rem", fontWeight: "700", color: "#1c1917", margin: "0 0 0.75rem", lineHeight: 1 }}>
                  {consistency}<span style={{ fontSize: "1rem", color: "#9ca3af", fontWeight: "400" }}>%</span>
                </p>
                <div style={{ background: "#e8ddd4", borderRadius: "9999px", height: "6px", overflow: "hidden" }}>
                  <div style={{ width: `${consistency}%`, height: "100%", background: "#3d5a3e", borderRadius: "9999px", transition: "width 0.6s ease" }} />
                </div>
                <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.5rem", fontFamily: "sans-serif" }}>{completedCount} of {totalCount} done today</p>
              </div>

              {/* Recently Completed */}
              <div style={{ background: "#fdf8f4", borderRadius: "1.25rem", padding: "1.5rem", border: "1px solid #e8ddd4", flex: 1 }}>
                <p style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1c1917", margin: "0 0 1rem", fontFamily: "Georgia, serif" }}>Recently Completed</p>
                {completedCount === 0 ? (
                  <p style={{ color: "#9ca3af", fontSize: "0.82rem", fontFamily: "sans-serif" }}>Nothing yet — start checking off habits!</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                    {habits?.filter(isCompletedToday).slice(0, 4).map((habit) => (
                      <div key={habit._id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{
                          width: "34px", height: "34px", borderRadius: "50%", background: "#e0f0e0",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.8rem", color: "#3d5a3e", fontWeight: "700", flexShrink: 0,
                        }}>✓</div>
                        <div>
                          <p style={{ margin: 0, fontWeight: "600", fontSize: "0.875rem", color: "#1c1917", fontFamily: "sans-serif" }}>{habit.name}</p>
                          <p style={{ margin: 0, fontSize: "0.73rem", color: "#9ca3af", fontFamily: "sans-serif" }}>Completed today</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 3: Heatmap full width */}
          <Heatmap habits={habits} />

        </div>
      ) : (
        /* LOGGED OUT */
        <div style={{
          background: "linear-gradient(135deg, #fdf8f4 0%, #e8f0e8 50%, #d4e8d4 100%)",
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "2rem", margin: "-2rem -1.5rem",
        }}>
          <h1 style={{ fontSize: "4rem", fontWeight: "700", color: "#1c1917", marginBottom: "1rem" }}>Welcome to Habitual</h1>
          <p style={{ fontSize: "1.2rem", color: "#6b7280", marginBottom: "2.5rem", maxWidth: "480px", lineHeight: 1.6, fontFamily: "sans-serif" }}>
            Track habits, stay organized, and build consistency.
          </p>
          <Link to="/register" style={{
            background: "#3d5a3e", color: "white", padding: "0.875rem 2.25rem",
            borderRadius: "9999px", textDecoration: "none", fontWeight: "600",
            fontSize: "1rem", fontFamily: "sans-serif",
          }}>Get Started</Link>

          <div style={{ display: "flex", gap: "1.5rem", marginTop: "3rem", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { img: "https://cdn.pixabay.com/photo/2015/08/26/18/20/info-908889_960_720.png", text: "Organize your habits easily" },
              { img: "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331258_1280.png", text: "Make friends and find community" },
              { img: "https://cdn.pixabay.com/photo/2024/11/20/08/53/checklist-9210780_1280.png", text: "Track progress daily" },
            ].map((card, i) => (
              <div key={i} style={{
                background: "white", borderRadius: "1rem", padding: "1.5rem",
                width: "190px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
              }}>
                <img src={card.img} style={{ width: "75px", height: "75px", objectFit: "contain" }} alt="" />
                <p style={{ color: "#6b7280", fontSize: "0.875rem", textAlign: "center", margin: 0, fontFamily: "sans-serif" }}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;