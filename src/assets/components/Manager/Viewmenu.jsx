import { useState, useEffect } from "react";
import "./viewmenu.css";

export default function ViewMenu() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("food"); // toggle between food & beverage
  const [subCategories] = useState({
    food: ["Starters", "Main Course", "Desserts"],
    beverage: ["Soft Drinks", "Coffee/Tea", "Cocktails"]
  });
  const [filterSubCategory, setFilterSubCategory] = useState("");

  // Popup state
  const [popup, setPopup] = useState({ show: false, status: "loading", message: "" });

  // Fetch menu items
  const fetchItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/menu");
      const data = await res.json();
      console.log("Fetched items:", data);
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Show popup
  const showPopup = (status, message) => {
    setPopup({ show: true, status, message });
    setTimeout(() => setPopup({ show: false, status: "loading", message: "" }), 3000);
  };

  // Delete item
  const handleDelete = async (id) => {
    showPopup("loading", "Deleting...");
    try {
      const res = await fetch(`http://localhost:5000/api/menu/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await res.json();
      fetchItems();
      showPopup("success", "Item deleted successfully!");
    } catch (err) {
      showPopup("error", "Failed to delete item. Please try again.");
    }
  };

  // Update item
  const handleUpdate = async (item) => {
    showPopup("loading", "Updating...");
    try {
      const formData = new FormData();
      formData.append("category", item.category);
      formData.append("subCategory", item.subCategory);
      formData.append("name", item.name);
      formData.append("price", item.price);
      formData.append("special", item.special);
      if (item.imageFile) formData.append("image", item.imageFile);

      const res = await fetch(`http://localhost:5000/api/menu/${item._id}`, {
        method: "PUT",
        body: formData
      });
      if (!res.ok) throw new Error("Update failed");
      await res.json();
      fetchItems();
      showPopup("success", "Item updated successfully!");
    } catch (err) {
      showPopup("error", "Failed to update item. Please try again.");
    }
  };

  // Change fields in state
  const handleFieldChange = (id, field, value) => {
    setItems(items.map(item => item._id === id ? { ...item, [field]: value } : item));
  };

  // Filter items by selected category and sub-category
  const filteredItems = items.filter(item =>
    item.category === category &&
    (!filterSubCategory || item.subCategory === filterSubCategory)
  );

  return (
    <div className="viewmenu-container">
      {/* Popup */}
      {popup.show && (
        <div className={`popup ${popup.status}`}>
          {popup.status === "loading" && <div className="loader"></div>}
          {popup.status === "success" && <div className="done">✔</div>}
          {popup.status === "error" && <div className="error">✖</div>}
          <p>{popup.message}</p>
        </div>
      )}

      {/* Category Toggle */}
      <div className="category-toggle">
        <button
          className={category === "food" ? "active" : ""}
          onClick={() => { setCategory("food"); setFilterSubCategory(""); }}
        >
          Food
        </button>
        <button
          className={category === "beverage" ? "active" : ""}
          onClick={() => { setCategory("beverage"); setFilterSubCategory(""); }}
        >
          Beverages
        </button>
      </div>

      {/* Sub-Category Filter */}
      <div className="subcat-filter">
        <label>Filter by Sub-Category:</label>
        <select
          value={filterSubCategory}
          onChange={e => setFilterSubCategory(e.target.value)}
        >
          <option value="">All</option>
          {(subCategories[category] || []).map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      {/* Menu Items */}
      <div className="menu-items">
        {filteredItems.length === 0 ? (
          <p>No items yet.</p>
        ) : (
          filteredItems.map(item => (
            <div key={item._id} className="menu-item-card">
              {item.image && (
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="menu-item-image"
                />
              )}
              <div className="menu-item-details">
                <input
                  type="text"
                  value={item.name}
                  onChange={e => handleFieldChange(item._id, "name", e.target.value)}
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={e => handleFieldChange(item._id, "price", e.target.value)}
                />
                <select
                  value={item.subCategory}
                  onChange={e => handleFieldChange(item._id, "subCategory", e.target.value)}
                >
                  {(subCategories[category] || []).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                <label>
                  <input
                    type="checkbox"
                    checked={item.special}
                    onChange={e => handleFieldChange(item._id, "special", e.target.checked)}
                  /> Special
                </label>
              </div>
              <div className="menu-item-actions">
                <button className="update-btn" onClick={() => handleUpdate(item)}>Update</button>
                <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
