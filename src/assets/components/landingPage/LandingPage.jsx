import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import Features from "./Features";
import Footer from "./Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function LandingPage() {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}

export default LandingPage;