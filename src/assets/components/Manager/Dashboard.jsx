import React from "react";
import { FaChartBar, FaUsers, FaCalendarAlt, FaTable, FaClipboardList, FaCog } from "react-icons/fa";

function Dashboard() {
  const gridItems = [
    { title: "Reservations", icon: <FaCalendarAlt />, color: "#ff6b6b" },
    { title: "Tables", icon: <FaTable />, color: "#4dabf7" },
    { title: "Staff", icon: <FaUsers />, color: "#51cf66" },
    { title: "Reports", icon: <FaChartBar />, color: "#9775fa" },
    { title: "Tasks", icon: <FaClipboardList />, color: "#f59f00" },
    { title: "Settings", icon: <FaCog />, color: "#868e96" },
  ];

  return (
    <section className="dashboard-grid">
      {gridItems.map((item, index) => (
        <div
          key={index}
          className="grid-card"
          style={{ borderTop: `5px solid ${item.color}` }}
        >
          <div className="grid-icon" style={{ color: item.color }}>
            {item.icon}
          </div>
          <h3>{item.title}</h3>
        </div>
      ))}
    </section>
  );
}

export default Dashboard;
