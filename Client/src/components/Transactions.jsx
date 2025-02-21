import { useEffect, useState } from "react";
import Sidebar from "./SideBar";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");

  // ✅ Get Email from Cookies
  useEffect(() => {
    try {
      const emailCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("email="))
        ?.split("=")[1];

      if (emailCookie) {
        setEmail(decodeURIComponent(emailCookie));
      } else {
        console.error("❌ No email found in cookies!");
        setError("No email found. Please log in.");
      }
    } catch (err) {
      console.error("⚠️ Error reading email from cookies:", err);
      setError("Failed to retrieve email.");
    }
  }, []);

  // ✅ Fetch Transactions from Backend
  const fetchTransactions = async () => {
    if (!email) return;

    try {
      setLoading(true);
      setError(null);
      console.log("📨 Fetching transactions for:", email);

      const response = await fetch("http://localhost:3000/api/plaid/dummy_transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      console.log("✅ Transactions received:", data.transactions);

      // ✅ Ensure each transaction has a type (credit/debit)
      const transformedTransactions = data.transactions.map((tx) => ({
        ...tx,
        type: tx.amount >= 0 ? "credit" : "debit",
      }));

      setTransactions(transformedTransactions);
    } catch (error) {
      console.error("❌ Fetch Transactions Error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Transactions when Component Mounts & when Email Changes
  useEffect(() => {
    if (email) fetchTransactions();
  }, [email]);

  return (
    <div>
      <Sidebar />
      <div className="p-6 mx-64 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Business Transactions</h2>

        {error && <p className="text-red-500">{error}</p>}

        {/* ✅ Display Transactions */}
        {transactions.length > 0 ? (
          <ul className="space-y-2">
            {transactions.map((tx) => (
              <li key={tx.transactionId} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                <p className="font-medium">{tx.category}</p>
                <p className={`text-lg ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                  {tx.Trtype === "credit" ? "+" : "-"}${Math.abs(tx.amount)}
                </p>
                <p className="text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No business transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
