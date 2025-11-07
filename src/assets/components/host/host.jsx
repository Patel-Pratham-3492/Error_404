import React, { useEffect, useState } from "react";
import { 
  FaHome, 
  FaTimes,
  FaCalendarAlt, 
  FaUtensils, 
  FaUsers, 
  FaChartBar, 
  FaCog, 
  FaUserCircle, 
  FaSearch, 
  FaClipboardList, 
  FaTable, 
  FaSignOutAlt } from "react-icons/fa";
import "./host.css";

function Host() {
 const [dropdownOpen, setDropdownOpen] = useState(false);
 const [activePopup, setActivePopup] = useState(null);
 useEffect(()=>{
  const handleClickOutside = () => setDropdownOpen(false);
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
 }, []);

 const gridItems = [
  { title: "Reservations", icon: <FaCalendarAlt />, desc: "Manage bookings" },
  { title: "Tables", icon: <FaTable /> , desc: "Show The Tables"},
  { title: "Customers", icon: <FaUsers /> , desc: "View The Customer"},
  { title: "Tasks", icon: <FaClipboardList /> , desc: "Watch your Panding Tasks"},
 ]

  return(
    <div className="host-countiner">
      {/* navbar */}
      <nav className="host-navbar">
        <h2 className="host-logo">Host Panel</h2>

        <div className="host-search">
          <input type="text" placeholder="Search..." />
        </div>

        <div className="host-profile">
          <FaUserCircle className="profile-icon"
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen((prev) => !prev);
          }}
          />

          {dropdownOpen && (
            <div className="dropdown-menu">
              <p><FaCog/>Settings</p>
              <p><FaSignOutAlt/>Logout</p>
            </div>
          )}
        </div>
      </nav>

      {/* dashboard */}
      <section className="host-dashboard">
        {gridItems.map((item,index)=>(
          <div className="dashboard-card" key={index} onClick={() => setActivePopup(item)} >
            <div className="dashboard-icon">{item.icon}</div>
            <h3>{item.title}</h3>
          </div>
        ))}
      </section>

      {/* popup function  */}
      {activePopup &&(
        <div className="popup-overlay" onClick={() => setActivePopup(null)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <h2>{activePopup.title}</h2>
            <p>{activePopup.desc}</p>
            <button className="popup-btn popup-close-btn" onClick={() => setActivePopup(null)}><FaTimes /></button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Host;