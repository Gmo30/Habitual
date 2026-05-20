import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const GearIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const navLinks = [
  { name: "Dashboard", path: "/" },
  { name: "Habits", path: "/habits" },
  { name: "Discover", path: "/discover" },
  { name: "Profile", path: "/profile" },
];

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

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
    <nav
      className="w-full flex sticky top-0 z-50 items-center justify-between px-8 py-4 shadow-sm"
      style={{ background: "#FFEDE6", borderBottom: "1px solid #e8e0d4" }}
    >
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-bold tracking-tight select-none bg-transparent border-none cursor-pointer p-0"
          style={{ color: "#2c3a2e", fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
        >
          Habitual
        </button>

        <ul className={`
              flex items-center gap-1 list-none m-0 p-0
              md:flex
              ${open ? "flex flex-col absolute top-16 left-0 w-full bg-[#FFEDE6] p-4" : "hidden md:flex"}
            `}
          >
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="relative px-4 py-2 text-sm rounded-lg inline-flex items-center"
                  style={{
                    color: active ? "#2c3a2e" : "#7a7a6e",
                    fontWeight: active ? "600" : "400",
                    textDecoration: "none",
                  }}
                >
                  {link.name}
                  {active && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{ backgroundColor: "#2c3a2e" }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full border-none cursor-pointer"
          style={{ color: "#5a6b5c", background: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ede8df")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          aria-label="Notifications"
        >
          <BellIcon />
        </button>

        <button
          className="w-9 h-9 flex items-center justify-center rounded-full border-none cursor-pointer"
          style={{ color: "#5a6b5c", background: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ede8df")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          aria-label="Settings"
          onClick={() => navigate("/settings")}
        >
          <GearIcon />
        </button>

        {user ? (
          <button
            onClick={handleLogout}
            className="text-sm font-semibold px-4 py-1.5 rounded-full border-none cursor-pointer"
            style={{ background: "#4c614d", color: "#fff" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#3a4e3a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#4c614d")}
          >
            Log out
          </button>
        ) : (
          <Link
            to="/login"
            className="text-sm font-semibold px-4 py-1.5 rounded-full"
            style={{ background: "#4c614d", color: "#fff", textDecoration: "none" }}
          >
            Log in
          </Link>

          
        )}
          <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{
            fontSize: "1.5rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#2c3a2e"
          }}
        >
          <span>&#9776;</span>
      </button>
      </div>
    </nav>
  );
}