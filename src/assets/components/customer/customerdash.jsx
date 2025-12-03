import { useEffect, useState } from "react";

export default function TableDashboard() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  // Fetch all tables
  const fetchTables = async () => {
    try {
      const res = await fetch("http://3.128.94.231:5000/api/table");
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

  // Mark a table as occupied
  const markOccupied = async (table) => {
    if (!table?._id) {
      console.error("Table or _id is missing", table);
      return;
    }

    try {
      const res = await fetch(
        `http://3.128.94.231:5000/api/table/occupy/${table._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: table.customerName || "John Doe", // example fallback
            customerEmail: table.customerEmail || "customer@example.com",
          }),
        }
      );
      const data = await res.json();
      if (!data.success) console.error("Failed to mark occupied:", data.message);
      else {
        console.log("Table marked occupied!", data.table);
        fetchTables(); // refresh list
      }
    } catch (err) {
      console.error("Error marking table occupied:", err);
    }
  };

  // Mark a table as open
  const markOpened = async (table) => {
    if (!table?._id) {
      console.error("Table or _id is missing", table);
      return;
    }

    try {
      const res = await fetch(
        `http://3.128.94.231:5000/api/table/open/${table._id}`,
        { method: "PUT" }
      );
      const data = await res.json();
      if (!data.success) console.error("Failed to open table:", data.message);
      else {
        console.log("Table marked open!", data.table);
        fetchTables();
      }
    } catch (err) {
      console.error("Error marking table open:", err);
    }
  };

  return (
    <div>
      <h2>Tables</h2>
      {tables.length === 0 ? (
        <p>No tables found.</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Name</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Customer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table._id}>
                <td>{table.name}</td>
                <td>{table.capacity}</td>
                <td>{table.status}</td>
                <td>{table.customerName || "-"}</td>
                <td>
                  {table.status === "open" ? (
                    <button onClick={() => markOccupied(table)}>Occupy</button>
                  ) : (
                    <button onClick={() => markOpened(table)}>Open</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
