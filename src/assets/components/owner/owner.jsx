import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import RoleNavbar from "../RoleNavbar/RoleNavbar";
import Hire from "./Hire";
import Fire from "./fire";
import Menu from "./Menu";
import ManagerPayment from "./ManagerPayment";
import ViewMenu from "./Viewmenu";
import Overview from "./Overview";
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
      <div className="owner-content">
         {user && <RoleNavbar role={user.role} name={user.firstName} />}

        {/* OVERVIEW */}
        {activePage === "overview" && (
          <div className="page-section">
           <Overview />
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

         {/* menu */}
        {activePage === "menu" && (
         <div className="page-section">
            <Menu />
          </div>
        )}
        
        {/* view menu */}
        {activePage === "menuview" && (
          <div className="page-section">
            <ViewMenu />
          </div>
        )}
        
        {/* payment */}
        {activePage === "payment" && (
          <div className="page-section">
            <ManagerPayment />
          </div>
        )}

      </div>
    </div>
  );
}
