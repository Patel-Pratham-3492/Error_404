import "./signup.css"

const Signup = () => {
  return(
  <div className="signup-page">
    <div className="signup-box">
      <h2>Signup</h2>

      <form>
        {/* role assign  */}
        <div className="form-group">
          <label htmlFor="role">Select Role</label>
          <select id="role" required>
            <option value="">--Select Role--</option>
            <option value="manager">Manager</option>
            <option value="host">Host</option>
            <option value="waiter">Waiter</option>
            <option value="chef">Chef</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" placeholder="Enter your full name" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email" required />
        </div>      
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Create a password" required />
        </div>      
        <div className="form-group">
          <label htmlFor="confirmpassword">Confirm Password</label>
          <input type="password" id="confirmpassword" placeholder="Confirm your password" required />
        </div>      
        <button type="submit">Sign Up</button>

        <div className="login-link">
          Already have an account? <a href="/login">Login</a>
        </div>
      </form>
    </div>
  </div>
);
}
export default Signup;