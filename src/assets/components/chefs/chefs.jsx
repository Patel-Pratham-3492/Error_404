import React, {useState} from "react";
import { FaUtensils, FaCheckCircle, FaClock, FaFireAlt } from "react-icons/fa";
import "./chefs.css";

function Chefs() {
  // Sample order data
  const [orders, setOrders] = useState([
    {id: 1, item: "Alfredo", table: "A3", status:"Preparing", note:"Extra Spicy"},
    {id: 2, item: "Salad", table: "B1", status:"Pending", note:"Saulty"},
    {id: 3, item: "Pizza", table: "B2", status:"Done", note:"Normal Spice"},
  ]);
  const [doneOrders, setDoneOrders] = useState([]);

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
    prev.map((o) => (o.id === id ? {...o, status: newStatus} : o )
  ));
  };

  // Mark the oeder as done
  const markAsDone = (id) => {
    setOrders((prev) => {
      const updated = prev.filter((o)=> o.id !==id);
      const doneOrder = prev.find((o) => o.id === id);
      if (doneOrder) setDoneOrders((old) => [...old, {...doneOrder, status:"Done"}]);
      return updated;
    });
  };

  // sort the orders preparing and pending 
  const sortedOrders = [...orders].sort((a,b)=>{
    const orderPriority = {Preparing:1, Pending:2};
    return orderPriority[a.status] - orderPriority[b.status];
  });
  return(
    <div className="chef-countiner">
      <header className="chef-header">
        <FaUtensils className="chef-icon" />
      <h2>Chef Dashboard</h2>
      </header>

      <section className="orders-section">
        <h3>Active Orders</h3>
        {sortedOrders.length === 0 ? (
          <p className="no-orders">No active orders right now 🍽️</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item</th>
                <th>Table</th>
                <th>Status</th>
                <th>Special Note</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {sortedOrders.map((order)=> (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.item}</td>
                  <td>{order.table}</td>

                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                      </span>
                  </td>
                  <td>
                    <input type="text" className="note-input" value={order.note}
                    onChange={(e) => updateStatus(order.id, e.target.value)} 
                    placeholder="Add note..."/>
                  </td>
                  <td className="status-buttons">
                    {order.status === "Pending" && (
                      <button className="btn preparing" onClick={() => updateStatus(order.id, "Preparing")}>
                        <FaFireAlt /> Start Preparing
                      </button>
                    )}
                    {order.status === "Preparing" &&(
                      <button className="btn done" onClick={() => markAsDone(order.id)}>
                        <FaCheckCircle />Mark Done
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Done Orders Section */}
      {doneOrders.length > 0 &&(
        <section className="done-orders">
          <h3>Complated Orders</h3>
          <table className="orders-tables">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item</th>
                <th>Table</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {doneOrders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.item}</td>
                  <td>{o.table}</td>
                  <td>{o.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default Chefs;