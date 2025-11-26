import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import RoleNavbar from "../RoleNavbar/RoleNavbar";
import Hire from "./Hire";
import Fire from "./Fire"; 
import Assign from "./Assign";
import Menu from "./Menu";
import ViewMenu from "./Viewmenu";
import "./manager.css";

export default function Manager() {
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
    <div className="manager-wrapper">

      {/* Sidebar */}
      <aside className="manager-sidebar">
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
            className={`sidebar-btn ${activePage === "assigned" ? "active" : ""}`}
            onClick={() => setActivePage("assigned")}
          >
            Assign Waiters
          </button>

          <button
            className={`sidebar-btn ${activePage === "menu" ? "active" : ""}`}
            onClick={() => setActivePage("menu")}
          >
            Modify Menu
          </button>

          <button
            className={`sidebar-btn ${activePage === "menuview" ? "active" : ""}`}
            onClick={() => setActivePage("menuview")}
          >
            View Menu
          </button>


        </nav>
      </aside>

      {/* Main Content */}
      <div className="manager-content">
         {user && <RoleNavbar role={user.role} name={user.firstName} />}

        {/* OVERVIEW */}
        {activePage === "overview" && (
          <div className="page-section">
            <h1 className="page-title">Today's Overview</h1>
            <div className="stats-grid">
              <div className="manager-stat stat-red">
                <h3 className="stat-title">Orders Today</h3>
                <p className="stat-value">48</p>
              </div>
              <div className="manager-stat stat-green">
                <h3 className="stat-title">Revenue Today</h3>
                <p className="stat-value">$820</p>
              </div>
              <div className="manager-stat stat-blue">
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

         {/* assigned */}
        {activePage === "assigned" && (
          <div className="page-section">
            <Assign />
          </div>
        )}

         {/* menu */}
        {activePage === "menu" && (
          <div className="page-section">
            <Menu />
          </div>
        )}

        {activePage === "menuview" && (
          <div className="page-section">
            <ViewMenu />
          </div>
        )}

      </div>
    </div>
  );
}
