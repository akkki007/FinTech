import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import Balance from "../components/Balance";

const Dashboard = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [plaidInitialized, setPlaidInitialized] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Fetch user ID on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const emailCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("email="));

        if (!emailCookie) {
          navigate("/login");
        }

        const email = decodeURIComponent(emailCookie.split("=")[1]);
        console.log("Fetching user ID for email:", email);
        setEmail(email);

        const response = await fetch(
          `http://localhost:3000/api/user?email=${email}`
        );
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

  // ✅ Create and Initialize Plaid Sandbox User (Only Once)
  useEffect(() => {
    if (!userId || plaidInitialized) return;

    const initPlaidSandboxUser = async () => {
      try {
        // 1. Create Sandbox User
        const response = await fetch(
          "http://localhost:3000/api/plaid/create_sandbox_user",
          {
            method: "POST",
            credentials: "include",
          }
        );

        const data = await response.json();
        if (!data.public_token) {
          throw new Error("Failed to generate Plaid sandbox user");
        }
        console.log("Sandbox User Created. Public Token:", data.public_token);

        // 2. Exchange Public Token for Access Token
        const exchangeResponse = await fetch(
          "http://localhost:3000/api/plaid/exchange_token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              public_token: data.public_token,
              email: email,
            }),
          }
        );

        if (!exchangeResponse.ok) {
          throw new Error("Failed to exchange public token");
        }

        console.log("Public Token Exchanged Successfully.");
        setSuccess(true);
        setPlaidInitialized(true); // Ensure it only runs once
      } catch (error) {
        setError("Error initializing Plaid sandbox: " + error.message);
      }
    };

    initPlaidSandboxUser();
  }, [userId, plaidInitialized]);

  // ✅ Fetch Bank Accounts after Linking
  useEffect(() => {
    if (!success || !userId) return;

    const fetchBankAccounts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/plaid/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bank accounts");
        }

        const data = await response.json();
        console.log("Fetched Bank Accounts:", data.accounts);

        // ✅ Filter only business-related accounts
        const businessAccounts = data.accounts.filter((account) =>
          ["checking", "credit card", "merchant account"].includes(account.subtype)
        );

        setBankAccounts(businessAccounts);
      } catch (error) {
        setError("Error fetching bank accounts: " + error.message);
      }
    };

    fetchBankAccounts();
  }, [success, userId]);

  return (
    <>
      <div className="flex poppins-medium">
        <div>
          <Sidebar />
        </div>
        <div className="flex">
          <div className="p-7 mx-72">
            {!success ? (
              <p className="text-gray-600">Connecting to your bank...</p>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4">Business Bank Accounts</h2>
                {bankAccounts.length > 0 ? (
                  <ul>
                    {bankAccounts.map((account) => (
                      <li key={account.account_id} className="mb-4 p-4 border rounded">
                        <p>
                          <strong>Account Name:</strong> {account.name}
                        </p>
                        <p>
                          <strong>Account ID:</strong> {account.account_id}
                        </p>
                        <p>
                          <strong>Balance:</strong> ${account.balances.current}
                        </p>
                        <p>
                          <strong>Type:</strong> {account.type}
                        </p>
                        <p>
                          <strong>Subtype:</strong> {account.subtype}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No business accounts found.</p>
                )}
              </div>
            )}
          </div>

          <Balance displayedAccounts={bankAccounts} />
        </div>
        {error && <div className="text-red-500">{error}</div>}
      </div>
    </>
  );
};

export default Dashboard;
