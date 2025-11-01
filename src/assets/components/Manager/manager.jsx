import React from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import "./manager.css";

function Manager(){
  return(
    <div className="manager-container">
      <Navbar />
      <main className="manager-main">
        <Dashboard />
      </main>
    </div>

  );
}



export default Manager;