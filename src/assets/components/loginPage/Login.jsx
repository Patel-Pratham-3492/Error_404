import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // For error/success messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Email and password are required.");
      setTimeout(() => setMessage(""), 6000);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user info in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({ name: data.name, role: data.role, email: data.email })
        );

        sessionStorage.setItem("loggedIn", true);

        // Navigate based on role
        switch (data.role) {
          case "host":
            navigate("/host");
            break;
          case "waiter":
            navigate("/waiter");
            break;
          case "chef":
            navigate("/chef");
            break;
          case "manager":
            navigate("/manager");
            break;
          case "owner":
            navigate("/owner");
            break;
          case "admin":
            navigate("/admin");
            break;
          default:
            navigate("/"); // fallback
        }
      } else {
        setMessage(data.message || "Login failed.");
        setTimeout(() => setMessage(""), 6000);
      }
    } catch (error) {
      setMessage("Server error. Try again later.");
      setTimeout(() => setMessage(""), 6000);
    }
  };

  return (
    <section className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        {message && <p style={{ color: "red" }}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn-red">
            Login
          </button>
          <div className="signup-link">Don't have an account? <a href="/signup">Sign Up</a></div>
        </form>
      </div>
    </section>
  );
}

export default Login;
