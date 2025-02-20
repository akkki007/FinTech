import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";

const Balance = ({ displayedAccounts = [] }) => {  // ✅ Prevents undefined errors
  const [balances, setBalances] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const emailCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("email="));

        if (!emailCookie) {
          console.error("No email found in cookies. Redirecting to login.");
          redirect("/login");
          return;
        }

        const email = decodeURIComponent(emailCookie.split("=")[1]);
        setEmail(email); // ✅ Set email state

        const response = await fetch(`http://localhost:3000/api/user?email=${email}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setUserId(data.userId);
      } catch (error) {
        setError("Error fetching user ID: " + error.message);
      }
    };

    fetchUserId();
  }, []);

  const fetchUpdatedBalances = async () => {
    try {
      console.log(`Fetching updated balances for email: ${email}`);

      const response = await fetch("http://localhost:3000/api/plaid/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch updated balances");
      }

      const data = await response.json();
      
      // ✅ Prevent error if accounts are undefined
      if (!data.accounts) {
        setError("No accounts found.");
        return;
      }

      // ✅ Filter balances to only include displayed business accounts
      const businessBalances = data.accounts.filter((account) => 
        displayedAccounts.some((displayed) => displayed.account_id === account.account_id)
      );

      setBalances(businessBalances);
      console.log("Updated filtered balances:", businessBalances);

    } catch (error) {
      setError("Error fetching updated balances: " + error.message);
      console.error("Error in fetchUpdatedBalances:", error);
    }
  };


  useEffect(() => {
    if (!userId || !email || displayedAccounts.length === 0) return;
    fetchUpdatedBalances();
  }, [userId, email, displayedAccounts]); // ✅ Runs when displayedAccounts updates

  // ✅ Simulate balance update **only when email and userId are available**
  useEffect(() => {
    if (!userId || !email) return;

    const simulateBalanceUpdate = async () => {
      try {
        console.log(`Simulating balance update for email: ${email}`);

        const response = await fetch("http://localhost:3000/api/plaid/simulate_balance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }), // ✅ Ensure email is passed
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to simulate balance update");
        }

        console.log("Balance update simulated successfully!");
        fetchUpdatedBalances(); // ✅ Fetch updated balances after simulation

      } catch (error) {
        setError("Error simulating balance update: " + error.message);
        console.error("Error in simulateBalanceUpdate:", error);
      }
    };

    simulateBalanceUpdate();
  }, [userId, email]);

  // ✅ Fetch updated balances when displayedAccounts changes
  

  return (
    <div className="p-6 m-10 -mx-16 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Business Account Balances</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul className="space-y-2">
        {balances.length > 0 ? (
          balances.map((account) => (
            <li key={account.account_id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <span className="font-medium">{account.name}</span> - <span className="text-green-600">${account.balances.current}</span>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No business account balances found.</p>
        )}
      </ul>
    </div>
  );
};

export default Balance;
