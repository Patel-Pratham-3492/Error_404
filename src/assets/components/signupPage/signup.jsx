import React from "react";
import "./signup.css"

function Signup() {
  return (
    <section className="signup-page">
      <div className="signup-overlay"></div>
      <div className="signup-box guest glass">
        <h2>Create Your Account</h2>
        <p className="subtitle">Join us and start managing your restaurant experience</p>

        <form>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your name" required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password" required />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="confirm password" required />
          </div>

          <button type="submit" className="btn-red">Sign Up</button>
          <p className="login-link">Already have an account? <a href="/login">Login</a></p>
        </form>
      </div>
    </section>
  );
}

export default Signup;