import { useEffect, useState } from "react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");

  // ✅ Get Email from Cookies
  useEffect(() => {
    const emailCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("email="))
      ?.split("=")[1];

    if (emailCookie) {
      const decodedEmail = decodeURIComponent(emailCookie);
      console.log("📧 Decoded Email:", decodedEmail);
      setEmail(decodedEmail);
    } else {
      console.error("❌ No email found in cookies!");
      setError("No email found. Please log in.");
    }
  }, []);

  // ✅ Fetch Transactions from Backend
  const fetchTransactions = async () => {
    if (!email) {
      console.warn("⏳ Waiting for email to be set before fetching transactions...");
      return;
    }

    try {
      console.log("📨 Sending request to /transactions with email:", email);
      setLoading(true);

      const response = await fetch("http://localhost:3000/api/plaid/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      console.log("🔍 Response Status:", response.status); // Log the status

      const data = await response.json();
      console.log("🔍 Response Data:", data); // Log the data

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch transactions");
      }

      setTransactions(data.transactions);
    } catch (error) {
      console.error("❌ Fetch Transactions Error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Simulate Transactions & Fetch Updated Data
  const simulateTransactions = async () => {
    if (!email) {
      console.warn("⏳ Cannot simulate transactions without email.");
      return;
    }

    try {
      setLoading(true);
      console.log("📨 Simulating transactions for:", email);

      const response = await fetch("http://localhost:3000/api/plaid/simulate_transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      console.log("🔍 Simulation Response Status:", response.status);

      const data = await response.json();
      console.log("🔍 Simulated Transactions:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to simulate transactions");
      }

      setTransactions(data.transactions);
    } catch (error) {
      console.error("❌ Simulate Transactions Error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Transactions when Component Mounts & when Email Changes
  useEffect(() => {
    if (email) {
      fetchTransactions();
    }
  }, [email]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Business Transactions</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Simulate Transactions Button */}
      <button
        onClick={simulateTransactions}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Processing..." : "Simulate Transactions"}
      </button>

      {/* ✅ Display Transactions */}
      {transactions.length > 0 ? (
        <ul className="space-y-2">
          {transactions.map((tx) => (
            <li key={tx.transactionId} className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <p className="font-medium">{tx.category}</p>
              <p className="text-gray-600">${tx.amount}</p>
              <p className="text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No business transactions found.</p>
      )}
    </div>
  );
};

export default Transactions;
