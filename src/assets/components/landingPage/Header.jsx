import React, { useState } from "react";

function Header() {
  const [cartCount, setCartCount] = useState(2);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <div> Grill Genius</div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                Home
              </a>
            </li>

            {/* ✅ Dropdown for Menu */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="menuDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Menu
              </a>
              <ul
                className="dropdown-menu dropdown-menu-dark bg-dark"
                aria-labelledby="menuDropdown"
              >
                <li>
                  <a className="dropdown-item text-light" href="#starters">
                    🥗 Starters
                  </a>
                </li>
                <li>
                  <a className="dropdown-item text-light" href="#maincourse">
                    🍝 Main Course
                  </a>
                </li>
                <li>
                  <a className="dropdown-item text-light" href="#desserts">
                    🍰 Desserts
                  </a>
                </li>
                <li>
                  <a className="dropdown-item text-light" href="#drinks">
                    🍹 Drinks
                  </a>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                About
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                Contact
              </a>
            </li>
          </ul>

          {/* 🛒 Cart & Login Buttons */}
          <div className="ms-auto d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-outline-light position-relative"
            >
              <i className="fas fa-shopping-cart"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            </button>
            <a className="btn btn-danger ms-3" href="/login">
              Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
