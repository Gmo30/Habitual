import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./discover.css";

const Discover = ({ user, following, followUser, unfollowUser, getDiscover, searchUsers }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null); // null = not searching

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDiscover();
        setUsers(data);
      } catch (err) {
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

  const isFollowing = (userId) => following.some((f) => f._id === userId);

  const handleFollow = async (u) => {
    try {
      if (isFollowing(u._id)) {
        await unfollowUser(u._id);
      } else {
        await followUser(u._id);
      }
    } catch (err) {
      // silently fail — button state updates via following prop
    }
  };

  const displayList = searchResults !== null ? searchResults : users;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mb-4">
        <h2 className="text-2xl font-bold mb-1 text-gray-800">Discover People</h2>
        <p className="text-gray-600 mb-4">Find users and see how your habits compare</p>
        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-blue-400"
        />
      </div>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      <div className="w-full max-w-2xl">
        {displayList.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600">
              {searchResults !== null ? "No users found." : "No other users yet. Invite a friend!"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {displayList.map((u) => (
              <div key={u._id} className="bg-white p-4 border rounded-lg shadow-sm flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1 min-w-0">
                  <Link
                    to={`/users/${u.username}`}
                    className="text-lg font-semibold text-gray-800 hover:text-blue-500"
                  >
                    {u.username}
                  </Link>
                  <span className="text-gray-600 text-sm">
                    🔥 {u.streak?.current ?? 0} day streak
                    {u.matchScore !== undefined && (
                      <span className="ml-2 text-emerald-600 font-medium">{u.matchScore}% habit match</span>
                    )}
                  </span>
                </div>
                <button
                  onClick={() => handleFollow(u)}
                  className={`px-4 py-1.5 rounded-lg font-semibold text-sm shrink-0 ${
                    isFollowing(u._id)
                      ? "border border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-500"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isFollowing(u._id) ? "Unfollow" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
