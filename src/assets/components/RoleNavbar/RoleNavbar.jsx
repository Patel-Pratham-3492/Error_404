import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./RoleNavbar.css";

const RoleNavbar = ({ role, name, email }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("loggedIn");
    navigate("/login");
  };

  return (
    <div className="role-navbar-container">
      <nav className="role-navbar">

        {/* Logo + Role name */}
        <div className="role-logo">
          <span className="role-logo-welcome">Welcome, </span>
          <span className="role-logo-name">{name}</span>
          <span className="role-role-tag">({role})</span>
        </div>

        {/* Profile Icon */}
        <div
          className="role-profile"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FaUserCircle size={30} color="#ffd166" />

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
