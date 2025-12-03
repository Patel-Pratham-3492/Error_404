import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleNavbar from "../RoleNavbar/RoleNavbar"; 
import Menus from "./Menus";
import Payment from "./Payment";
import Track from "./Track";
import "./waiter.css";

export default function Waiter() {
  const [user, setUser] = useState(null);
  const [tables, setTables] = useState([]);

  const [selectedTable, setSelectedTable] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [popupMessage, setPopupMessage] = useState(""); // message text
  const [popupVisible, setPopupVisible] = useState(false); // show/hide

  const [activeTab, setActiveTab] = useState("menu");

  const navigate = useNavigate();

  const showPopupmessage = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => setPopupVisible(false), 2000);
  };

  const fetchTables = async (waiterId) => {
    try {
      const res = await fetch("http://localhost:5000/api/table");
      const data = await res.json();
      if (data.success) {
        const assigned = data.tables.filter(
          (t) => t.AssignedWaiter === waiterId
        );
        setTables(assigned);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("loggedIn");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      fetchTables(parsed.waiterId);
    } else {
      navigate("/login");
    }
  }, [navigate]);

 const openPopup = (table) => {
  if (table.status !== "occupied") return; // only occupied tables can open popup
  setSelectedTable(table);
  setActiveTab("menu");
  setShowPopup(true);
};


  const closePopup = () => {
    setShowPopup(false);
    setSelectedTable(null);
  };

  const freeTable = async (tableId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/table/free/${tableId}`, {
      method: "PUT",
    });
    const data = await res.json();

    if (data.success) {
      // Update table list after freeing
      setTables((prev) =>
        prev.map((t) => (t._id === tableId ? data.table : t))
      );
      // Optional: show popup message
      //setShowPopup(false); // close popup if it was open
      showPopupmessage("now, the table is free"); // can replace with popup component
    } else {
      showPopupmessage("there is an error!");
    }
  } catch (err) {
    console.error(err);
    showPopupmessage("there is an error!");
  }
};


  return (
    <div className="waiter-container">
      {user && (
        <RoleNavbar
          role={`${user.role} : ${user.waiterId}`}
          name={user.firstName}
        />
      )}

      <h1>Your Assigned Tables</h1>
       {popupVisible && (
        <div className="host-alert-popup">
        {popupMessage}
        </div>
          )}
      <div className="tables-grid">
        {tables.map((t) => (
          <div
            key={t._id}
            className={`table-card ${t.status}`}
            onClick={() => openPopup(t)}
          >
            <h3>{t.name}</h3>
            <p>Capacity: {t.capacity}</p>
            <p>Customer: {t.customerName || "None"}</p>

            {t.status === "occupied" && (
              <p className="customer-count">
                Customer Track: <strong>{t.newSessionId}</strong>
              </p>
            )}

            {t.status === "occupied" && (
              <button
                className="free-table-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  freeTable(t._id);
                }}
              >
                Free Table
              </button>
            )}
          </div>
        ))}
      </div>
      {/* Popup */}
      {showPopup && selectedTable && (
        <div className="popup-overlay" onClick={closePopup}>
          <div
            className="popup-box"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button className="popup-close-btn" onClick={closePopup}>
              ✕
            </button>

            {/* Header Info */}
            <div className="popup-header-info">
              <h3>{selectedTable.name}</h3>
              {selectedTable.status === "occupied" && (
                <p>
                  Customer Track:{" "}
                  <strong>{selectedTable.newSessionId}</strong>
                </p>
              )}
            </div>

            {/* Tabs */}
            <div className="popup-tabs">
              <button
                className={activeTab === "menu" ? "active" : ""}
                onClick={() => setActiveTab("menu")}
              >
                Menu
              </button>

              <button
                className={activeTab === "track" ? "active" : ""}
                onClick={() => setActiveTab("track")}
              >
                Track Orders
              </button>

              <button
                className={activeTab === "payment" ? "active" : ""}
                onClick={() => setActiveTab("payment")}
              >
                Payment
              </button>
            </div>

            {/* Content */}
            <div className="popup-content">
              {activeTab === "menu" && <Menus table={selectedTable} />}
              {activeTab === "track" && <Track table={selectedTable} />}
              {activeTab === "payment" && <Payment table={selectedTable} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
