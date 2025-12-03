import { useEffect, useState } from "react";
import "./Assign.css";

export default function Assign() {
  const [waiters, setWaiters] = useState([]);
  const [tables, setTables] = useState([]);

  const [selectedWaiter, setSelectedWaiter] = useState("");
  const [selectedTables, setSelectedTables] = useState([]);

  const [popup, setPopup] = useState({ show: false, type: "loading", message: "" });

  // 🔥 Load tables from backend
  const loadTables = () => {
    fetch("http://3.128.94.231:5000/api/tables")
      .then((res) => res.json())
      .then(setTables)
      .catch((err) => console.error("Failed to fetch tables:", err));
  };

  // Fetch waiters and tables on mount
  useEffect(() => {
    fetch("http://3.128.94.231:5000/api/waiters")
      .then((res) => res.json())
      .then(setWaiters)
      .catch((err) => console.error("Failed to fetch waiters:", err));

    loadTables();
  }, []);

  // Toggle table selection
  const handleTableSelect = (tableName) => {
    setSelectedTables((prev) =>
      prev.includes(tableName)
        ? prev.filter((t) => t !== tableName)
        : [...prev, tableName]
    );
  };

  // Assign waiter to selected tables
  const handleAssign = async () => {
    if (!selectedWaiter || selectedTables.length === 0) return;

    setPopup({ show: true, type: "loading", message: "Assigning..." });

    try {
      const res = await fetch("http://3.128.94.231:5000/api/tables/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ waiterId: selectedWaiter, tables: selectedTables }),
      });

      if (res.ok) {
        setPopup({ show: true, type: "success", message: "Assigned Successfully!" });
        setTimeout(() => {
          setPopup({ show: false });

          // Reset selections
          setSelectedTables([]);
          setSelectedWaiter("");

          // Refresh tables
          loadTables();
        }, 3000);
      } else {
        throw new Error("Assign failed");
      }
    } catch (err) {
      setPopup({ show: true, type: "error", message: "Please try again!" });
      setTimeout(() => setPopup({ show: false }), 3000);
    }
  };

  // Remove waiter from selected tables
  const handleRemove = async () => {
    if (selectedTables.length === 0) return;

    setPopup({ show: true, type: "loading", message: "Removing..." });

    try {
      const res = await fetch("http://3.128.94.231:5000/api/tables/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tables: selectedTables }),
      });

      if (res.ok) {
        setPopup({ show: true, type: "success", message: "Removed Successfully!" });
        setTimeout(() => {
          setPopup({ show: false });

          // Reset selections
          setSelectedTables([]);
          setSelectedWaiter("");

          // Refresh tables
          loadTables();
        }, 3000);
      } else {
        throw new Error("Remove failed");
      }
    } catch (err) {
      setPopup({ show: true, type: "error", message: "Please try again!" });
      setTimeout(() => setPopup({ show: false }), 3000);
    }
  };

  return (
    <div className="assign-container">
      <h1>Assign Waiters to Tables</h1>

      {/* Waiter Selection */}
      <div className="select-box">
        <label>Select Waiter:</label>
        <select
          value={selectedWaiter}
          onChange={(e) => setSelectedWaiter(e.target.value)}
        >
          <option value="">-- Select Waiter --</option>
          {waiters.map((w) => (
            <option key={w.waiterId} value={w.waiterId}>
              {w.firstName} {w.lastName} ({w.waiterId})
            </option>
          ))}
        </select>
      </div>

      {/* Tables Grid */}
      <h2>Select Tables:</h2>
      <div className="tables-grid">
        {tables.map((t) => (
          <div
            key={t.name}
            className={`table-card ${selectedTables.includes(t.name) ? "selected" : ""}`}
            onClick={() => handleTableSelect(t.name)}
          >
            <h3>{t.name}</h3>
            <p>Capacity: {t.capacity}</p>
            <p>Waiter: {t.AssignedWaiter || "None"}</p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="btn-row">
        <button className="assign-btn" onClick={handleAssign}>
          Assign
        </button>
        <button className="remove-btn" onClick={handleRemove}>
          Remove
        </button>
      </div>

      {/* POPUP */}
      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-box">
            {popup.type === "loading" && <div className="loader"></div>}
            {popup.type === "success" && <div className="success-icon">✔</div>}
            {popup.type === "error" && <div className="error-icon">✖</div>}
            <p>{popup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
