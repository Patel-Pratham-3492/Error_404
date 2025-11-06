import React, { useEffect, useState } from "react";
import { FaHome, FaCalendarAlt, FaUtensils, FaUsers, FaChartBar, FaCog, FaUserCircle, FaSearch, FaClipboardList, FaTable, FaSignOutAlt } from "react-icons/fa";
import "./host.css";

function Host() {
 const [dropdownOpen, setDropdownOpen] = useState(false);

 const gridItems = [
  { title: "Reservations", icon: <FaCalendarAlt /> },
  { title: "Tables", icon: <FaTable /> },
  { title: "Customers", icon: <FaUsers /> },
  { title: "Tasks", icon: <FaClipboardList /> },
 ]

  return(
    <div className="host-countiner">
      {/* navbar */}
      <nav className="host-navbar">
        <h2 className="host-logo">Host Panel</h2>

        <div className="host-search">
          <input type="text" placeholder="Search..." />
        </div>

        <div className="host-profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <FaUserCircle className="profile-icon"/>

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
          <div className="dashboard-card" key={index}>
            <div className="dashboard-icon">{item.icon}</div>
            <h3>{item.title}</h3>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Host;