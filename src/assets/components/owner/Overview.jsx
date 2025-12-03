import { useEffect, useState } from "react";
import "./overview.css";

export default function OwnerOverview() {
  const [range, setRange] = useState("today");
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingPayments: 0,
    paidPayments: 0,
    totalItemsSold: 0,
    avgRevenuePerCustomer: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async (selectedRange) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/dashboard?range=${selectedRange}`);
      const data = await res.json();
      if (data.success) setStats(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats(range);
  }, [range]);

  return (
    <div className="owner-overview-container">
      <h1 className="page-title">Owner Overview</h1>

      {/* Range Selector */}
      <div className="range-selector">
        {["today", "week", "month"].map(r => (
          <button
            key={r}
            className={range === r ? "active" : ""}
            onClick={() => setRange(r)}
          >
            {r === "today" ? "Today" : r === "week" ? "This Week" : "This Month"}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="manager-stat stat-red">
          <h3 className="stat-title">Orders</h3>
          <p className="stat-value">{loading ? "..." : stats.totalOrders}</p>
        </div>

        <div className="manager-stat stat-green">
          <h3 className="stat-title">Revenue</h3>
          <p className="stat-value">${loading ? "..." : stats.totalRevenue}</p>
        </div>

        <div className="manager-stat stat-blue">
          <h3 className="stat-title">Total Customers</h3>
          <p className="stat-value">{loading ? "..." : stats.totalCustomers}</p>
        </div>

        <div className="manager-stat stat-yellow">
          <h3 className="stat-title">Pending Payments</h3>
          <p className="stat-value">{loading ? "..." : stats.pendingPayments}</p>
        </div>

        <div className="manager-stat stat-purple">
          <h3 className="stat-title">Paid Payments</h3>
          <p className="stat-value">{loading ? "..." : stats.paidPayments}</p>
        </div>

        <div className="manager-stat stat-orange">
          <h3 className="stat-title">Items Sold</h3>
          <p className="stat-value">{loading ? "..." : stats.totalItemsSold}</p>
        </div>

        <div className="manager-stat stat-teal">
          <h3 className="stat-title">Avg Revenue/Customer</h3>
          <p className="stat-value">${loading ? "..." : stats.avgRevenuePerCustomer}</p>
        </div>
      </div>
    </div>
  );
}
