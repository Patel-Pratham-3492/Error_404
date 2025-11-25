import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import RoleNavbar from "../RoleNavbar/RoleNavbar";
import "./waiter.css";

export default function Waiter() {
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
    console.log(storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="waiter-wrapper">

      {/* Sidebar */}
      <aside className="waiter-sidebar">
        <h2 className="sidebar-title">Dashboard</h2>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-btn ${activePage === "overview" ? "active" : ""}`}
            onClick={() => setActivePage("overview")}
          >
            Overview
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


        </nav>
      </aside>

      {/* Main Content */}
      <div className="waiter-content">
         {user && <RoleNavbar role={ user.role + " : " + user.waiterId} name={user.firstName} />}

        {/* OVERVIEW */}
        {activePage === "overview" && (
          <div className="page-section">
            <h1 className="page-title">Today's Overview</h1>
            <div className="stats-grid">
              <div className="waiter-stat stat-red">
                <h3 className="stat-title">Orders Today</h3>
                <p className="stat-value">48</p>
              </div>
              <div className="waiter-stat stat-green">
                <h3 className="stat-title">Revenue Today</h3>
                <p className="stat-value">$820</p>
              </div>
              <div className="waiter-stat stat-blue">
                <h3 className="stat-title">Total Customers</h3>
                <p className="stat-value">19</p>
              </div>
            </div>
          </div>
        )}

         {/* assigned */}
        {activePage === "assigned" && (
          <div className="page-section">
            Assigned waiters
          </div>
        )}

         {/* menu */}
        {activePage === "menu" && (
          <div className="page-section">
            modify the menu
          </div>
        )}

      </div>
    </div>
  );
}
