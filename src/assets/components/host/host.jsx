// HostDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleNavbar from "../RoleNavbar/RoleNavbar";
import "./host.css";
import hoverSoundFile from "./sound.mp3";

export default function Host() {
  const [activeTab, setActiveTab] = useState("tables");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // sound effect
  const hoverSound = new Audio(hoverSoundFile);
  hoverSound.volume = 0.4;

  // Reservation form state
  const [resName, setResName] = useState("");
  const [resEmail, setResEmail] = useState("");
  const [resPeople, setResPeople] = useState("");
  const [resDate, setResDate] = useState("");

  const [resPopup, setResPopup] = useState(false);
  const [resDone, setResDone] = useState(false);
  const [resError, setResError] = useState(false);

  // Reservation status state
  const [reservations, setReservations] = useState([]);
  const [statusPopup, setStatusPopup] = useState(false);
  const [selectedRes, setSelectedRes] = useState(null);
  const [newStatus, setNewStatus] = useState("pending");
  const [popupMessage, setPopupMessage] = useState(""); // message text
  const [popupVisible, setPopupVisible] = useState(false); // show/hide

  const [loading, setLoading] = useState(true);

  // Tables state
  const [tables, setTables] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => setPopupVisible(false), 2000);
  };

  // Fetch tables
  const fetchTables = async () => {
    try {
      const res = await fetch("https://error-404-server.onrender.com/api/table");
      const data = await res.json();
      if (data.success) setTables(data.tables);
    } catch (err) {
      console.error("Error fetching tables:", err);
    }
  };

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("loggedIn");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else navigate("/login");
  }, [navigate]);

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (activeTab === "check") fetchTodayReservations();
  }, [activeTab]);

  const fetchTodayReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://error-404-server.onrender.com/api/reservations/today");
      const data = await res.json();
      if (data.success) setReservations(data.reservations);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
    setLoading(false);
  };

  // Reservation form submit
  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    if (!resName || !resEmail || !resPeople || !resDate) return;

    setResPopup(true);
    setResDone(false);
    setResError(false);

    try {
      const res = await fetch("https://error-404-server.onrender.com/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resName,
          email: resEmail,
          people: resPeople,
          date: resDate,
          status: "pending",
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setResError(true);
        return setTimeout(() => setResPopup(false), 3000);
      }

      setResDone(true);
      setTimeout(() => {
        setResPopup(false);
        setResName("");
        setResEmail("");
        setResPeople("");
        setResDate("");
        setResDone(false);
        if (activeTab === "check") fetchTodayReservations();
      }, 3000);
    } catch (err) {
      console.error(err);
      setResError(true);
      setTimeout(() => setResPopup(false), 3000);
    }
  };

  // Status update
  const handleStatusClick = (res) => {
    setSelectedRes(res);
    setNewStatus(res.status);
    setStatusPopup(true);
  };

  const updateStatus = async () => {
    try {
      const res = await fetch(
        `https://error-404-server.onrender.com/api/reservations/update-status/${selectedRes._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setStatusPopup(false);
        fetchTodayReservations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Table popup
  const openPopup = (table) => {
    setSelectedTable(table);
    setCustomerName(table.customerName || "");
    setCustomerEmail(table.customerEmail || "");
    setPopupOpen(true);
  };

  const closePopup = () => setPopupOpen(false);

  // Mark table as occupied (host)
  const markOccupied = async (table) => {
    if (!customerName || !customerEmail) return;

    try {
      const res = await fetch(
        `https://error-404-server.onrender.com/api/table/occupy/${table._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerName, customerEmail }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setPopupOpen(false);
        setSelectedTable(null);
        setCustomerName("");
        setCustomerEmail("");
        fetchTables();
      }
    } catch (err) {
      console.error(err);
    }
  };

