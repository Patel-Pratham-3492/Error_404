import { useState, useEffect } from "react";
import "./menus.css";

export default function Menus({ table }) {
  const [menuItems, setMenuItems] = useState([]);
  const [category, setCategory] = useState("food");
  const [specialTab, setSpecialTab] = useState(false);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [activeSubCategory, setActiveSubCategory] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [qty, setQty] = useState(1);
  const [custom, setCustom] = useState("");
  const [priority, setPriority] = useState(1);

  const [popup, setPopup] = useState({ type: "", message: "", visible: false });

  // Fetch menu items from backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://3.128.94.231:5000/api/menu");
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        showPopup("error", "Failed to fetch menu");
      }
    };
    fetchMenu();
  }, []);

  // Generate subcategories dynamically
  useEffect(() => {
    const filtered = menuItems.filter(
      (i) => i.category === category && i.special === specialTab
    );
    const uniqueSubs = [...new Set(filtered.map((i) => i.subCategory))];
    setSubCategoryList(uniqueSubs);
    setActiveSubCategory(uniqueSubs[0] || "");
  }, [menuItems, category, specialTab]);

  const showPopup = (type, message) => {
    setPopup({ type, message, visible: true });
    setTimeout(() => setPopup({ ...popup, visible: false }), 4000);
  };

  const openAddPopup = (item, index = null) => {
  if (index !== null) {
    // Editing an existing order item
    const orderItem = orderItems[index];
    setSelectedItem({ ...orderItem, index });
    setQty(orderItem.quantity);         // <-- use actual quantity
    setCustom(orderItem.customization); // <-- use actual customization
  } else {
    // Adding new item
    setSelectedItem({ ...item, index: null });

    // Check if the same name already exists
    const existingIndex = orderItems.findIndex(
      (i) => i.name === item.name && i.customization === (custom || "None")
    );
    if (existingIndex !== -1) {
      // If exists, prefill qty with existing quantity
      setQty(orderItems[existingIndex].quantity);
      setCustom(orderItems[existingIndex].customization);
    } else {
      setQty(1);
      setCustom("");
    }
  }
  setPopupVisible(true);
};

const confirmAddItem = () => {
  if (selectedItem.index !== null) {
    // Editing an existing item
    const updatedOrders = [...orderItems];
    updatedOrders[selectedItem.index] = {
      ...updatedOrders[selectedItem.index],
      quantity: Number(qty),
      customization: custom || "None",
    };
    setOrderItems(updatedOrders);
    showPopup("success", "Order updated successfully!");
  } else {
    // Check if same name + customization exists
    const existingIndex = orderItems.findIndex(
      (i) => i.name === selectedItem.name && i.customization === (custom || "None")
    );
    if (existingIndex !== -1) {
      const updatedOrders = [...orderItems];
      updatedOrders[existingIndex].quantity += Number(qty);
      setOrderItems(updatedOrders);
      showPopup("success", "Quantity updated for existing item!");
    } else {
      setOrderItems((prev) => [
        ...prev,
        {
          ...selectedItem,
          quantity: Number(qty),
          customization: custom || "None",
        },
      ]);
      showPopup("success", "Item added to order!");
    }
  }
  setPopupVisible(false);
};

  // Submit order to backend
  const submitOrder = async () => {
    if (!orderItems.length) return showPopup("error", "No items in order!");
    try {
      const payload = {
        tableId: table._id,
        tableName: table.name,
        customerCount: table.customerCount || 1,
        newSessionId: table.newSessionId,
        priority: Number(priority),
        paymentstatus: "pending",
        items: orderItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          customization: item.customization,
          image: item.image || "",
          category: item.category,
        })),
      };
      const res = await fetch("http://3.128.94.231:5000/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) return showPopup("error", data.message || "Failed to send order");
      showPopup("success", "Order sent to chef!");
      setOrderItems([]);
      setPriority(1);
    } catch (err) {
      console.error(err);
      showPopup("error", "Server error. Try again!");
    }
  };

  const filteredItems = menuItems.filter(
    (i) =>
      i.category === category &&
      i.special === specialTab &&
      i.subCategory === activeSubCategory
  );

  const removeItem = (index) => {
  const updated = [...orderItems];
  updated.splice(index, 1);
  setOrderItems(updated);
};


  return (
    <div className="menus-container">
      {/* Success/Error Popup */}
      {popup.visible && (
        <div className={`popup ${popup.type === "success" ? "success-popup" : "error-popup"}`}>
          <span className="popup-icon">{popup.type === "success" ? "✅" : "❌"}</span>
          {popup.message}
        </div>
      )}

      {/* Category Tabs */}
      <div className="category-tabs">
        <button
          className={category === "food" && !specialTab ? "active" : ""}
          onClick={() => {
            setCategory("food");
            setSpecialTab(false);
          }}
        >
          Food
        </button>
        <button
          className={category === "beverage" && !specialTab ? "active" : ""}
          onClick={() => {
            setCategory("beverage");
            setSpecialTab(false);
          }}
        >
          Beverage
        </button>
        <button
          className={category === "food" && specialTab ? "active" : ""}
          onClick={() => {
            setCategory("food");
            setSpecialTab(true);
          }}
        >
          Special Food
        </button>
        <button
          className={category === "beverage" && specialTab ? "active" : ""}
          onClick={() => {
            setCategory("beverage");
            setSpecialTab(true);
          }}
        >
          Special Beverage
        </button>
      </div>

      {/* Subcategory Tabs */}
      {subCategoryList.length > 0 && (
        <div className="subcategory-tabs">
          {subCategoryList.map((sub) => (
            <button
              key={sub}
              className={activeSubCategory === sub ? "active" : ""}
              onClick={() => setActiveSubCategory(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Menu Items */}
      <div className="menu-items">
        {filteredItems.length === 0 && <p>No items found.</p>}
        {filteredItems.map((item) => (
          <div key={item._id} className="menu-item-card">
            {item.image && (
              <img
                src={`http://3.128.94.231:5000${item.image}`}
                alt={item.name}
                className="menu-item-image"
              />
            )}
            <h4>{item.name} - ${item.price}</h4>
            <p className="menu-item-description">{item.Description}</p>
            <button onClick={() => openAddPopup(item)}>Add to Order</button>
          </div>
        ))}
      </div>

      {/* Add/Edit Popup */}
      {popupVisible && selectedItem && (
        <div className="popup-overlay" onClick={() => setPopupVisible(false)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={() => setPopupVisible(false)}>
              ✕
            </button>
            <h3>{selectedItem.name}</h3>
            {selectedItem.image && (
              <img
                src={`http://3.128.94.231:5000${selectedItem.image}`}
                alt={selectedItem.name}
                className="popup-image"
              />
            )}
            <p>{selectedItem.description}</p>
            <label>
              Quantity:
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </label>
            <label>
              Customization:
              <input
                type="text"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
              />
            </label>
            <button className="confirm-btn" onClick={confirmAddItem}>
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Current Order */}
      {orderItems.length > 0 && (
        <div className="current-order">
          <h4>Current Order</h4>
          {orderItems.map((item, index) => (
            <div key={index} className="order-row">
              {item.name} x{item.quantity} ({item.customization})
              <div className="order-row-actions">
                <button onClick={() => openAddPopup(item, index)}>Edit ✏️</button>
                <button onClick={() => removeItem(index)}>Remove ❌</button>
              </div>
            </div>
          ))}

          <label className="priority-label">
            Priority:
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </label>

          <button onClick={submitOrder}>Submit Order to Chef</button>
        </div>
      )}
    </div>
  );
}
