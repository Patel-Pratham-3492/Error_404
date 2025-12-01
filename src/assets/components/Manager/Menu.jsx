import { useState, useEffect } from "react";
import { useRef } from "react";
import "./menu.css";

export default function Menu() {
  const fileInputRef = useRef(null);
  const [category, setCategory] = useState("food");
  const [subCategory, setSubCategory] = useState("");
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [special, setSpecial] = useState(false);
  const [Description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Popup state
  const [popup, setPopup] = useState({ show: false, status: "loading", message: "" });

  // Sub-categories
  const subCategories = {
    food: ["Starters", "Main Course", "Desserts"],
    beverage: ["Soft Drinks", "Coffee/Tea", "Cocktails"]
  };

  const [filterSubCategory, setFilterSubCategory] = useState(""); // for filtering

  // Fetch menu items
  const fetchItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/menu");
      const data = await res.json();
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

  // Image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Add item
  const handleAddItem = async () => {
  if (!name || !price || !subCategory) return;

  const formData = new FormData();
  formData.append("category", category);
  formData.append("subCategory", subCategory);
  formData.append("name", name);
  formData.append("price", price);
  formData.append("special", special);
  formData.append("Description", Description);
  if (image) formData.append("image", image);

  try {
    const res = await fetch("http://localhost:5000/api/menu", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Add failed");
    await res.json();
    fetchItems();

    // Reset form
    setName("");
    setPrice("");
    setDescription("");
    setSpecial(false);
    setSubCategory("");
    setImage(null);
    setImagePreview(null);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }

    showPopup("success", "Item added successfully!");
  } catch (err) {
    showPopup("error", "Failed to add item. Please try again.");
  }
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
      formData.append("Description", Description);
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

  const handleFieldChange = (id, field, value) => {
    setItems(items.map(item => item._id === id ? { ...item, [field]: value } : item));
  };

  // Filtered items by category and subCategory
  const filteredItems = items.filter(item =>
    item.category === category && (!filterSubCategory || item.subCategory === filterSubCategory)
  );

  return (
    <div className="menu-container">
      <h1>Menu Management</h1>

      {/* Popup */}
      {popup.show && (
        <div className={`popup ${popup.status}`}>
          {popup.status === "loading" && <div className="loader"></div>}
          {popup.status === "success" && <div className="done">✔</div>}
          {popup.status === "error" && <div className="error">✖</div>}
          <p>{popup.message}</p>
        </div>
      )}

      {/* Add Menu Item Form */}
      <div className="menu-form">
        <label>Category:</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="food">Food</option>
          <option value="beverage">Beverage</option>
        </select>

        <label>Sub-Category:</label>
        <select value={subCategory} onChange={e => setSubCategory(e.target.value)}>
          <option value="">-- Select Sub-Category --</option>
          {subCategories[category].map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>

        <label>Item Name:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} />

        <label>Price:</label>
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} />

        <label>
          <input type="checkbox" checked={special} onChange={e => setSpecial(e.target.checked)} /> Special
        </label>

        <label>Description : </label>
        <input type="text" value={Description} onChange={e => setDescription(e.target.value)} />

        <label>Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange}  ref={fileInputRef} />
        {imagePreview && <img src={imagePreview} alt="preview" className="preview-image" />}

        <button onClick={handleAddItem} className="add-btn">Add Item</button>
      </div>
    </div>
  );
}
