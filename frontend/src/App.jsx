import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Homepage from './pages/homepage';
import Profile from './pages/profile';
import Login from './pages/login';
import Navbar from './components/navbar';

function App() {
    return (
        <BrowserRouter>
        <Navbar />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="login" element ={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;