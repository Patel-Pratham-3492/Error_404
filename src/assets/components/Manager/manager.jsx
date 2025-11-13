import React, {useEffect, useState} from "react";
import { FaUserCircle, FaCog, FaSignOutAlt,FaChartBar, FaUsers, FaCalendarAlt,FaTable, FaClipboardList } from "react-icons/fa";
import "./manager.css";

function Manager() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activePopup, setActivePopup] = useState(null);

  // close dropdown when click outside
  useEffect (() =>{
  const handleClickOutside = () => setDropdownOpen(false);
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
},[]);

  const gridItems = [
    {title: "Reservations" , icon: <FaCalendarAlt />, desc: "Manage restaurant"},
    {title: "Tables" , icon: <FaTable />, desc: "View and assign Tables"},
    {title: "Staff" , icon: <FaUsers />, desc: "Manage Staff"},
    {title: "Reports" , icon: <FaChartBar />, desc: "View Reports"},
    // {title: "Settings" , icon: <FaCog />},

  ];

  return(
    <div className="manager-container">
      {/* Navbar */}
      <nav className="manager-navbar">
        <div className="navbar-left">
          <h2 className="manager-logo">Manager Panel</h2>
        </div>

        <div className="navbar-center">
          <input type="text" placeholder="Search..." className="manager-search" />
        </div>

        <div className="navbar-right">
          <div
            className="profile-container"
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen((prev) => !prev); 
            }}> 
            <FaUserCircle className="profile-icon"/>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <p><FaCog />Settings</p>
                <p><FaSignOutAlt/>Logout</p>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Dashboard Start */}
      <main className="manager-main">
        <section className="dashboard-grid">
          {gridItems.map((item, index) => (
            // onClick to open popup + add space after 'solid'
            <div
              className="grid-card"
              key={index}
              onClick={() => setActivePopup(item)} //Makes popup open
              style={{ borderTop: `5px solid ${item.color || "#ff4d4d"}` }}
            >
              <div
                className="grid-icon"
                style={{ color: item.color || "#ff4d4d" }}
              >
                {item.icon}
              </div>
              <h3>{item.title}</h3>
            </div>
          ))}
        </section>
      </main>

      {/* Popup Effect */}
      {activePopup && (
        <div
          className="popup-overlay"
          onClick={() => setActivePopup(null)}
        >
          <div
            className="popup-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{activePopup.title}</h2>
            <p>{activePopup.desc}</p>
            <button
              className="popup-btn"
              onClick={() => setActivePopup(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Manager;