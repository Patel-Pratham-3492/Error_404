import { useEffect, useState } from "react";
import "./managerPayment.css";

export default function ManagerPayment() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [tablePayments, setTablePayments] = useState([]);
  const [method, setMethod] = useState("cash");
  const [cardNumber, setCardNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAllTodayPayments = async () => {
    try {
      const res = await fetch("http://3.128.94.231:5000/api/payment/today/all");
      const data = await res.json();
      if (!data.success) return;

      setTablePayments(data.payments);

      const uniqueTables = [...new Set(data.payments.map(p => p.tableName))];
      setTables(uniqueTables);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllTodayPayments();
  }, []);

  const filteredPayments = tablePayments.filter(
    (p) => p.tableName === selectedTable
  );

  const pendingPayments = filteredPayments.filter(
    (p) => p.paymentStatus === "pending"
  );

  const paidPayments = filteredPayments.filter(
    (p) => p.paymentStatus === "paid"
  );

  const pendingBySession = pendingPayments.reduce((acc, payment) => {
    const session = payment.newSessionId;
    if (!acc[session]) acc[session] = [];
    acc[session].push(payment);
    return acc;
  }, {});

  const totalAmount = (payments) => {
    return payments.reduce((acc, p) => {
      const itemsTotal = p.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      return acc + itemsTotal;
    }, 0);
  };

  const handleCollectPaymentForSession = async (session) => {
    const sessionPending = pendingBySession[session];
    const pendingIds = sessionPending.map((p) => p._id);

    if (!pendingIds.length) return;
    if (method === "card" && !cardNumber) return;

    setLoading(true);
    try {
      const res = await fetch(
        "http://3.128.94.231:5000/api/payment/collect-multiple",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentsIds: pendingIds,
            method,
            cardNumber,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        fetchAllTodayPayments();
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="manager-payment-container">
      <h2 className="title">Manager Payment Panel</h2>

      <div className="table-selector">
        <label>Select Table:</label>
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="">-- Select Table --</option>
          {tables.map((t, idx) => (
            <option key={idx} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {!selectedTable && <p className="info-msg">Please select a table.</p>}

      {selectedTable && filteredPayments.length === 0 && (
        <p className="info-msg">No payments for this table.</p>
      )}

      {/* --- PENDING SESSIONS GROUPED --- */}
      {Object.keys(pendingBySession).map((session) => (
        <div className="payment-section" key={session}>
          <h3>Pending Payments – {selectedTable}</h3>
          <h4 className="session-id">Customer ID: {session}</h4>

          <table className="payment-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {pendingBySession[session].map((p) =>
                p.items.map((i, idx) => (
                  <tr key={idx}>
                    <td>{i.name}</td>
                    <td>{i.category}</td>
                    <td>{i.quantity}</td>
                    <td>${i.price}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="total-amount">
            Total Pending: ${totalAmount(pendingBySession[session]).toFixed(2)}
          </div>

          <div className="payment-method">
            <label>
              <input
                type="radio"
                name={`method-${session}`}
                value="cash"
                checked={method === "cash"}
                onChange={() => setMethod("cash")}
              />
              Cash
            </label>

            <label>
              <input
                type="radio"
                name={`method-${session}`}
                value="card"
                checked={method === "card"}
                onChange={() => setMethod("card")}
              />
              Card
            </label>

            {method === "card" && (
              <input
                className="card-input"
                type="text"
                placeholder="Enter card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            )}
          </div>

          <button
            className="collect-btn"
            onClick={() => handleCollectPaymentForSession(session)}
            disabled={loading}
          >
            {loading ? "Processing…" : "Collect Payment"}
          </button>
        </div>
      ))}

      {/* --- PAID COMBINED --- */}
      {paidPayments.length > 0 && (
        <div className="payment-section paid">
          <h3>Paid Payments – {selectedTable}</h3>

          <table className="payment-table">
  <thead>
    <tr>
      <th>Customer ID</th>
      <th>Item</th>
      <th>Qty</th>
      <th>Price</th>
      <th>Method</th>
      <th>Date</th>
    </tr>
  </thead>

  <tbody>
    {paidPayments.map((p, idx) =>
      p.items.map((i, iidx) => (
        <tr key={`${idx}-${iidx}`}>
          <td>{p.newSessionId}</td>
          <td>{i.name}</td>
          <td>{i.quantity}</td>
          <td>${i.price}</td>
          <td>{p.method}</td>
          <td>{new Date(p.date).toLocaleString()}</td>
        </tr>
      ))
    )}
  </tbody>
</table>

        </div>
      )}
    </div>
  );
}
