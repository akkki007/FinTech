import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import Balance from "../components/Balance";

const Dashboard = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch user ID from cookies on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const emailCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("email="));

        if (!emailCookie) {
          navigate("/login");
          return;
        }

        const email = decodeURIComponent(emailCookie.split("=")[1]);
        setEmail(email);

        const response = await fetch(`http://localhost:3000/api/user?email=${email}`);
        if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);

        const data = await response.json();
        setUserId(data.userId);
      } catch (error) {
        setError("Error fetching user ID: " + error.message);
      }
    };

    fetchUserId();
  }, []);

  // ✅ Generate unique dummy bank accounts for new users
  useEffect(() => {
    if (!userId) return;
    const emailCookie = document.cookie
  .split("; ")
  .find((row) => row.startsWith("email="));

let email = decodeURIComponent(emailCookie.split("=")[1]);


    const generateBankAccounts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/generate_accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        

        console.log("Dummy bank accounts created.");
      } catch (error) {
        setError("Error creating bank accounts: " + error.message);
      }
    };

    generateBankAccounts();
  }, [userId]);

  // ✅ Fetch user’s bank accounts
  useEffect(() => {
    if (!userId) return;

    const fetchBankAccounts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) throw new Error("Failed to fetch bank accounts");

        const data = await response.json();
        setBankAccounts(data.accounts);
      } catch (error) {
        setError("Error fetching bank accounts: " + error.message);
      }
    };

    fetchBankAccounts();
  }, [userId]);

  return (
    <>
      <div className="flex poppins-medium">
        <Sidebar />
        <div className="p-7 mx-72">
          {error && <div className="text-red-500">{error}</div>}
          <h2 className="text-xl font-bold mb-4">Business Bank Accounts</h2>
          {bankAccounts.length > 0 ? (
            <ul>
              {bankAccounts.map((account) => (
                <li key={account.accountNumber} className="mb-4 p-4 border rounded">
                  <p><strong>Account Name:</strong> {account.name}</p>
                  <p><strong>Balance:</strong> ${account.balance.toFixed(2)}</p>
                  <p><strong>Type:</strong> {account.type}</p>
                  <p><strong>Account Number:</strong> {account.accountNumber}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No business accounts found.</p>
          )}
        </div>
        <Balance displayedAccounts={bankAccounts} />
      </div>
    </>
  );
};

export default Dashboard;
