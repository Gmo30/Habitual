import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import api from "../api/axios";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/api/users/logout");

      setUser(null);

      navigate("/login");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  return (

    <nav className="navbar">
      <div className="left">
        <Link to="/">Habitual</Link>
      </div>

      <div className="right">
        {user ? (
          <button
            className="bg-red-500"
            onClick={handleLogout}>
            Logout
          </button>
        ) : (<>
          <Link to="/login">Log in</Link>
          <Link to="/profile">Profile</Link>
        </>)
        }
      </div>

    </nav>

  );
}

export default Navbar;