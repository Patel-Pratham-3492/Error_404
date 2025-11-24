import React, { useState } from "react";
import RoleNavbar from "../RoleNavbar/RoleNavbar";
import "./owner.css";

export default function Owner() {
  const [activePage, setActivePage] = useState("overview");

  return (
    <div className="owner-wrapper">

      {/* Sidebar */}
      <aside className="owner-sidebar">
        <h2 className="sidebar-title">Dashboard</h2>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-btn ${activePage === "overview" ? "active" : ""}`}
            onClick={() => setActivePage("overview")}
          >
            Overview
          </button>

          <button
            className={`sidebar-btn ${activePage === "hire" ? "active" : ""}`}
            onClick={() => setActivePage("hire")}
          >
            Hire Staff
          </button>

          <button
            className={`sidebar-btn ${activePage === "fire" ? "active" : ""}`}
            onClick={() => setActivePage("fire")}
          >
            Fire Staff
          </button>

          <button
            className={`sidebar-btn ${activePage === "reports" ? "active" : ""}`}
            onClick={() => setActivePage("reports")}
          >
            Weekly & Monthly Reports
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="owner-content">
        <RoleNavbar role="Owner" name="Owner" email="owner@example.com" />

        {/* OVERVIEW */}
        {activePage === "overview" && (
          <div className="page-section">
            <h1 className="page-title">Today's Overview</h1>

            <div className="stats-grid">
              <div className="owner-stat stat-red">
                <h3 className="stat-title">Orders Today</h3>
                <p className="stat-value">48</p>
              </div>

              <div className="owner-stat stat-green">
                <h3 className="stat-title">Revenue Today</h3>
                <p className="stat-value">$820</p>
              </div>

              <div className="owner-stat stat-blue">
                <h3 className="stat-title">New Customers</h3>
                <p className="stat-value">19</p>
              </div>
            </div>
          </div>
        )}

        {/* HIRE STAFF */}
        {activePage === "hire" && (
          <div className="page-section">
            <h1 className="page-title">Hire Staff</h1>
            <p className="page-desc">Add new employees to your restaurant system.</p>
          </div>
        )}

        {/* FIRE STAFF */}
        {activePage === "fire" && (
          <div className="page-section">
            <h1 className="page-title">Fire Staff</h1>
            <p className="page-desc">Remove employees safely from the system.</p>
          </div>
        )}

        {/* REPORTS */}
        {activePage === "reports" && (
          <div className="page-section">
            <h1 className="page-title">Weekly & Monthly Reports</h1>
            <p className="page-desc">View detailed performance analytics.</p>
          </div>
        )}
      </div>
    </div>
  );
}
