import { useEffect, useState } from "react";
import Sidebar from "./SideBar";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch User ID from Cookie
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const emailCookie = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("email="));

                if (!emailCookie) {
                    console.error("No email found in cookies");
                    setLoading(false); // Stop loading if no email is found
                    return;
                }

                const email = decodeURIComponent(emailCookie.split("=")[1]);
                console.log("Fetching user ID for email:", email);

                const response = await fetch("http://localhost:3000/api/user?email=" + email);

                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log("User ID:", data.userId);
                setUserId(data.userId);
            } catch (error) {
                console.error("Error fetching user ID:", error);
                setLoading(false); // Stop loading on error
            }
        };

        fetchUserId();
    }, []);

    // Fetch Transactions after getting userId
    useEffect(() => {
        const fetchTransactions = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`http://localhost:3000/api/transactions/${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Transactions:", data);

                setTransactions(data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false); // Stop loading after fetching transactions
            }
        };

        fetchTransactions();
    }, [userId]);

    return (
        <div className="flex">
            <Sidebar />
            {loading ? (
                // Loading spinner or message
                <div className="flex justify-center items-center h-screen w-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                    <p className="ml-4">Loading transactions...</p>
                </div>
            ) : transactions.length === 0 ? (
                // No transactions found
                <p className="mx-68 my-5">No transactions found.</p>
            ) : (
                // Display transactions
                <ul className="mx-68 my-5">
                    {transactions.map((transaction) => (
                        <Transaction key={transaction.transaction_id} transaction={transaction} />
                    ))}
                </ul>
            )}
        </div>
    );
};

// ✅ Single Transaction Component
const Transaction = ({ transaction }) => {
    return (
        <li style={{ border: "1px solid #ddd", padding: "10px", margin: "10px", borderRadius: "5px" }}>
            <h3>{transaction.name}</h3>
            <p><strong>Amount:</strong> ${transaction.amount} {transaction.iso_currency_code}</p>
            <p><strong>Date:</strong> {transaction.date}</p>
            <p><strong>Category:</strong> {transaction.category?.join(" > ") || "N/A"}</p>
            <p><strong>Type:</strong> {transaction.transaction_type}</p>
            <p><strong>Payment Channel:</strong> {transaction.payment_channel}</p>
            {transaction.personal_finance_category && (
                <p>
                    <strong>Category:</strong> {transaction.personal_finance_category.primary} ({transaction.personal_finance_category.detailed})
                </p>
            )}
            {transaction.personal_finance_category_icon_url && (
                <img src={transaction.personal_finance_category_icon_url} alt="Category Icon" width="50" />
            )}
        </li>
    );
};

export default Transactions;