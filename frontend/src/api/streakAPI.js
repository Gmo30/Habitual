import { useState, useEffect, useCallback } from "react";

const API = "/api/users";

export function useStreak(user) {
  const [streak, setStreak] = useState(0);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [loadingStreak, setLoadingStreak] = useState(false);
  const [streakError, setStreakError] = useState(null);

  const fetchStreak = useCallback(async () => {
    if (!user) {
      setStreak(0);
      setHasCheckedInToday(false);
      return;
    }
    setLoadingStreak(true);
    try {
      const res = await fetch(`${API}/streak`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch streak");
      const data = await res.json();
      setStreak(data.streak);
      setHasCheckedInToday(data.hasCheckedInToday);
    } catch (err) {
      setStreakError(err.message);
    } finally {
      setLoadingStreak(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  const checkIn = async () => {
    if (hasCheckedInToday) return;
    try {
      const res = await fetch(`${API}/check-in`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to check in");
      const data = await res.json();
      setStreak(data.streak);
      setHasCheckedInToday(true);
    } catch (err) {
      setStreakError(err.message);
    }
  };

  return { streak, hasCheckedInToday, loadingStreak, streakError, checkIn };
}