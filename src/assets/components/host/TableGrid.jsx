import React from "react";
import "./host.css";

function ReservationsTable() {
  const reservations = [
    { id: 1, name: "John Doe", time: "7:00 PM", guests: 2, status: "Confirmed" },
    { id: 2, name: "Anna Smith", time: "8:30 PM", guests: 4, status: "Pending" },
    { id: 3, name: "Michael Lee", time: "6:15 PM", guests: 3, status: "Arrived" },
  ];

  return (
    <section className="table-section">
      <h2>Reservations</h2>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Time</th>
            <th>Guests</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.time}</td>
              <td>{r.guests}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ReservationsTable;
