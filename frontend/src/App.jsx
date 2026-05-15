import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Profile from './pages/profile';
import Login from './pages/login';
import Register from './pages/Register';
import Discover from './pages/discover';
import UserProfile from './pages/UserProfile';
import Navbar from './components/navbar';
import { useEffect, useState } from 'react';
import api from './api/axios';
import { useHabits } from './api/habitAPI';
import { useSocial } from './api/socialAPI';
import { useStreak } from './api/streakAPI';
import Habits from './pages/Habits';
import Dashboard from './pages/Dashboard';

function App() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { habits, loading, addHabit, removeHabit, toggleHabit, isCompletedToday} = useHabits(user);
    const { following, followers, followUser, unfollowUser, searchUsers, getDiscover, getUserProfile } = useSocial(user);
    const { streak, hasCheckedInToday, checkIn } = useStreak(user);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log("ATTEMPTING TO FETCH USER...");
                const res = await api.get("/api/users/me");
                console.log("SUCCESS:", res.data);
                setUser(res.data);
            } catch (error) {
                setUser(null);
                console.log("FETCH FAILED!", error);
                setError("Not authenticated");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Navbar user={user} setUser={setUser} />
            <Routes>
                <Route path="/" element={<Dashboard user={user} error={error} habits={habits} toggleHabit={toggleHabit} isCompletedToday={isCompletedToday} streak={streak} hasCheckedInToday={hasCheckedInToday} checkIn={checkIn}/>} />
                <Route
                    path="/profile"
                    element={user ? <Profile user={user} habits={habits} following={following} followers={followers} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/discover"
                    element={user ? <Discover user={user} following={following} followers={followers} followUser={followUser} unfollowUser={unfollowUser} getDiscover={getDiscover} searchUsers={searchUsers} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/users/:username"
                    element={user ? <UserProfile user={user} following={following} followers={followers} followUser={followUser} unfollowUser={unfollowUser} getUserProfile={getUserProfile} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/login"
                    element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
                />
                <Route
                    path="/register"
                    element={user ? <Navigate to="/" /> : <Register setUser={setUser} />}
                />
                <Route
                    path="/habits"
                    element={user ? <Habits habits={habits} loading={loading} addHabit={addHabit} removeHabit={removeHabit} /> : <Navigate to="/login" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;