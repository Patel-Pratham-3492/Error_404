import React from "react";

function Hero() {
  return (
    <section className="bg-dark text-light py-5 hero-section">
      <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-between">
        <div className="text-center text-lg-start mb-4 mb-lg-0" style={{ maxWidth: "550px" }}>
          <h1 className="fw-bold display-4">
            Fresh & Tasty <span className="text-danger">Meals</span><br />
            Just for You.
          </h1>
          <p className="lead mt-3">
            Discover delicious dishes crafted with love and served hot!
          </p>
          <div className="mt-4">
            <a className="btn btn-danger btn-lg me-3" href="#">Order Now</a>
            <a className="btn btn-danger btn-lg me-3" href="#">Book a Table</a>
          </div>
        </div>

        <div className="text-center">
          <img
            src="/images/Salad.png"
            alt="Hero Dish"
            className="img-fluid rounded-circle hero-image shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
