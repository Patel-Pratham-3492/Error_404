import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // For popup
  const [waiterPopup, setWaiterPopup] = useState(false);
  const [waiterId, setWaiterId] = useState("");
  const [waiterError, setWaiterError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !password) {
      setMessage("Email and password are required.");
      setTimeout(() => setMessage(""), 6000);
      return;
    }

    try {
      const response = await fetch("https://error-404-server.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        setTimeout(() => setMessage(""), 6000);
        return;
      }

      // CASE 1: WAITER → show popup
      if (data.role === "waiter") {
        setWaiterPopup(true);  // open popup
        return;
      }

      //CASE 2: Other roles → direct login
      localStorage.setItem(
        "user",
        JSON.stringify({
          firstName: data.firstName,
          role: data.role,
          userId: data.userId,
          _id: data._id,
        })
      );

      sessionStorage.setItem("loggedIn", true);

      navigate(`/${data.role}`);

    } catch (error) {
      setMessage("Server error. Try again later.");
      setTimeout(() => setMessage(""), 6000);
    }
  };

  // STEP 2: Verify waiterId
  const verifyWaiterId = async () => {
    if (!waiterId) {
      setWaiterError("Waiter ID is required.");
      return;
    }

    try {
      const res = await fetch("https://error-404-server.onrender.com/api/users/check_waiterid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userId, waiterId }),
      });

      const result = await res.json();

      if (!res.ok) {
        setWaiterError(result.message || "Invalid Waiter ID.");
        return;
      }

      // Success → store user
      localStorage.setItem(
        "user",
        JSON.stringify({
          firstName: result.firstName,
          role: "waiter",
          userId: result.userId,
          waiterId: waiterId
        })
      );

      sessionStorage.setItem("loggedIn", true);

      setWaiterPopup(false);
      navigate("/waiter");

    } catch (error) {
      setWaiterError("Server error. Try again.");
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
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your Email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
          </div>

          <button type="submit" className="btn-red">Login</button>
        </form>
      </div>

      {/* WAITER POPUP */}
      {waiterPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Enter Your Waiter ID</h3>

            {waiterError && <p style={{ color: "red" }}>{waiterError}</p>}

            <input
              type="text"
              value={waiterId}
              onChange={(e) => setWaiterId(e.target.value)}
              placeholder="Waiter ID"
            />

            <div className="popup-actions">
              <button className="btn-green" onClick={verifyWaiterId}>
                Continue
              </button>

              <button className="btn-grey" onClick={() => setWaiterPopup(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Login;
