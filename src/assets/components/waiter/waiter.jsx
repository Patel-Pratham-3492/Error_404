import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleNavbar from "../RoleNavbar/RoleNavbar";
import "./waiter.css";

export default function Waiter() {
  const [user, setUser] = useState(null);
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  // Fetch user and tables
  const fetchTables = async (waiterId) => {
    try {
      const res = await fetch("http://localhost:5000/api/table");
      const data = await res.json();
      if (data.success) {
        // Only tables assigned to this waiter
        const assignedTables = data.tables.filter(
          (t) => t.AssignedWaiter === waiterId
        );
        setTables(assignedTables);
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
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchTables(parsedUser.waiterId);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Mark table as free
  const freeTable = async (table) => {
    if (!window.confirm(`Are you sure you want to free table ${table.name}?`))
      return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/table/free/${table._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (data.success) {
        // Refresh tables
        fetchTables(user.waiterId);
      } else {
        alert("Failed to free the table");
      }
    } catch (err) {
      console.error(err);
      alert("Error freeing table");
    }
  };

  return (
    <div className="waiter-container">
      {user && (
        <RoleNavbar
          role={user.role + " : " + user.waiterId}
          name={user.firstName}
        />
      )}

      <h1>Your Assigned Tables</h1>

      {tables.length === 0 ? (
        <p>No tables assigned yet.</p>
      ) : (
        <div className="tables-grid">
          {tables.map((t) => (
            <div
              key={t._id}
              className={`table-card ${
                t.status === "occupied" ? "occupied" : "free"
              }`}
            >
              <h3>{t.name}</h3>
              <p>Capacity: {t.capacity}</p>
              <p>Customer: {t.customerName || "None"}</p>
              {t.status === "occupied" && (
                <button
                  className="free-table-btn"
                  onClick={() => freeTable(t)}
                >
                  Free Table
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
