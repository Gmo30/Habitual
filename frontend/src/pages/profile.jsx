import React, { useState } from "react";
import { Link } from "react-router-dom";

const Profile = ({ user, habits, following, followers }) => {
  const [activeTab, setActiveTab] = useState("habits");

  if (!user) return null;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  const currentStreak = user.streak?.current ?? 0;
  const longestStreak = user.streak?.longest ?? 0;

  const tabs = [
    { key: "habits",    label: `Habits (${habits.length})` },
    { key: "following", label: `Following (${following.length})` },
    { key: "followers", label: `Followers (${followers.length})` },
  ];

  const s = (key) => ({
    flex: 1,
    padding: "0.6rem 0.5rem",
    borderRadius: "9999px",
    border: "none",
    fontWeight: "600",
    fontSize: "0.83rem",
    cursor: "pointer",
    fontFamily: "sans-serif",
    transition: "all 0.2s",
    background: activeTab === key ? "#3d5a3e" : "transparent",
    color: activeTab === key ? "white" : "#9ca3af",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0eb", fontFamily: "Georgia, serif", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Header card */}
        <div style={{ background: "#fdf8f4", borderRadius: "1.25rem", padding: "2rem", border: "1px solid #e8ddd4", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "#3d5a3e", color: "white",
            fontSize: "2rem", fontWeight: "700",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: "700", color: "#1c1917", margin: "0 0 0.2rem" }}>{user.username}</h2>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: "0 0 0.2rem", fontFamily: "sans-serif" }}>{user.email}</p>
            {memberSince && (
              <p style={{ color: "#9ca3af", fontSize: "0.78rem", margin: 0, fontFamily: "sans-serif" }}>Member since {memberSince}</p>
            )}
          </div>
        </div>

        {/* Streak card */}
        <div style={{ background: "#3d5a3e", borderRadius: "1.25rem", padding: "1.75rem 2rem", display: "flex", alignItems: "center", gap: "2.5rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "130px", height: "130px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div>
            <p style={{ fontSize: "0.75rem", color: "#a8c5a0", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.3rem", fontFamily: "sans-serif" }}>Current Streak</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
              <span style={{ fontSize: "2.75rem", fontWeight: "700", color: "white", lineHeight: 1 }}>{currentStreak}</span>
              <span style={{ color: "#a8c5a0", fontSize: "1rem", fontFamily: "sans-serif" }}>{currentStreak === 1 ? "day" : "days"}</span>
            </div>
          </div>
          <div style={{ width: "1px", height: "48px", background: "rgba(255,255,255,0.15)" }} />
          <div>
            <p style={{ fontSize: "0.75rem", color: "#a8c5a0", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.3rem", fontFamily: "sans-serif" }}>Longest Streak</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
              <span style={{ fontSize: "2.75rem", fontWeight: "700", color: "white", lineHeight: 1 }}>{longestStreak}</span>
              <span style={{ color: "#a8c5a0", fontSize: "1rem", fontFamily: "sans-serif" }}>{longestStreak === 1 ? "day" : "days"}</span>
            </div>
          </div>
        </div>

        {/* Tabs + content */}
        <div style={{ background: "#fdf8f4", borderRadius: "1.25rem", border: "1px solid #e8ddd4", overflow: "hidden" }}>
          {/* Tab bar */}
          <div style={{ display: "flex", gap: "0.25rem", padding: "0.75rem", background: "#f5f0eb", borderBottom: "1px solid #e8ddd4" }}>
            {tabs.map(t => (
              <button key={t.key} style={s(t.key)} onClick={() => setActiveTab(t.key)}>{t.label}</button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ padding: "1.5rem" }}>

            {/* Habits */}
            {activeTab === "habits" && (
              habits.length === 0 ? (
                <p style={{ color: "#9ca3af", textAlign: "center", fontFamily: "sans-serif", fontSize: "0.9rem", padding: "1rem 0" }}>
                  No habits yet. Add some from the navbar!
                </p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "0.875rem" }}>
                  {habits.map((habit) => (
                    <div key={habit._id} style={{
                      background: "white", borderRadius: "0.875rem",
                      border: "1px solid #e8ddd4", padding: "1rem 1.25rem",
                      display: "flex", flexDirection: "column", gap: "0.35rem",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "1rem" }}>🌿</span>
                        <h3 style={{ fontWeight: "700", color: "#3d5a3e", fontSize: "0.95rem", margin: 0, fontFamily: "Georgia, serif" }}>{habit.name}</h3>
                      </div>
                      <p style={{ color: "#9ca3af", fontSize: "0.75rem", margin: 0, fontFamily: "sans-serif" }}>
                        {habit.completedDates.length} completion{habit.completedDates.length !== 1 ? "s" : ""}
                      </p>
                      <p style={{ color: "#c4b8ac", fontSize: "0.73rem", margin: 0, fontFamily: "sans-serif" }}>
                        Since {new Date(habit.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </p>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Following */}
            {activeTab === "following" && (
              following.length === 0 ? (
                <p style={{ color: "#9ca3af", textAlign: "center", fontFamily: "sans-serif", fontSize: "0.9rem", padding: "1rem 0" }}>
                  Not following anyone yet.{" "}
                  <Link to="/discover" style={{ color: "#3d5a3e" }}>Discover people!</Link>
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {following.map((u) => (
                    <Link to={`/users/${u.username}`} key={u._id} style={{
                      display: "flex", alignItems: "center", gap: "0.875rem",
                      padding: "0.75rem 1rem", borderRadius: "0.875rem",
                      background: "white", border: "1px solid #e8ddd4",
                      textDecoration: "none", transition: "border-color 0.2s",
                    }}>
                      <div style={{
                        width: "38px", height: "38px", borderRadius: "50%",
                        background: "#3d5a3e", color: "white",
                        fontWeight: "700", fontSize: "1rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, fontFamily: "Georgia, serif",
                      }}>
                        {u.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: "600", color: "#1c1917", fontSize: "0.9rem", margin: 0, fontFamily: "sans-serif" }}>{u.username}</p>
                        <p style={{ color: "#9ca3af", fontSize: "0.78rem", margin: 0, fontFamily: "sans-serif" }}>🔥 {u.streak?.current ?? 0} day streak</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            )}

            {/* Followers */}
            {activeTab === "followers" && (
              followers.length === 0 ? (
                <p style={{ color: "#9ca3af", textAlign: "center", fontFamily: "sans-serif", fontSize: "0.9rem", padding: "1rem 0" }}>
                  No followers yet — keep building those habits!
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {followers.map((u) => (
                    <Link to={`/users/${u.username}`} key={u._id} style={{
                      display: "flex", alignItems: "center", gap: "0.875rem",
                      padding: "0.75rem 1rem", borderRadius: "0.875rem",
                      background: "white", border: "1px solid #e8ddd4",
                      textDecoration: "none", transition: "border-color 0.2s",
                    }}>
                      <div style={{
                        width: "38px", height: "38px", borderRadius: "50%",
                        background: "#3d5a3e", color: "white",
                        fontWeight: "700", fontSize: "1rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, fontFamily: "Georgia, serif",
                      }}>
                        {u.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: "600", color: "#1c1917", fontSize: "0.9rem", margin: 0, fontFamily: "sans-serif" }}>{u.username}</p>
                        <p style={{ color: "#9ca3af", fontSize: "0.78rem", margin: 0, fontFamily: "sans-serif" }}>🔥 {u.streak?.current ?? 0} day streak</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;