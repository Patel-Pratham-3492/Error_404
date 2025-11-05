import React, {useState} from "react";
import { FaChartLine, FaUsers, FaClipboardList, FaUtensils, FaCalendarAlt, FaCog, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import "./owner.css";

function Owner() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dashboardItems = [
    { title: "Revenue", icon: <FaChartLine /> },
    { title: "Staff Management", icon: <FaUsers /> },
    { title: "Reports", icon: <FaClipboardList /> },
    { title: "Menu Management", icon: <FaUtensils /> },
    { title: "Reservations", icon: <FaCalendarAlt /> },
    { title: "Settings", icon: <FaCog /> },

  ];

  return(
    <div className="owner-countiner">
      {/* Navbar */}
      <nav className="owner-navbar">
        <h2 className="owner-logo">Owner Panel</h2>

          <div className="owner-search">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="owner-profile">
            <div className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen) }>
              <FaUserCircle />
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <p><FaCog />Settings</p>
                <p><FaSignOutAlt />Logout</p>
              </div>
            )}
          </div>
      </nav>

      {/* Dashboard */}
      <section className="owner-dashboard">
        {dashboardItems.map((item, index)=>(
          <div className="dashboard-card" key={index}>
            <div className="dashboard-icon">{item.icon}</div>
            <h3>{item.title}</h3>
          </div>
        ))}
      </section>
    </div>
  );

}

export default Owner;