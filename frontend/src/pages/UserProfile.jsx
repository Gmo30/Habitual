import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = ({ user, following, followUser, unfollowUser, getUserProfile }) => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (user && username === user.username) {
      navigate("/profile", { replace: true });
      return;
    }
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await getUserProfile(username);
        setProfile(data);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username, user]);

  const isFollowing = profile
    ? following.some((f) => f._id === profile._id)
    : false;

  const handleFollow = async () => {
    setActionError("");
    try {
      if (isFollowing) {
        await unfollowUser(profile._id);
        setProfile((prev) => ({ ...prev, followersCount: prev.followersCount - 1 }));
      } else {
        await followUser(profile._id);
        setProfile((prev) => ({ ...prev, followersCount: prev.followersCount + 1 }));
      }
    } catch (err) {
      setActionError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-800 text-xl">User not found.</p>
        <button onClick={() => navigate(-1)} className="text-blue-500 underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">

      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-4 w-full max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile.username}</h2>
            <p className="text-gray-600 text-sm">
              {profile.followersCount} followers · {profile.followingCount} following · {profile.habits.length} habits
            </p>
            <p className="text-gray-600 text-sm mt-1">
              🔥 {profile.streak.current} day streak · longest: {profile.streak.longest}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className="text-emerald-600 font-semibold text-sm">{profile.matchScore}% habit match</span>
            <button
              onClick={handleFollow}
              className={`px-4 py-1.5 rounded-lg font-semibold text-sm ${
                isFollowing
                  ? "border border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-500"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>
        {actionError && <p className="text-red-500 text-sm mt-2">{actionError}</p>}
      </div>

      {/* Habits */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Habits</h2>
        {profile.habits.length === 0 ? (
          <p className="text-gray-600">No habits yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.habits.map((habit) => (
              <div key={habit._id} className="p-4 border rounded-lg shadow-sm bg-white">
                <h3 className="text-xl font-semibold text-emerald-600">{habit.name}</h3>
                <p className="text-gray-500 text-sm">{habit.completedDates.length} completions</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default UserProfile;
