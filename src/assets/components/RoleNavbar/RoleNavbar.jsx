import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./RoleNavbar.css";

const RoleNavbar = ({ role, name, userId }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("loggedIn");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Swap display for waiter and chef
  let displayName = name;
  let displayRole = role;
  if (role === "waiter") {
    displayName = name; // "Waiter" or "Chef"
    displayRole = "waiter"; // hide role
  }

  if (role === "chef") {
    displayName = role.charAt(0).toUpperCase() + role.slice(1); // "Waiter" or "Chef"
    displayRole = ""; // hide role
  }

  return (
    <div className="role-navbar-container">
      <nav className="role-navbar">

        {/* Logo + Role name */}
        <div className="role-logo">
          <span className="role-logo-welcome">Welcome, </span>
          <span className="role-logo-name">{displayName}</span>
          {displayRole && <span className="role-role-tag">({displayRole})</span>}
        </div>

        {/* Profile Icon */}
        <div
          className="role-profile"
          ref={menuRef}
          onClick={() => setShowMenu(!showMenu)}
        >
          <FaUserCircle size={30} color="#ede9e1ff" />

          {showMenu && (
            <div className="role-profile-menu">
              <button
                className="role-profile-btn"
                onClick={() => navigate("/setting")}
              >
                Settings
              </button>

              <button
                className="role-profile-btn role-logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default RoleNavbar;
