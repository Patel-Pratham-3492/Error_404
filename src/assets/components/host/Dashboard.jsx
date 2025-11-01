import React from "react";
import { FaCalendarAlt, FaUtensils, FaUsers, FaChartBar, FaClipboardList } from "react-icons/fa";
import "./host.css";

function Dashboard({ onNavigate }) {
  const menuItems = [
    { icon: <FaCalendarAlt />, title: "Reservations", desc: "Manage guest reservations", page: "reservations" },
    { icon: <FaUtensils />, title: "Tables", desc: "View available tables", page: "tables" },
    { icon: <FaUsers />, title: "Customers", desc: "Track customer data", page: "customers" },
    { icon: <FaChartBar />, title: "Reports", desc: "View analytics and stats", page: "reports" },
    { icon: <FaClipboardList />, title: "Orders", desc: "View and manage orders", page: "orders" },
  ];

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="grid-container">
        {menuItems.map((item, index) => (
          <div key={index} className="grid-item" onClick={() => onNavigate(item.page)}>
            {item.icon}
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
