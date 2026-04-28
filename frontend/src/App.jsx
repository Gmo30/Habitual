import { BrowserRouter, Routes, Route, Link, Navigate} from 'react-router-dom';
import Homepage from './pages/homepage';
import Profile from './pages/profile';
import Login from './pages/login';
import Register from './pages/Register';
import Navbar from './components/navbar';
import { useEffect, useState } from 'react';
import api from './api/axios';


function App() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    console.log(user);

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
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-xl text-white">Loading...</div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Navbar user={user} setUser={setUser} />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                    path="/login"
                    element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
                />
                <Route
                    path="/register"
                    element={user ? <Navigate to="/" /> : <Register setUser={setUser} />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;