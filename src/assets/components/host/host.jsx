import React, { useEffect, useState, useRef } from "react";
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
  FaSignOutAlt
} from "react-icons/fa";
import "./host.css";
import { div, table } from "framer-motion/client";

function Host() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activePopup, setActivePopup] = useState(null);

  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => { 
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)){
      setDropdownOpen(false);
    }};


    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const gridItems = [
    { title: "Reservations", icon: <FaCalendarAlt />, desc: "Manage bookings", popupType: "reservations" },
    { title: "Tables", icon: <FaTable />, desc: "Show The Tables", popupType: "tables" },
    { title: "Create Resevations", icon: <FaCalendarAlt />, desc: "Create New Resvertaion", popupType: "create" },
  ]


  // 8 tables with different capaciy
  const tables = [
    { id:1, capacity: 2, status: "Available" },
    { id:2, capacity: 4, status: "Available" },
    { id:3, capacity: 6, status: "Occupied" },
    { id:4, capacity: 4, status: "Available" },
    { id:5, capacity: 8, status: "Reserved" },
    { id:6, capacity: 2, status: "Cleaning" },
    { id:7, capacity: 4, status: "Occupied" },
    { id:8, capacity: 6, status: "Available" },

  ];

  // helper to map status 

  const statusClass = (status) => ({
      Available: "status-available",
      Occupied: "status-occupied",
      Reserved: "status-reserved",
      Cleaning: "status-cleaning",
    }[status]);

  const renderPopupContent = () => {
    if (!activePopup) return null;
    switch (activePopup.popupType){
      case "tables":
        return(
          <div className="tables-container">
            <h2 className="popup-title">Tables</h2>
          
          <div className="tables-grid">
            {tables.map((table) => (
              <div className="table-box" key={table.id}>
                <div className="table-id">Table {table.id}</div>
                <div className="table-capacity">Capacity: {table.capacity}</div>
                <div className={`table-status ${statusClass(table.status)}`}>
                  {table.status}
                  </div>
              </div>
            ))}
          </div>
          </div>
        );
        case "reservations":
          return(
            <div>
              <h2>Reservations</h2>
            </div>
          );

          case "create":
            return(
              <div>
                <h2>Create Reservation</h2>
              </div>
            );

            default:
              return(
              <div>
                <h2>{activePopup.title}</h2>
              </div>
              );
    }
  };

  return (
    <div className="host-continer">
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
              <p><FaCog />Settings</p>
              <p><FaSignOutAlt />Logout</p>
            </div>
          )}
        </div>
      </nav>

      {/* dashboard */}
      <section className="host-dashboard">
        {gridItems.map((item, index) => (
          <div className="dashboard-card"
            key={item.title} onClick={() => setActivePopup(item)} >

            <div className="dashboard-icon">{item.icon}</div>
            <h3>{item.title}</h3>
          </div>
        ))}
      </section>

      {/* popup function  */}
      {activePopup && (
        <div className="popup-overlay"
          onClick={() => setActivePopup(null)}>

          <div className="popup-box" onClick={(e) => e.stopPropagation()}>

            {/* HEADER */}
            <div className="popup-header">
              <div className="popup-header-text">
                <h2>{activePopup.title}</h2>
                <p>{activePopup.desc}</p>
              </div>

              <button className="popup-close-btn" onClick={() => setActivePopup(null)}>
                <FaTimes />
              </button>
            </div>

            {/* CONTENT */}
            <div className="popup-content">
              {renderPopupContent()}
            </div>

          </div>

        </div>
      )}
    </div>
  );
}

export default Host;