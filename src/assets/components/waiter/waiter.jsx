import React, {useState} from "react";
import { FaUserCircle, FaCog, FaSignOutAlt, FaClipboardList, FaTable, FaCalendarAlt, FaChartBar,FaUsers } from "react-icons/fa";
import "./waiter";

function Waiter() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const gridItems = [
    { title: "Orders", icon: <FaClipboardList /> },
    { title: "Tables", icon: <FaTable /> },
    { title: "Reservations", icon: <FaCalendarAlt /> },
    { title: "Customer", icon: <FaUsers /> },
    { title: "Reports", icon: <FaChartBar /> },
    { title: "Settings", icon: <FaCog /> },

  ];

  return(
    <div className="waiter-countiner">
      {/* Navbar */}
      <nav className="waiter-navbar">
        <div className="navbar-left">
          <h2 className="waiter-logo">Waiter Panel</h2>
        </div>

        <div className="navbar-center">
          <input type="text" placeholder="Search..." className="waiter-search" />
        </div>
        <div className="navbar-right">
          <div className="profile-countiner" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <FaUserCircle className="profile-icon" />
            {dropdownOpen &&(
              <div className="dropdown-menu">
                <p>
                  <FaCog />Settings
                </p>
                <p>
                  <FaSignOutAlt /> Logout
                </p>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      <section className="dashboard-grid">
        {gridItems.map((item, index) => (
          <div className="grid-card">
            <div className="grid-icon">{item.icon}</div>
            <h3>{item.title}</h3>
          </div>
        ))}
      </section>

    </div>
  );

 }

export default Waiter;