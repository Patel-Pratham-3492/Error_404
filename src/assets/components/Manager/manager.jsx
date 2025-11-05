import React, {useState} from "react";
import { FaUserCircle, FaCog, FaSignOutAlt,FaChartBar, FaUsers, FaCalendarAlt,FaTable, FaClipboardList } from "react-icons/fa";
import "./manager.css";

function Manager() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const gridItems = [
    {title: "Reservations" , icon: <FaCalendarAlt />},
    {title: "Tables" , icon: <FaTable />},
    {title: "Staff" , icon: <FaUsers />},
    {title: "Reports" , icon: <FaChartBar />},
    {title: "Tasks" , icon: <FaClipboardList />},
    {title: "Settings" , icon: <FaCog />},

  ];

  return(
    <div className="manager-countiner">
      {/* Navbar */}
      <nav className="manager-navbar">
        <div className="navbar-lest">
          <h2 className="manager-logo">Manager Panel</h2>
        </div>

        <div className="navbar-center">
          <input type="text" placeholder="Search..." className="manager-search" />
        </div>

        <div className="navbar-right">
          <div className="profile-countiner" onClick={() => setDropdownOpen(!dropdownOpen)}>
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
          {gridItems.map((item, index)=> (
            <div className="grid-card" key={index} style={{borderTop: `5px solid${item.color}`}}>
              <div className="grid0icon" style={{color: item.color}}>
                {item.icon}
              </div>
              <h3>{item.title}</h3>
            </div>
          ))}
        </section>
      </main>
    </div>
  );

}
export default Manager;