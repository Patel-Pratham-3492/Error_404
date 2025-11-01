import React, { useState } from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import ReservationsTable from "./ReservationsTable";
import TableGrid from "./TableGrid";
import "./host.css";

function Host() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "reservations":
        return <ReservationsTable />;
      case "tables":
        return <TableGrid />;
      default:
        return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <div className="host-layout">
      <Navbar />
      <div className="host-main">{renderPage()}</div>
    </div>
  );
}

export default Host;