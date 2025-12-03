import { useEffect, useState } from "react";
import "./payment.css";

export default function Payment({ table }) {
  const [paymentData, setPaymentData] = useState(null);
  const [method, setMethod] = useState("cash");
  const [cardNumber, setCardNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    if (!table) return;

    try {
      const res = await fetch(`http://localhost:5000/api/payment/table/${table.customerCount}`);
      const data = await res.json();
      if (data.success) {
        setPaymentData(data);
      } else {
        setPaymentData({ items: [], paymentsIds: [], allPayments: [] });
      }
    } catch (err) {
      console.error(err);
      setPaymentData({ items: [], paymentsIds: [], allPayments: [] });
    }
  };

  useEffect(() => {
    fetchPayments();
    setMethod("cash");
    setCardNumber("");
  }, [table]);

  const handleCollectPayment = async () => {
    if (!paymentData || !paymentData.paymentsIds.length) return;
    if (method === "card" && !cardNumber) return; // Could add custom UI warning

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/payment/collect-multiple", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentsIds: paymentData.paymentsIds,
          method,
          cardNumber,
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchPayments(); // Refresh to show updated status
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!table) return <p>Please select a table</p>;
  if (!paymentData) return <p>Loading payments...</p>;

  // Separate paid and pending
  const pendingItems = paymentData.items || [];
  const paidItems = (paymentData.allPayments || []).filter(p => p.paymentStatus === "paid");

  return (
    <div className="payment-container">
      <h2>Payments for Table {table.tableName}</h2>

      {/* Pending Payment Table */}
      {pendingItems.length > 0 ? (
        <div className="payment-section">
          <h3>Pending Payments</h3>
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
              {pendingItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="payment-summary">
            <p>Total Qty: {paymentData.totalQty}</p>
            <p>Total Amount: ${paymentData.totalAmount}</p>
          </div>
          <div className="payment-method">
            <label>
              <input
                type="radio"
                name="method"
                value="cash"
                checked={method === "cash"}
                onChange={() => setMethod("cash")}
              />
              Cash
            </label>
            <label>
              <input
                type="radio"
                name="method"
                value="card"
                checked={method === "card"}
                onChange={() => setMethod("card")}
              />
              Card
            </label>
            {method === "card" && (
              <input
                type="text"
                placeholder="Enter card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            )}
          </div>
          <button
            className="collect-btn"
            onClick={handleCollectPayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Collect Payment"}
          </button>
        </div>
      ) : (
        <p>No pending payments.</p>
      )}

      {/* Paid Payment Table */}
      {paidItems.length > 0 && (
        <div className="payment-section">
          <h3>Paid Payments</h3>
          <table className="payment-table paid">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Paid On</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {paidItems.map((p, idx) =>
                p.items.map((item, iidx) => (
                  <tr key={`${idx}-${iidx}`}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price}</td>
                    <td>{new Date(p.date).toLocaleString()}</td>
                    <td>{p.method}</td>
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
