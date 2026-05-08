import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./profile.css";

const Profile = ({ user, habits, following, followers }) => {
  const [activeTab, setActiveTab] = useState("habits");

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">

      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-4 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-1 text-gray-800">{user.username}</h2>
        <p className="text-gray-600">{user.email}</p>
        {user.createdAt && (
          <p className="text-gray-400 text-sm mt-1">Member since {memberSince}</p>
        )}
      </div>

      {/* Streak */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-4 w-full max-w-2xl flex gap-8">
        <div>
          <p className="text-2xl font-bold text-gray-800">🔥 {user.streak?.current ?? 0}</p>
          <p className="text-gray-600 text-sm">Current streak</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{user.streak?.longest ?? 0}</p>
          <p className="text-gray-600 text-sm">Longest streak</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex border-b">
          {[
            { key: "habits",    label: `Habits (${habits.length})` },
            { key: "following", label: `Following (${following.length})` },
            { key: "followers", label: `Followers (${followers.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "habits" && (
            <>
              {habits.length === 0 ? (
                <p className="text-gray-600 text-center">No habits yet. Add some from the navbar!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {habits.map((habit) => (
                    <div key={habit._id} className="p-4 border rounded-lg shadow-sm bg-white">
                      <h3 className="text-xl font-semibold text-emerald-600">{habit.name}</h3>
                      <p className="text-gray-500 text-sm">{habit.completedDates.length} completions</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "following" && (
            <>
              {following.length === 0 ? (
                <p className="text-gray-600 text-center">
                  Not following anyone yet.{" "}
                  <Link to="/discover" className="text-blue-500 underline">Discover people!</Link>
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {following.map((u) => (
                    <Link to={`/users/${u.username}`} key={u._id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <div className="w-9 h-9 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center flex-shrink-0">
                        {u.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{u.username}</p>
                        <p className="text-gray-500 text-sm">🔥 {u.streak?.current ?? 0} day streak</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "followers" && (
            <>
              {followers.length === 0 ? (
                <p className="text-gray-600 text-center">No followers yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {followers.map((u) => (
                    <Link to={`/users/${u.username}`} key={u._id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <div className="w-9 h-9 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center flex-shrink-0">
                        {u.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{u.username}</p>
                        <p className="text-gray-500 text-sm">🔥 {u.streak?.current ?? 0} day streak</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default Profile;
