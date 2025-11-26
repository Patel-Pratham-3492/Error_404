import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleNavbar from "../RoleNavbar/RoleNavbar";
import "./waiter.css";

export default function Waiter() {
  const [user, setUser] = useState(null);
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  // Fetch user and tables
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

      // Fetch tables assigned to this waiter
      fetch("http://localhost:5000/api/tables")
        .then((res) => res.json())
        .then((allTables) => {
          const assignedTables = allTables.filter(
            (t) => t.AssignedWaiter === parsedUser.waiterId
          );
          setTables(assignedTables);
        })
        .catch((err) => console.error(err));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="waiter-container">
      {user && <RoleNavbar role={user.role + " : " + user.waiterId} name={user.firstName} />}

      <h1>Your Assigned Tables</h1>

      {tables.length === 0 ? (
        <p>No tables assigned yet.</p>
      ) : (
        <div className="tables-grid">
          {tables.map((t) => (
            <div key={t.name} className="table-card assigned">
              <h3>{t.name}</h3>
              <p>Capacity: {t.capacity}</p>
              <p>Customer: {t.customerName || "None"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
