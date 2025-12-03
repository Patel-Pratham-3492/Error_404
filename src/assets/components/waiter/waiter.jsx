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

const freeTable = async (tableId, customerCount) => {
  try {
    // 1️ First check if payments exist for this table
    const payRes = await fetch(`http://localhost:5000/api/payment/table/${customerCount}`);
    const payData = await payRes.json();

    // 2️ If there are pending payments, block free table
    if (payData.success && payData.items && payData.items.length > 0) {
      showPopupmessage("Cannot free table — payments are still pending!");
      return; // STOP HERE!
    }

    // 3️ If no pending payments → free table
    const res = await fetch(`http://localhost:5000/api/table/free/${tableId}`, {
      method: "PUT",
    });

    const data = await res.json();

    if (data.success) {
      setTables((prev) =>
        prev.map((t) => (t._id === tableId ? data.table : t))
      );
      showPopupmessage("Table successfully freed!");
    } else {
      showPopupmessage("Error freeing table!");
    }
  } catch (err) {
    console.error(err);
    showPopupmessage("Server error!");
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
                  freeTable(t._id, t.customerCount);

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
