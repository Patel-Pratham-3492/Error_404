import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import RoleNavbar from "../RoleNavbar/RoleNavbar";
import Hire from "./Hire";
import Fire from "./Fire"; 
import Assign from "./Assign";
import Menu from "./Menu";
import ViewMenu from "./Viewmenu";
import ManagerPayment from "./ManagerPayment";
import "./manager.css";

export default function Manager() {
  const [activePage, setActivePage] = useState("overview");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

const [stats, setStats] = useState({
  totalOrders: 0,
  totalRevenue: 0,
  totalCustomers: 0,
  pendingPayments: 0,
  paidPayments: 0,
  totalItemsSold: 0,
  avgRevenuePerCustomer: 0
});

const fetchTodayStats = async () => {
  try {
    const res = await fetch("http://3.128.94.231:5000/api/dashboard/today-stats");
    const data = await res.json();
    if (data.success) setStats(data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchTodayStats();

  const interval = setInterval(fetchTodayStats, 5000); // realtime refresh
  return () => clearInterval(interval);
}, []);



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
            Add Menu Items
          </button>

          <button
            className={`sidebar-btn ${activePage === "menuview" ? "active" : ""}`}
            onClick={() => setActivePage("menuview")}
          >
            View Menu
          </button>

          <button
            className={`sidebar-btn ${activePage === "payment" ? "active" : ""}`}
            onClick={() => setActivePage("payment")}
          >
            Payment
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
    <p className="stat-value">{stats.totalOrders}</p>
  </div>

  <div className="manager-stat stat-green">
    <h3 className="stat-title">Revenue Today</h3>
    <p className="stat-value">${stats.totalRevenue}</p>
  </div>

  <div className="manager-stat stat-blue">
    <h3 className="stat-title">Total Customers</h3>
    <p className="stat-value">{stats.totalCustomers}</p>
  </div>

  <div className="manager-stat stat-yellow">
    <h3 className="stat-title">Pending Payments</h3>
    <p className="stat-value">{stats.pendingPayments}</p>
  </div>

  <div className="manager-stat stat-purple">
    <h3 className="stat-title">Paid Payments</h3>
    <p className="stat-value">{stats.paidPayments}</p>
  </div>

  <div className="manager-stat stat-orange">
    <h3 className="stat-title">Items Sold</h3>
    <p className="stat-value">{stats.totalItemsSold}</p>
  </div>

  <div className="manager-stat stat-teal">
    <h3 className="stat-title">Avg Revenue Per Customer</h3>
    <p className="stat-value">${stats.avgRevenuePerCustomer}</p>
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

        {activePage === "payment" && (
          <div className="page-section">
            <ManagerPayment />
          </div>
        )}

      </div>
    </div>
  );
}
