import { Link } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  return (

    <nav className="navbar">
      <div className="left">
        <Link to="/">Habitual</Link>
      </div>

      <div className="right">
        <Link to="/profile">Profile</Link>
      </div>

    </nav>

  );
}