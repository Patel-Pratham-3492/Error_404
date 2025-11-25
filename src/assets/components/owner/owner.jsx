import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import RoleNavbar from "../RoleNavbar/RoleNavbar";
import Hire from "./Hire";
import Fire from "./fire";
import "./owner.css";

export default function Owner() {
  const [activePage, setActivePage] = useState("overview");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

   useEffect(() => {
    // Check logged in
    const isLoggedIn = sessionStorage.getItem("loggedIn");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Fetch user
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

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
         {user && <RoleNavbar role={user.role} name={user.firstName} />}

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
                <h3 className="stat-title">Total Customers</h3>
                <p className="stat-value">19</p>
              </div>
            </div>
          </div>
        )}

        {/* HIRE STAFF */}
        {activePage === "hire" && (
          <div className="page-section">
            <Hire />
          </div>
        )}

        {/* FIRE STAFF */}
        {activePage === "fire" && (
          <div className="page-section">
            <Fire />
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
