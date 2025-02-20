import React, { useState, useEffect } from "react";

const Test = () => {
    const [publicToken, setPublicToken] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [balance, setBalance] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const userEmail = "mghde@gmail.com"; // Replace with actual user email

    // 1️⃣ Create a Sandbox User
    const createSandboxUser = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/plaid/create_sandbox_user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            console.log("✅ Sandbox Public Token:", data.public_token);
            setPublicToken(data.public_token);

            // Automatically exchange public_token after creation
            exchangePublicToken(data.public_token, userEmail);
        } catch (error) {
            console.error("❌ Error creating sandbox user:", error);
        }
    };

    // 2️⃣ Exchange Public Token for Access Token
    const exchangePublicToken = async (publicToken, userEmail) => {
        try {
            const payload = { public_token: publicToken, email: userEmail };
            console.log("Request Payload:", JSON.stringify(payload)); // Debugging log

            const response = await fetch("http://localhost:3000/api/plaid/exchange_token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log("✅ Access Token:", data.access_token);
            setAccessToken(data.access_token);
        } catch (error) {
            console.error("❌ Error exchanging public token:", error);
        }
    };

    // 3️⃣ Fetch Account Information
    useEffect(() => {
        if (!accessToken) return;

        const fetchAccounts = async () => {
            try {
                const payload = { email: userEmail };
                console.log("Request Payload:", JSON.stringify(payload)); // Debugging log

                const response = await fetch(`http://localhost:3000/api/plaid/accounts`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                console.log("✅ Accounts:", data);
                setAccounts(data.accounts);
            } catch (error) {
                console.error("❌ Error fetching accounts:", error);
            }
        };

        fetchAccounts();
    }, [accessToken]);

    // 4️⃣ Fetch Balance Information
    useEffect(() => {
        if (!accessToken) return;

        const fetchBalance = async () => {
            try {
                const payload = { email: userEmail };
                console.log("Request Payload:", JSON.stringify(payload)); // Debugging log

                const response = await fetch(`http://localhost:3000/api/plaid/simulate_balance`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                console.log("✅ Balance:", data);
                setBalance(data.accounts);
            } catch (error) {
                console.error("❌ Error fetching balance:", error);
            }
        };

        fetchBalance();
    }, [accessToken]);

    // 5️⃣ Fetch Transactions
    useEffect(() => {
        if (!accessToken) return;

        const fetchTransactions = async () => {
            try {
                const payload = { email: userEmail };
                console.log("Request Payload:", JSON.stringify(payload)); // Debugging log

                const response = await fetch(`http://localhost:3000/api/plaid/simulate_transactions`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                console.log("✅ Transactions:", data);
                setTransactions(data.transactions);
            } catch (error) {
                console.error("❌ Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, [accessToken]);

    return (
        <div>
            <h1>Plaid Sandbox Testing</h1>
            <button onClick={createSandboxUser}>Create a Sandbox User</button>

            {publicToken && <p>Public Token: {publicToken}</p>}
            {accessToken && <p>Access Token: {accessToken}</p>}

            <h2>Accounts</h2>
            <ul>
                {accounts.map((account) => (
                    <li key={account.account_id}>
                        {account.name} - {account.subtype} - Balance: ${account.balances?.current}
                    </li>
                ))}
            </ul>

            <h2>Balance</h2>
            <ul>
                {balance.map((account) => (
                    <li key={account.account_id}>
                        {account.name} - {account.iso_currency_code} ${account.balances?.current}
                    </li>
                ))}
            </ul>

            <h2>Transactions</h2>
            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction.transaction_id}>
                        {transaction.date} - {transaction.name} - ${transaction.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Test;    