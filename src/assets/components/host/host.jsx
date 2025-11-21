// HostDashboard.jsx
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./host.css";

export default function Host() {
  const [activeTab, setActiveTab] = useState("tables");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const hostName = user?.name || "Host";
  const navigate = useNavigate();


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
  const [loading, setLoading] = useState(true);

  // Tables state
  const [tables, setTables] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // ----------------- FETCH DATA -----------------
  const fetchTables = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/table");
      const data = await res.json();
      if (data.success) setTables(data.tables);
      else console.error("Failed to fetch tables:", data.message);
    } catch (err) {
      console.error("Error fetching tables:", err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (activeTab === "check") fetchTodayReservations();
  }, [activeTab]);

  const fetchTodayReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/reservations/today");
      const data = await res.json();
      if (data.success) setReservations(data.reservations);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
    setLoading(false);
  };

  // ----------------- RESERVATION FORM -----------------
  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    if (!resName || !resEmail || !resPeople || !resDate) return;

    setResPopup(true);
    setResDone(false);
    setResError(false);

    try {
      const res = await fetch("http://localhost:5000/api/reservations", {
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
        return setTimeout(() => setResPopup(false), 10000);
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
      setTimeout(() => setResPopup(false), 10000);
    }
  };

  // ----------------- STATUS UPDATE -----------------
  const handleStatusClick = (res) => {
    setSelectedRes(res);
    setNewStatus(res.status);
    setStatusPopup(true);
  };

  const updateStatus = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/reservations/update-status/${selectedRes._id}`,
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

  // ----------------- TABLE MANAGEMENT -----------------
  const openPopup = (table) => {
    setSelectedTable(table);
    setCustomerName(table.customerName || "");
    setCustomerEmail(table.customerEmail || "");
    setPopupOpen(true);
  };

  const closePopup = () => setPopupOpen(false);

  // Mark a table as occupied
  const markOccupied = async (table) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/table/occupy/${table._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName,
          customerEmail: customerEmail,
        }),
      }
    );

    const data = await res.json();
    if (data.success) {
      console.log("Table marked as occupied!");
      setPopupOpen(false);
      setSelectedTable(null);
      setCustomerName("");
      setCustomerEmail("");

      // Update local tables state to reflect the color immediately
      setTables((prev) =>
        prev.map((t) =>
          t._id === table._id
            ? { ...t, status: "occupied", customerName, customerEmail }
            : t
        )
      );
    } else {
      console.error("Failed to mark occupied:", data.message);
    }
  } catch (err) {
    console.error("Error marking table occupied:", err);
  }
};

  // Mark a table as open
  const markOpened = async (table) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/table/open/${table._id}`,
        { method: "PUT" }
      );
      const data = await res.json();
      if (data.success) {
        console.log("Table marked as open!");
        setPopupOpen(false);
        setSelectedTable(null);
        fetchTables();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------- FORMAT DATE -----------------
  const formatDate = (d) => {
    const y = d.substring(0, 4);
    const m = d.substring(4, 6);
    const da = d.substring(6, 8);
    return `${da}-${m}-${y}`;
  };

  // ----------------- RENDER -----------------
  return (
    <div className="host-container">
      {/* Navbar */}
      <nav className="host-navbar">
        <div className="host-logo">
          <span className="host-logo-welcome">Welcome, </span>
          <span className="host-logo-name">{hostName}</span>
        </div>
        <div
          className="host-profile"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <FaUserCircle size={30} color="#ffd166" />
          {showProfileMenu && (
            <div className="host-profile-menu">
              <button className="host-profile-btn" onClick={() => {navigate("/setting");}}>Settings</button>
              <button className="host-profile-btn host-logout-btn" onClick={() => { localStorage.removeItem("user"); navigate("/login");}}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Section */}
      <div className="host-section">
        <div className="host-main">
          {/* Tabs */}
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

          {/* Content */}
          <div className={`host-content-rectangle show`}>
            {/* -------- TABLE GRID -------- */}
            {activeTab === "tables" && (
              <div className="host-table-grid">
                {tables.map((table) => (
                  <div
                    key={table._id}
                    className={`host-table-block ${table.status}`} // occupied/open for coloring
                    onClick={() => openPopup(table)}
                  >
                    <div className="host-table-title">{table.name}</div>
                    <div className="host-table-capacity">{table.capacity} Seats</div>
                    {table.status === "occupied" && (
                      <div className="host-table-customer">{table.customerName}</div>
                    )}
                  </div>
                ))}

                {/* Table Popup */}
                {popupOpen && selectedTable && (
                  <div className="host-popup-overlay" onClick={closePopup}>
                    <div className="host-popup" onClick={(e) => e.stopPropagation()}>
                      <button className="host-popup-close" onClick={closePopup}>
                        ✕
                      </button>
                      <h2 className="host-popup-title">{selectedTable.name}</h2>
                      <p className="host-popup-sub">Capacity: {selectedTable.capacity}</p>

                      {selectedTable.status === "occupied" ? (
                        <>
                          <p className="host-popup-sub" style={{ marginTop: "1rem" }}>
                            This table is currently occupied.
                          </p>
                          <button
                            className="host-popup-btn-green"
                            onClick={() => markOpened(selectedTable)}
                          >
                            Mark as Open
                          </button>
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            placeholder="Customer Name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="host-popup-input"
                            required
                          />
                          <input
                            type="email"
                            placeholder="Customer Email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="host-popup-input"
                            required
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

            {/* -------- RESERVATION TABLE -------- */}
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

            {/* -------- CREATE RESERVATION -------- */}
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