// Mark table as open (host)
const markOpened = async (table) => {
  // Host can only open the table if status is "free"
  if (table.status !== "free") {
    showPopup("Host can only open tables that are free.");
    return;
  }

  try {
    const res = await fetch(
      `https://error-404-server.onrender.com/api/table/open/${table._id}`,
      { method: "PUT" }
    );
    const data = await res.json();
    if (data.success) {
      showPopup("Table marked as Open!");
      setPopupOpen(false);
      setSelectedTable(null);
      fetchTables();
    } else {
      showPopup(data.message || "Failed to open table.");
    }
  } catch (err) {
    console.error("Error opening table:", err);
    showPopup("Something went wrong. Check console.");
  }
};


  // Format date YYYYMMDD → DD-MM-YYYY
  const formatDate = (d) => {
    const y = d.substring(0, 4);
    const m = d.substring(4, 6);
    const da = d.substring(6, 8);
    return `${da}-${m}-${y}`;
  };

  // Map table status → CSS class
  const getTableClass = (table) => {
    switch (table.status) {
      case "occupied":
        return "host-table-block occupied"; // red
      case "free":
        return "host-table-block freed-by-waiter"; // blue
      case "open":
        return "host-table-block open"; // green
      default:
        return "host-table-block";
    }
  };

  return (
    <div className="host-container">
      {user && <RoleNavbar role={user.role} name={user.firstName} />}
      <div className="host-section">
        <div className="host-main">
          {popupVisible && (
        <div className="host-alert-popup">
        {popupMessage}
        </div>
          )}
          <div className="host-options-row">
            <button
              className={`host-option-btn ${activeTab === "tables" ? "active" : ""}`}
              onClick={() => setActiveTab("tables")}
            >
              Tables
            </button>
            <button
              className={`host-option-btn ${activeTab === "check" ? "active" : ""}`}
              onClick={() => setActiveTab("check")}
            >
              Check Reservations
            </button>
            <button
              className={`host-option-btn ${activeTab === "create" ? "active" : ""}`}
              onClick={() => setActiveTab("create")}
            >
              Create Reservation
            </button>
          </div>

          <div className={`host-content-rectangle show`}>
            {/* TABLE GRID */}
            {activeTab === "tables" && (
              <div className="host-table-grid">
                {tables.map((table) => (
                  <div
                    key={table._id}
                    className={getTableClass(table)}
                    onClick={() => openPopup(table)}
                    onMouseEnter={() => hoverSound.play()}
                  >
                    <div className="host-table-title">{table.name}</div>
                    <div className="host-table-capacity">{table.capacity} Seats</div>
                    {table.customerName && (
                      <div className="host-table-customer">{table.customerName}</div>
                    )}
                  </div>
                ))}

                {/* Table Popup */}
                {popupOpen && selectedTable && (
                  <div
                    className="host-popup-overlay"
                    onClick={closePopup}
                  >
                    <div
                      className="host-popup"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="host-popup-close" onClick={closePopup}>
                        ✕
                      </button>
                      <h2 className="host-popup-title">{selectedTable.name}</h2>
                      <p className="host-popup-sub">Capacity: {selectedTable.capacity}</p>

                      {(selectedTable.status === "occupied" &&
                        !selectedTable.AssignedWaiter) ||
                      selectedTable.status === "free" ? (
                        <button
                          className="host-popup-btn-green"
                          onClick={() => markOpened(selectedTable)}
                        >
                          Mark as Open
                        </button>
                      ) : selectedTable.status === "occupied" && selectedTable.AssignedWaiter ? (
                        <p>Waiter must free the table first</p>
                      ) : (
                        <>
                          <input
                            type="text"
                            placeholder="Customer Name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="host-popup-input"
                          />
                          <input
                            type="email"
                            placeholder="Customer Email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="host-popup-input"
                          />
                          <button
                            className="host-popup-btn-red"
                            onClick={() => markOccupied(selectedTable)}
                          >
                            Mark as Occupied
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RESERVATION TABLE */}
            {activeTab === "check" && (
              <div className="res-table-wrapper">
                <table className="res-table">
                  <thead>
                    <tr>
                      <th>Reservation ID</th>
                      <th>Name</th>
                      <th>People</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r._id}>
                        <td>{r.reservationId}</td>
                        <td>{r.name}</td>
                        <td>{r.people}</td>
                        <td>{formatDate(r.date)}</td>
                        <td>
                          <span
                            className={`status-badge status-${r.status}`}
                            onClick={() => handleStatusClick(r)}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Status Popup */}
                {statusPopup && selectedRes && (
                  <div
                    className="status-popup-overlay"
                    onClick={() => setStatusPopup(false)}
                  >
                    <div
                      className="status-popup-box"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="close-btn"
                        onClick={() => setStatusPopup(false)}
                      >
                        ✕
                      </button>
                      <h3>Update Status</h3>
                      <p>Reservation: {selectedRes.reservationId}</p>
                      <select
                        className="status-select"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="arrived">Arrived</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button className="confirm-btn" onClick={updateStatus}>
                        Update Status
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CREATE RESERVATION */}
            {activeTab === "create" && (
              <div className="host-reservation-form">
                <form
                  onSubmit={handleReservationSubmit}
                  className="host-res-form-box"
                >
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={resName}
                    onChange={(e) => setResName(e.target.value)}
                    className="host-popup-input"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Customer Email"
                    value={resEmail}
                    onChange={(e) => setResEmail(e.target.value)}
                    className="host-popup-input"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Number of People"
                    min="1"
                    value={resPeople}
                    onChange={(e) => setResPeople(e.target.value)}
                    className="host-popup-input"
                    required
                  />
                  <input
                    type="date"
                    value={resDate}
                    onChange={(e) => setResDate(e.target.value)}
                    className="host-popup-input"
                    required
                  />
                  <button type="submit" className="host-res-btn-green">
                    Confirm Reservation
                  </button>
                </form>

                {resPopup && (
                  <div className="host-res-popup-overlay">
                    <div className="host-res-popup-box">
                      {!resDone && !resError && (
                        <>
                          <div className="host-res-loader"></div>
                          <p className="host-res-loader-text">
                            Processing reservation...
                          </p>
                        </>
                      )}
                      {resDone && !resError && (
                        <>
                          <div className="host-res-checkmark">✔</div>
                          <p className="host-res-success-text">Done!</p>
                        </>
                      )}
                      {resError && (
                        <>
                          <div className="host-res-error-x">✕</div>
                          <p className="host-res-error-text">Please try again!</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
