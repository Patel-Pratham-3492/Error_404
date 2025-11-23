import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleNavbar from "../roleNavbar/RoleNavbar";
import "./chef.css"

export default function Chef() {
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
        <h1>Chef Dashboard</h1>
        <p>Welcome, {user?.name}. Manage food preparation and kitchen tasks here.</p>
      </div>
    </div>
  );
}

