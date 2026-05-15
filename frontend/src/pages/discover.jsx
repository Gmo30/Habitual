import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Avatar = ({ username, size = 44 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: "#3d5a3e", color: "white",
    fontSize: size * 0.45, fontWeight: "700",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, fontFamily: "Georgia, serif",
    textDecoration: "none",
  }}>
    {username?.[0]?.toUpperCase()}
  </div>
);

const UserCard = ({ u, isFollowing, onFollow }) => {
  const streak = u.streak?.current ?? 0;
  const match = u.matchScore;
  const matchColor = match >= 70 ? "#3d5a3e" : match >= 40 ? "#c2884a" : "#9ca3af";

  return (
    <div style={{
      background: "#fdf8f4",
      border: "1px solid #e8ddd4",
      borderRadius: "1rem",
      padding: "1rem 1.25rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
      transition: "box-shadow 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0 }}>
        <Link to={`/users/${u.username}`} style={{ textDecoration: "none" }}>
          <Avatar username={u.username} />
        </Link>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", minWidth: 0 }}>
          <Link
            to={`/users/${u.username}`}
            style={{ fontWeight: "600", color: "#1c1917", textDecoration: "none", fontSize: "0.95rem", fontFamily: "Georgia, serif" }}
          >
            {u.username}
          </Link>
          <span style={{ color: "#9ca3af", fontSize: "0.78rem", fontFamily: "sans-serif" }}>
            🔥 {streak} day streak
          </span>
          {match !== undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.1rem" }}>
              <div style={{ height: "4px", borderRadius: "9999px", background: "#e8ddd4", width: "100px", overflow: "hidden" }}>
                <div style={{ width: `${match}%`, height: "100%", background: matchColor, borderRadius: "9999px", transition: "width 0.4s ease" }} />
              </div>
              <span style={{ fontSize: "0.72rem", color: matchColor, fontFamily: "sans-serif", whiteSpace: "nowrap", fontWeight: "600" }}>
                {match}% match
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => onFollow(u)}
        style={{
          padding: "0.4rem 1.1rem",
          borderRadius: "9999px",
          fontWeight: "600",
          fontSize: "0.82rem",
          cursor: "pointer",
          fontFamily: "sans-serif",
          flexShrink: 0,
          transition: "all 0.2s",
          ...(isFollowing
            ? { background: "transparent", border: "1px solid #d1c9c0", color: "#9ca3af" }
            : { background: "#3d5a3e", border: "1px solid #3d5a3e", color: "white" }
          ),
        }}
        onMouseEnter={e => { if (isFollowing) { e.target.style.borderColor = "#ef4444"; e.target.style.color = "#ef4444"; } }}
        onMouseLeave={e => { if (isFollowing) { e.target.style.borderColor = "#d1c9c0"; e.target.style.color = "#9ca3af"; } }}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

const Discover = ({ user, following, followers, followUser, unfollowUser, getDiscover, searchUsers }) => {
  const [tab, setTab] = useState("discover"); // "discover" | "following" | "followers"
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDiscover();
        setUsers(data);
      } catch {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!query.trim()) { setSearchResults(null); return; }
    const timeout = setTimeout(async () => {
      try {
        const results = await searchUsers(query);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const isFollowingUser = (userId) => following.some((f) => f._id === userId);

  const handleFollow = async (u) => {
    try {
      if (isFollowingUser(u._id)) await unfollowUser(u._id);
      else await followUser(u._id);
    } catch {}
  };

  const tabs = [
    { id: "discover", label: "Discover" },
    { id: "following", label: `Following (${following.length})` },
    { id: "followers", label: `Followers (${followers?.length ?? 0})` },
  ];

  const discoverList = searchResults !== null ? searchResults : users;

  const tabStyle = (id) => ({
    padding: "0.5rem 1.25rem",
    borderRadius: "9999px",
    fontWeight: "600",
    fontSize: "0.85rem",
    cursor: "pointer",
    fontFamily: "sans-serif",
    border: "none",
    transition: "all 0.2s",
    background: tab === id ? "#3d5a3e" : "transparent",
    color: tab === id ? "white" : "#9ca3af",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0eb", fontFamily: "Georgia, serif", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#1c1917", margin: "0 0 0.25rem" }}>
            {tab === "discover" ? "Discover People" : tab === "following" ? "Following" : "Followers"}
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "0.85rem", margin: 0, fontFamily: "sans-serif" }}>
            {tab === "discover" ? "Find users and see how your habits compare" : "People you're connected with"}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.25rem", background: "#ede8e2", borderRadius: "9999px", padding: "0.25rem", marginBottom: "1.5rem", width: "fit-content" }}>
          {tabs.map(t => (
            <button key={t.id} style={tabStyle(t.id)} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* Search — only on discover tab */}
        {tab === "discover" && (
          <div style={{ position: "relative", marginBottom: "1.25rem" }}>
            <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "0.9rem" }}>🔍</span>
            <input
              type="text"
              placeholder="Find friends or search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "1px solid #e8ddd4",
                borderRadius: "9999px",
                padding: "0.75rem 1rem 0.75rem 2.5rem",
                fontSize: "0.9rem",
                fontFamily: "sans-serif",
                background: "#fdf8f4",
                color: "#1c1917",
                outline: "none",
              }}
            />
          </div>
        )}

        {error && <p style={{ color: "#ef4444", fontSize: "0.85rem", fontFamily: "sans-serif", marginBottom: "1rem" }}>{error}</p>}

        {/* DISCOVER TAB */}
        {tab === "discover" && (
          loading ? (
            <p style={{ color: "#9ca3af", textAlign: "center", fontFamily: "sans-serif", padding: "2rem 0" }}>Loading...</p>
          ) : discoverList.length === 0 ? (
            <div style={{ background: "#fdf8f4", border: "1px solid #e8ddd4", borderRadius: "1rem", padding: "2.5rem", textAlign: "center" }}>
              <p style={{ color: "#9ca3af", fontFamily: "sans-serif", fontSize: "0.9rem" }}>
                {searchResults !== null ? "No users found." : "No other users yet. Invite a friend!"}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {discoverList.map((u) => (
                <UserCard key={u._id} u={u} isFollowing={isFollowingUser(u._id)} onFollow={handleFollow} />
              ))}
            </div>
          )
        )}

        {/* FOLLOWING TAB */}
        {tab === "following" && (
          following.length === 0 ? (
            <div style={{ background: "#fdf8f4", border: "1px solid #e8ddd4", borderRadius: "1rem", padding: "2.5rem", textAlign: "center" }}>
              <p style={{ color: "#9ca3af", fontFamily: "sans-serif", fontSize: "0.9rem" }}>You're not following anyone yet.</p>
              <button onClick={() => setTab("discover")} style={{ marginTop: "1rem", background: "#3d5a3e", color: "white", border: "none", borderRadius: "9999px", padding: "0.5rem 1.25rem", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer", fontFamily: "sans-serif" }}>
                Discover People
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {following.map((u) => (
                <UserCard key={u._id} u={u} isFollowing={true} onFollow={handleFollow} />
              ))}
            </div>
          )
        )}

        {/* FOLLOWERS TAB */}
        {tab === "followers" && (
          (followers?.length ?? 0) === 0 ? (
            <div style={{ background: "#fdf8f4", border: "1px solid #e8ddd4", borderRadius: "1rem", padding: "2.5rem", textAlign: "center" }}>
              <p style={{ color: "#9ca3af", fontFamily: "sans-serif", fontSize: "0.9rem" }}>No followers yet — keep building those habits!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {followers.map((u) => (
                <UserCard key={u._id} u={u} isFollowing={isFollowingUser(u._id)} onFollow={handleFollow} />
              ))}
            </div>
          )
        )}

      </div>
    </div>
  );
};

export default Discover;