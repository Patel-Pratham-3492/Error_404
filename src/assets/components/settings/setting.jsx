import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./setting.css";

export default function Setting() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("loggedIn");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else navigate("/login");
  }, [navigate]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast("All fields are required.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("New password and confirm password do not match.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://error-404-server.onrender.com/api/users/${user._id}/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Password changed successfully.", "success");
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showToast(data.message || "Failed to change password.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong.", "error");
    }
    setLoading(false);
  };

  if (!user) return <p>Loading...</p>;

  const canChangePassword = ["host", "manager", "owner"].includes(user.role);

  return (
    <div className="setting-container">
      <h1>Profile Settings</h1>

      <div className="personal-details">
        <h3>Personal Details</h3>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.userId}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {canChangePassword && (
        <div className="password-change">
          <h3>Change Password</h3>
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={passwordData.oldPassword}
            onChange={handleChange}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter New Password"
            value={passwordData.confirmPassword}
            onChange={handleChange}
          />
          <button onClick={handlePasswordChange} disabled={loading}>
            {loading ? "Updating..." : "Change Password"}
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast ${toast.type} show`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
