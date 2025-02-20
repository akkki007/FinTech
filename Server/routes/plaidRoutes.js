import express from "express";
import User from "../models/user.js"; // Import User model
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const router = express.Router();

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = "https://sandbox.plaid.com"; // ✅ Plaid Sandbox API Base URL

router.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Create a Sandbox Business User & Return Public Token
router.post("/create_sandbox_user", async (req, res) => {
  try {
    const response = await fetch(`${PLAID_ENV}/sandbox/public_token/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        institution_id: "ins_109508",
        initial_products: ["transactions", "auth", "identity"],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error_message || "Failed to create Sandbox user");

    res.json({ public_token: data.public_token });
  } catch (error) {
    console.error("❌ Error creating Sandbox User:", error.message);
    res.status(500).json({ error: "Failed to create Sandbox user" });
  }
});

// ✅ Exchange Public Token for Access Token
router.post("/exchange_token", async (req, res) => {
  try {
    const { public_token, email } = req.body;
    if (!public_token || !email) return res.status(400).json({ error: "Missing public_token or email" });

    const response = await fetch(`${PLAID_ENV}/item/public_token/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: PLAID_CLIENT_ID, secret: PLAID_SECRET, public_token }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error_message || "Failed to exchange token");

    await User.updateOne({ email }, { plaidAccessToken: data.access_token, plaidItemId: data.item_id }, { upsert: true });

    res.json({ access_token: data.access_token });
  } catch (error) {
    console.error("❌ Error exchanging token:", error.message);
    res.status(500).json({ error: "Failed to exchange token" });
  }
});

// ✅ Fetch Business Accounts Only
router.post("/accounts", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.plaidAccessToken) return res.status(400).json({ error: "User not found or no linked bank account" });

    const response = await fetch(`${PLAID_ENV}/accounts/get`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: PLAID_CLIENT_ID, secret: PLAID_SECRET, access_token: user.plaidAccessToken }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error_message || "Failed to fetch accounts");

    // ✅ Filter only business-use accounts
    const businessAccounts = data.accounts.filter((account) =>
      ["checking", "credit card", "merchant account"].includes(account.subtype)
    );

    res.json({ accounts: businessAccounts });
  } catch (error) {
    console.error("❌ Error fetching accounts:", error.message);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
});

// ✅ Fetch & Store Business Transactions in MongoDB
router.post("/transactions", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user || !user.plaidAccessToken)
      return res.status(400).json({ error: "User not found or no linked bank account" });

    console.log("🔍 Fetching transactions for:", email);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90); // ✅ Fetch last 90 days
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = new Date().toISOString().split("T")[0];

    // ✅ Fetch transactions from Plaid
    const response = await fetch(`${PLAID_ENV}/transactions/get`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        access_token: user.plaidAccessToken,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      }),
    });

    const data = await response.json();
    console.log("📊 Plaid Transactions Response:", JSON.stringify(data, null, 2)); // ✅ Debug full response

    if (!response.ok) throw new Error(data.error_message || "Failed to fetch transactions");

    const businessTransactions = data.transactions
      .filter((tx) =>
        ["checking", "credit card", "merchant account", "business"].includes(tx.account?.subtype)
      )
      .map((tx) => ({
        transactionId: tx.transaction_id,
        amount: tx.amount,
        date: new Date(tx.date),
        category: tx.category ? tx.category.join(", ") : "Uncategorized",
      }));

    console.log("✅ Filtered Business Transactions:", businessTransactions.length);

    user.transactions = businessTransactions;
    user.updatedAt = new Date();
    await user.save();

    res.json({ transactions: businessTransactions });
  } catch (error) {
    console.error("❌ Error fetching transactions:", error.message);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// ✅ Simulate Business Transactions & Store in MongoDB
router.post("/simulate_transactions", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user || !user.plaidAccessToken)
      return res.status(400).json({ error: "User not found or no linked bank account" });

    console.log("🔄 Simulating transactions for:", email);

    // ✅ Trigger Sandbox Transaction Refresh
    const refreshResponse = await fetch(`${PLAID_ENV}/sandbox/transactions/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        access_token: user.plaidAccessToken,
      }),
    });

    const refreshData = await refreshResponse.json();
    console.log("🔄 Sandbox Refresh Response:", refreshData); // ✅ Debug sandbox refresh

    if (!refreshResponse.ok) throw new Error(refreshData.error_message || "Failed to refresh transactions");

    // ✅ Wait for transactions to update
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds

    // ✅ Fetch updated transactions
    const transactionsResponse = await fetch(`${PLAID_ENV}/transactions/get`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        access_token: user.plaidAccessToken,
        start_date: "2024-01-01",
        end_date: new Date().toISOString().split("T")[0],
      }),
    });

    const data = await transactionsResponse.json();
    console.log("📊 Simulated Transactions Response:", JSON.stringify(data, null, 2)); // ✅ Debug response

    if (!transactionsResponse.ok) throw new Error(data.error_message || "Failed to fetch transactions");

    const businessTransactions = data.transactions
      .filter((tx) =>
        ["checking", "credit card", "merchant account", "business"].includes(tx.account?.subtype)
      )
      .map((tx) => ({
        transactionId: tx.transaction_id,
        amount: tx.amount,
        date: new Date(tx.date),
        category: tx.category ? tx.category.join(", ") : "Uncategorized",
      }));

    console.log("✅ Filtered Simulated Transactions:", businessTransactions.length);

    user.transactions = businessTransactions;
    user.updatedAt = new Date();
    await user.save();

    res.json({ message: "Transactions simulated & updated successfully", transactions: businessTransactions });
  } catch (error) {
    console.error("❌ Error simulating transactions:", error.message);
    res.status(500).json({ error: "Failed to simulate transactions" });
  }
});


export default router;
