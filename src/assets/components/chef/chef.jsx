import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleNavbar from "../RoleNavbar/RoleNavbar"; // adjust the path as needed
import "./chef.css";


export default function Chef() {  // make sure 'user' is passed as prop
  const [orders, setOrders] = useState([]);

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


  useEffect(() => {
  const interval = setInterval(() => {
    fetchOrders(); // call your fetchOrders function
  }, 30000); // 30000 ms = 30 seconds

  // Clean up the interval on component unmount
  return () => clearInterval(interval);
}, []);



  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/order/today");
      const data = await res.json();
      if (data.success) {
        const filtered = data.orders.filter(o => o.status !== "done");
        setOrders(filtered.sort((a, b) => a.priority - b.priority));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/order/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chef-container">
      {/* RoleNavbar at the top */}
      {user && <RoleNavbar role={user.role} name={user.firstName} />}

      <h1 className="chef-h1">Chef Dashboard</h1>
      <table className="chef-table">
        <thead>
          <tr>
            <th>Table</th>
            <th>Item</th>
            <th>Customization</th>
            <th>Qty</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6">No pending orders</td>
            </tr>
          ) : (
            orders.map(order => (
              <tr key={order._id}>
                <td>{order.tableName}</td>
                <td>{order.items[0]?.name || "N/A"}</td>
                <td>{order.items[0]?.customization || "N/A"}</td>
                <td>{order.items[0]?.quantity || 0}</td>
                <td>{order.priority}</td>
                <td className={`status-cell ${order.status}`}>{order.status}</td>
                <td>
                  {order.status === "pending" && (
                    <button
                      className="action-btn preparing"
                      onClick={() => updateStatus(order._id, "preparing")}
                    >
                      Preparing
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button
                      className="action-btn done"
                      onClick={() => updateStatus(order._id, "done")}
                    >
                      Done
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
