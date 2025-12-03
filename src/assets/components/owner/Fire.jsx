import React, { useEffect, useState } from "react";
import "./fire.css";

export default function Fire() {
  const [users, setUsers] = useState([]);
  const [popup, setPopup] = useState({ visible: false, status: "loading", message: "", userEmail: "" });
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://3.128.94.231:5000/api/users/all");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle fire button click
  const handleFireClick = (user) => {
    setSelectedUser(user);
    setPopup({ visible: true, status: "confirm", message: `Are you sure you want to fire ${user.firstName} ${user.lastName}?` });
  };

  // Confirm firing
  const handleConfirmFire = async () => {
    setPopup({ visible: true, status: "loading", message: "Firing..." });

    try {
      const response = await fetch(`http://3.128.94.231:5000/api/users/fire/${selectedUser._id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fire user");

      setPopup({ visible: true, status: "success", message: "Done" });

      // Refresh user list
      fetchUsers();
    } catch (err) {
      console.error(err);
      setPopup({ visible: true, status: "error", message: err.message || "Please try again" });
    }

    setTimeout(() => setPopup({ visible: false, status: "loading", message: "" }), 6000);
  };

  // Cancel popup
  const handleCancel = () => {
    setPopup({ visible: false, status: "loading", message: "" });
  };

  return (
    <div className="fire-page">
      <h1 className="page-title">Fire Staff</h1>
      <p className="page-desc">Remove employees safely from the system.</p>

      <table className="fire-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="fire-btn" onClick={() => handleFireClick(user)}>Fire</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup */}
      {popup.visible && (
        <div className="popup">
          {popup.status === "loading" && <div className="loader"></div>}
          {popup.status === "success" && <div className="icon done">✔</div>}
          {popup.status === "error" && <div className="icon error">✖</div>}
          {popup.status === "confirm" && (
            <div className="confirm-box">
              <p>{popup.message}</p>
              <div className="confirm-buttons">
                <button onClick={handleConfirmFire}>Okay</button>
                <button onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          )}
          {(popup.status === "loading" || popup.status === "success" || popup.status === "error") && (
            <p>{popup.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
