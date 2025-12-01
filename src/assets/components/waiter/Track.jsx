import { useState, useEffect } from "react";
import "./track.css";

export default function Track({ table }) {
  const [orders, setOrders] = useState([]);
  const [popup, setPopup] = useState({ type: "", message: "", visible: false });
  const [editOrder, setEditOrder] = useState(null);
  const [editQty, setEditQty] = useState(1);
  const [editCustom, setEditCustom] = useState("");

  // Fetch orders for particular table
  const fetchOrders = async () => {
    if (!table) return;
    try {
      const res = await fetch(`http://localhost:5000/api/order/table/${table._id}`);
      const data = await res.json();
      if (data.success) {
        // Filter out orders that are "done" and only keep pending/paymentstatus !== "done"
        const pendingOrders = data.orders.filter(
          order => order.paymentstatus === "pending" && order.status !== "done"
        );
        setOrders(pendingOrders);
      } else {
        setOrders([]);
        showPopup("error", data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
      showPopup("error", "Server error while fetching orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [table]);

  const showPopup = (type, message) => {
    setPopup({ type, message, visible: true });
    setTimeout(() => setPopup(prev => ({ ...prev, visible: false })), 3000);
  };

  const openEditPopup = (order, item) => {
    setEditOrder({ ...order, itemIndex: order.items.indexOf(item) });
    setEditQty(item.quantity);
    setEditCustom(item.customization || "");
  };

  const handleUpdateOrder = async () => {
    const { _id, itemIndex } = editOrder;

    const updatedItems = [...editOrder.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      quantity: editQty,
      customization: editCustom,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/order/${_id}/update-item`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedItems }),
      });

      const data = await res.json();
      if (data.success) {
        showPopup("success", "Order updated");
        setEditOrder(null);
        fetchOrders();
      } else showPopup("error", data.message);
    } catch (err) {
      console.error(err);
      showPopup("error", "Server error while updating");
    }
  };

  const handleCancelOrder = async (orderId) => {
    showPopup("success", "Deleting...");

    try {
      const res = await fetch(`http://localhost:5000/api/order/${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        showPopup("success", "Order deleted");
        fetchOrders();
      } else showPopup("error", data.message);
    } catch (err) {
      console.error(err);
      showPopup("error", "Error deleting order");
    }
  };

  // Handle empty state gracefully
  if (!orders || orders.length === 0) {
    return (
      <div className="track-container">
        <h2 className="main-title">Track Orders</h2>
        <p>No pending orders for this table.</p>
      </div>
    );
  }

  // Group food & beverage items
  const foodItems = [];
  const beverageItems = [];

  orders.forEach(order => {
    order.items.forEach(item => {
      if (item.category === "food") foodItems.push({ order, item });
      else if (item.category === "beverage") beverageItems.push({ order, item });
    });
  });

  return (
    <div className="track-container">
      {/* Popup */}
      {popup.visible && (
        <div className={`popup ${popup.type === "success" ? "success-popup" : "error-popup"}`}>
          {popup.message}
        </div>
      )}

      {/* Edit Popup */}
      {editOrder && (
        <div className="edit-popup">
          <h3>Edit Item</h3>

          <label>Quantity:</label>
          <input
            type="number"
            min={1}
            value={editQty}
            onChange={(e) => setEditQty(Number(e.target.value))}
          />

          <label>Customization:</label>
          <input
            type="text"
            value={editCustom}
            onChange={(e) => setEditCustom(e.target.value)}
          />

          <div className="edit-buttons">
            <button onClick={handleUpdateOrder}>Update</button>
            <button className="cancel-btn" onClick={() => setEditOrder(null)}>Cancel</button>
          </div>
        </div>
      )}

      <h2 className="main-title">Track Orders</h2>

      {/* FOOD SECTION */}
      {foodItems.length > 0 && <h3 className="section-title">FOOD</h3>}
      {foodItems.map(({ order, item }, idx) => {
        const showButtons = order.status !== "preparing";
        return (
          <div className="order-item-card" key={idx}>
            <div className="left-section">
              <div className="item-name">{item.name}</div>
              <div className="item-qty">Qty: {item.quantity}</div>
              <div className="item-custom">Custom: {item.customization || "None"}</div>
            </div>

            <div className="right-top">
              <div className="status">Status: {order.status}</div>
              <div className="priority">Priority: {order.priority}</div>
            </div>

            {showButtons && (
              <div className="right-bottom">
                <button onClick={() => openEditPopup(order, item)}>Edit</button>
                <button className="delete-btn" onClick={() => handleCancelOrder(order._id)}>Cancel</button>
              </div>
            )}
          </div>
        );
      })}

      {/* BEVERAGE SECTION */}
      {beverageItems.length > 0 && <h3 className="section-title beverage">BEVERAGE</h3>}
      {beverageItems.map(({ order, item }, idx) => {
        const showButtons = order.status !== "preparing";
        return (
          <div className="order-item-card" key={idx}>
            <div className="left-section">
              <div className="item-name">{item.name}</div>
              <div className="item-qty">Qty: {item.quantity}</div>
              <div className="item-custom">Custom: {item.customization || "None"}</div>
            </div>

            <div className="right-top">
              <div className="status">Status: {order.status}</div>
              <div className="priority">Priority: {order.priority}</div>
            </div>

            {showButtons && (
              <div className="right-bottom">
                <button onClick={() => openEditPopup(order, item)}>Edit</button>
                <button className="delete-btn" onClick={() => handleCancelOrder(order._id)}>Cancel</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
