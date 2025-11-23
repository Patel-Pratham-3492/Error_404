import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleNavbar from "../roleNavbar/RoleNavbar";
import "./admin.css"

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

  return (
    <div>
      {user && <RoleNavbar role={user.role} name={user.name} />}
      <div style={{ padding: "20px" }}>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.name}. Try to fix every bugs!</p>
      </div>
    </div>
  );
}

