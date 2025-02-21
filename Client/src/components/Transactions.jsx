import { useEffect, useState } from "react";
import Sidebar from "./SideBar";

const Transactions = () => {
  const [transactionsByAccount, setTransactionsByAccount] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [simulating, setSimulating] = useState(false); // ✅ State for simulating transactions

  // ✅ Fetch email from cookies
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

  // ✅ Fetch User ID from Backend
  const fetchUserId = async () => {
    if (!email) return;

    try {
      const response = await fetch(`http://localhost:3000/api/user?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch user ID");

      const data = await response.json();
      setUserId(data.userId);
    } catch (error) {
      console.error("❌ Error fetching user ID:", error.message);
      setError(error.message);
    }
  };

  // ✅ Fetch Transactions Grouped by Accounts
  const fetchTransactionsByAccount = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      console.log("📨 Fetching transactions for user ID:", userId);

      const response = await fetch(`http://localhost:3000/api/accounts-with-transactions/${userId}`);

      if (!response.ok) throw new Error("Failed to fetch transactions");

      const data = await response.json();
      console.log("✅ Transactions received:", data.accounts);

      if (!data.accounts || data.accounts.length === 0) {
        console.warn("⚠️ No accounts or transactions found.");
      }

      const transformedData = data.accounts.reduce((acc, account) => {
        acc[account.name] = {
          transactions: account.transactions || [], // ✅ Ensures transactions is always an array
          talliedBalance: account.talliedBalance,
        };
        return acc;
      }, {});

      console.log("🔍 Transformed Data:", transformedData); // ✅ Debugging
      setTransactionsByAccount(transformedData);
    } catch (error) {
      console.error("❌ Fetch Transactions Error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Simulate Transactions & Refresh Data
  const simulateTransactions = async () => {
    if (!userId) return;
    
    try {
      setSimulating(true);
      console.log("🔄 Simulating transactions for user ID:", userId);

      const response = await fetch("http://localhost:3000/api/simulate_transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to simulate transactions");

      console.log("✅ Transactions simulated successfully!");

      // ✅ Refresh transactions after simulation
      fetchTransactionsByAccount();
    } catch (error) {
      console.error("❌ Simulation Error:", error.message);
      setError(error.message);
    } finally {
      setSimulating(false);
    }
  };

  // ✅ Fetch User ID when Email Changes
  useEffect(() => {
    if (email) fetchUserId();
  }, [email]);

  // ✅ Fetch Transactions when User ID Changes
  useEffect(() => {
    if (userId) fetchTransactionsByAccount();
  }, [userId]);

  return (
    <div>
      <Sidebar />
      <div className="p-6 mx-64 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Business Transactions</h2>

        {error && <p className="text-red-500">{error}</p>}
        {loading && <p className="text-blue-500">Fetching transactions...</p>}

        {/* ✅ Simulate Transactions Button */}
        <button
          onClick={simulateTransactions}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
          disabled={simulating}
        >
          {simulating ? "Simulating..." : "Simulate Transactions"}
        </button>

        {/* ✅ Display Transactions by Account */}
        {Object.keys(transactionsByAccount).length > 0 ? (
          Object.entries(transactionsByAccount).map(([accountName, { transactions, talliedBalance }]) => (
            <div key={accountName} className="mb-6 p-4 border rounded-lg shadow-md bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                💳 Account: {accountName}
              </h3>
              <p className="text-gray-600 mb-2">🔹 Balance: ${talliedBalance.toFixed(2)}</p>

              {transactions.length > 0 ? (
                <ul className="space-y-3">
                  {transactions.map((tx) => (
                    <li
                      key={tx._id}
                      className="p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{tx.category}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(tx.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p
                        className={`text-lg font-semibold ${
                          tx.transactionType === "credit" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {tx.transactionType === "credit" ? "+" : "-"}${Math.abs(tx.amount)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No transactions found for this account.</p>
              )}
            </div>
          ))
        ) : (
          !loading && <p className="text-gray-500">No business transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
