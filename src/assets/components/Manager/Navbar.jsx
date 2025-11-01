import { nav } from "framer-motion/client";
import React, {useState} from "react";
import { FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";

function Navbar(){
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return(
          <nav className="manager-navbar">
      <div className="navbar-left">
        <h2 className="manager-logo">Manager Panel</h2>
      </div>

      <div className="navbar-center">
        <input type="text" placeholder="Search..." className="manager-search"/>
      </div>

      <div className="navbar-right">
        <div className="profile-container"onClick={() => setDropdownOpen(!dropdownOpen)}>
          <FaUserCircle className="profile-icon" />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <p><FaCog /> Settings</p>
              <p><FaSignOutAlt /> Logout</p>
            </div>
          )}
        </div>
      </div>
    </nav>
    );
}
export default Navbar;