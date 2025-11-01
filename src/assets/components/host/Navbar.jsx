import React, { useState } from "react";
import { FaUserCircle, FaSearch, FaCog } from "react-icons/fa";
import "./host.css";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar-host">
      <h2 className="logo">Restaurant Host Panel</h2>

      <div className="navbar-right">
        <div className="search-bar">
          <FaSearch color="#666" />
          <input type="text" placeholder="Search..." />
        </div>

        <div
          className={`profile-dropdown ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <button className="profile-btn">
            <FaUserCircle size={22} /> Host
          </button>
          <div className="dropdown-menu">
            <div className="dropdown-item">
              <FaUserCircle /> Profile
            </div>
            <div className="dropdown-item">
              <FaCog /> Settings
            </div>
            <div className="dropdown-item">Logout</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
