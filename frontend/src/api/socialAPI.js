import { useState, useEffect, useCallback } from "react";
import api from "./axios";

export function useSocial(user) {
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loadingSocial, setLoadingSocial] = useState(false);
  const [socialError, setSocialError] = useState(null);

  const fetchFollowData = useCallback(async () => {
    if (!user) {
      setFollowing([]);
      setFollowers([]);
      return;
    }
    setLoadingSocial(true);
    try {
      const [followingRes, followersRes] = await Promise.all([
        api.get("/api/users/me/following"),
        api.get("/api/users/me/followers"),
      ]);
      setFollowing(followingRes.data);
      setFollowers(followersRes.data);
    } catch (err) {
      setSocialError(err.message);
    } finally {
      setLoadingSocial(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFollowData();
  }, [fetchFollowData]);

  const followUser = async (targetId) => {
    try {
      await api.post(`/api/users/follow/${targetId}`);
      await fetchFollowData();
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to follow user");
    }
  };

  const unfollowUser = async (targetId) => {
    try {
      await api.delete(`/api/users/follow/${targetId}`);
      setFollowing((prev) => prev.filter((u) => u._id !== targetId));
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to unfollow user");
    }
  };

  const searchUsers = async (query) => {
    const { data } = await api.get(`/api/users/search?q=${encodeURIComponent(query)}`);
    return data;
  };

  const getDiscover = async () => {
    const { data } = await api.get("/api/users/discover");
    return data;
  };

  const getUserProfile = async (username) => {
    const { data } = await api.get(`/api/users/${username}/profile`);
    return data;
  };

  return {
    following,
    followers,
    loadingSocial,
    socialError,
    followUser,
    unfollowUser,
    searchUsers,
    getDiscover,
    getUserProfile,
  };
}
