import React, {useState, useRef, useEffect} from "react";
import { FaUtensils, FaCheckCircle, FaFireAlt, FaUserCircle,FaSignOutAlt,FaChevronDown } from "react-icons/fa";
import "./chef.css";
import { table, tr } from "framer-motion/client";

function Chef (){
  const [activeTab, setActiveTab]= useState("active");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const [orders, setOrders]= useState([
    { id: 1, item: "Alfredo Pasta", table: "A3", status: "Preparing", note: "Extra Spicy" },
    { id: 2, item: "Green Salad", table: "B1", status: "Pending", note: "Less Salt" },
    { id: 3, item: "Margherita Pizza", table: "B2", status: "Pending", note: "Cheese Burst" },
  ]);

  const [completedOrders, setCompletedOrders] = useState([]);
  // close the dropdown clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)){
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return() => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Update order status
  const updateStatus = (id, newStatus) => {
    setOrders((prev) => 
      prev.map((o) => (o.id === id ? {...o, status: newStatus} :o))

    );
  };

  // mark as done
  const markAsDone = (id) => {
    setOrders((prev)=>{
      // const remaining = prev.filter((o) => o.id !==id);
      const doneOrder = prev.find((o)=> o.id ===id);
      if (doneOrder){
        setCompletedOrders((old) => [...old, {...doneOrder, status:"Done"}]); 
      }
      return prev.filter((o) => o.id !==id);
    });
  };

  // Sort active orders
  const sortedOrders = [...orders].sort((a,b)=>{
    const priority = {Preparing:1, Pending:2};
    return priority[a.status]- priority[b.status];
  });

  return(
    <div className="chef-container">

      {/* NAVBAR */}
      <header className="chef-navbar">
        <div className="chef-title">
          <FaUtensils className="chef-nav-icon"/>
          <h2>Chef Dashboard</h2>
        </div>

        <div className="chef-profile" ref={dropdownRef}>
          <FaUserCircle 
          className="chef-profile-icon" onClick={(e) => {
            e.stopPropagation(); setDropdownOpen(!dropdownOpen);
          }}
          />

          {dropdownOpen && (
            <div className="chef-dropdown">
              <p><FaUserCircle/> Profile</p>
              <p className="logout"><FaSignOutAlt/> Logout</p>
            </div>
          )}
        </div>
      </header>

      {/* tabs */}
      <div className="chef-tabs">
        <button className={activeTab === "active" ? "chef-tab tab-tab-active" : "chef-tab"}
        onClick={() => setActiveTab("active")}>
          Active Orders
        </button>

        <button className={activeTab === "completed" ? "chef-tab tab-tab-active" : "chef-tab"}
        onClick={() => setActiveTab("completed")}>
          Completed Orders</button>
      </div>

      {/* Active orders */}
      {activeTab === "active" && (
        <section className="chef-section">
          <h3>Active Orders</h3>

          {sortedOrders.length === 0 ? (
            <p className="no-orders"> No Active orders</p>
          ) : (
            <table className="chef-table">
              <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Table</th>
                <th>Status</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
              </thead>

              <tbody>
                {sortedOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.item}</td>
                    <td>{order.table}</td>

                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}</span>
                    </td>

                    <td>
                      <span className="note-badge">{order.note}</span>
                    </td>

                    <td className="chef-actions">
                      {order.status === "Pending" && (
                        <button className="btn start" onClick={() => updateStatus(order.id, "Preparing")}>
                          <FaFireAlt/> Start
                        </button>
                      )}

                      {order.status === "Preparing" && (
                        <button className="btn done" onClick={() => markAsDone(order.id)}>
                          <FaCheckCircle/> Done
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {/* Completed orders */}
      {activeTab === "completed" && (
        <section className="chef-section">
          <h3>Completed Orders</h3>

          {completedOrders.length === 0 ? (
            <p className="no-orders">No completed orders yet</p>
          ):(
            <table className="chef-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item</th>
                  <th>Table</th>
                  <th>Note</th>
                </tr>
              </thead>

              <tbody>
                {completedOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.item}</td>
                    <td>{order.table}</td>
                    <td>{order.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
 }

 export default Chef;