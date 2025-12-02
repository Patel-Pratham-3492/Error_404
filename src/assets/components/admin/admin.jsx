import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleNavbar from "../RoleNavbar/RoleNavbar";
import "./admin.css";

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  const roleDashboards = [
    { role: "host", label: "Host Dashboard", path: "/host" },
    { role: "waiter", label: "Waiter Dashboard", path: "/waiter" },
    { role: "chef", label: "Chef Dashboard", path: "/chef" },
    { role: "manager", label: "Manager Dashboard", path: "/manager" },
    { role: "owner", label: "Owner Dashboard", path: "/owner" },
  ];

  return (
    <div>
      {user && <RoleNavbar role={user.role} name={user.firstName} />}
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.firstName}. You can navigate to any role dashboard:</p>

        <div className="role-buttons">
          {roleDashboards.map((r) => (
            <button
              key={r.role}
              className="role-btn"
              onClick={() => navigate(r.path)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
