import { useState, useEffect, useCallback } from "react";

const API = "/api/habits";

export function useHabits(user) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const fetchHabits = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(API, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch habits");
      const data = await res.json();
      setHabits(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const addHabit = async (name) => {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add habit");
      }
      const newHabit = await res.json();
      setHabits((prev) => [...prev, newHabit]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const removeHabit = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete habit");
      setHabits((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleHabit = async (id) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h._id !== id) return h;
        const done = h.completedDates.includes(today);
        return {
          ...h,
          completedDates: done
            ? h.completedDates.filter((d) => d !== today)
            : [...h.completedDates, today],
        };
      })
    );
    try {
      const res = await fetch(`${API}/${id}/toggle`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to toggle habit");
      const updated = await res.json();
      setHabits((prev) => prev.map((h) => (h._id === updated._id ? updated : h)));
    } catch (err) {
      // Revert on failure
      fetchHabits();
      setError(err.message);
    }
  };

  const isCompletedToday = (habit) => habit.completedDates.includes(today);

  return { habits, loading, error, addHabit, removeHabit, toggleHabit, isCompletedToday };
}