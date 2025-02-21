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

const transformToBusinessTransaction = (transaction) => {
  // Determine if the transaction is a credit or debit
  const transactionType = transaction.amount >= 0 ? "credit" : "debit";

  // Example transformation logic
  const businessCategories = {
    "Food and Drink": "Business Meal",
    "Travel": "Business Travel",
    "Payment": "Business Payment",
    "Shops": "Business Supplies",
    "Transfer": "Business Transfer",
    "Recreation": "Business Entertainment",
  };

  const category = transaction.category ? transaction.category[0] : "Uncategorized";
  const businessDescription = businessCategories[category] || "Business Expense";

  return {
    ...transaction,
    businessDescription,
    category: businessDescription,
    transactionType,
  };
};

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



// ✅ Route to Generate and Store Dummy Transactions
router.post("/dummy_transactions", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const transactions = [
      {
        transactionId: "txn_001",
        amount: 500,
        date: new Date(),
        category: "Business Income",
        Trtype: "credit",
      },
      {
        transactionId: "txn_002",
        amount: -200,
        date: new Date(),
        category: "Office Supplies",
        Trtype: "debit",
      },
      {
        transactionId: "txn_003",
        amount: -50.75,
        date: new Date(),
        category: "Business Meal",
        Trtype: "debit",
      },
      {
        transactionId: "txn_004",
        amount: 1000,
        date: new Date(),
        category: "Client Payment",
        Trtype: "credit",
      },
      {
        transactionId: "txn_005",
        amount: -120.45,
        date: new Date(),
        category: "Software Subscription",
        Trtype: "debit",
      },
      {
        transactionId: "txn_006",
        amount: 750.3,
        date: new Date(),
        category: "Freelance Work",
        Trtype: "credit",
      },
      {
        transactionId: "txn_007",
        amount: -300.9,
        date: new Date(),
        category: "Rent",
        Trtype: "debit",
      },
      {
        transactionId: "txn_008",
        amount: 1500.25,
        date: new Date(),
        category: "Consulting Fee",
        Trtype: "credit",
      },
      {
        transactionId: "txn_009",
        amount: -45.6,
        date: new Date(),
        category: "Transportation",
        Trtype: "debit",
      },
      {
        transactionId: "txn_010",
        amount: 2000,
        date: new Date(),
        category: "Product Sales",
        Trtype: "credit",
      },
      {
        transactionId: "txn_011",
        amount: -89.99,
        date: new Date(),
        category: "Marketing",
        Trtype: "debit",
      },
      {
        transactionId: "txn_012",
        amount: 300.5,
        date: new Date(),
        category: "Interest Income",
        Trtype: "credit",
      },
      {
        transactionId: "txn_013",
        amount: -150.75,
        date: new Date(),
        category: "Utilities",
        Trtype: "debit",
      },
      {
        transactionId: "txn_014",
        amount: 450.8,
        date: new Date(),
        category: "Referral Bonus",
        Trtype: "credit",
      },
      {
        transactionId: "txn_015",
        amount: -75.25,
        date: new Date(),
        category: "Office Maintenance",
        Trtype: "debit",
      },
      {
        transactionId: "txn_016",
        amount: 1200,
        date: new Date(),
        category: "Project Payment",
        Trtype: "credit",
      },
      {
        transactionId: "txn_017",
        amount: -60.4,
        date: new Date(),
        category: "Internet Bill",
        Trtype: "debit",
      },
      {
        transactionId: "txn_018",
        amount: 800.9,
        date: new Date(),
        category: "Training Revenue",
        Trtype: "credit",
      },
      {
        transactionId: "txn_019",
        amount: -95.5,
        date: new Date(),
        category: "Office Snacks",
        Trtype: "debit",
      },
      {
        transactionId: "txn_020",
        amount: 2500,
        date: new Date(),
        category: "Contract Work",
        Trtype: "credit",
      },
    ];

    const user = await User.findOneAndUpdate(
      { email },
      { $push: { transactions: { $each: transactions } } }, // ✅ Push array of objects
      { new: true, upsert: true }
    );

    return res.json({ message: "Dummy transactions added", transactions: user.transactions });
  } catch (error) {
    console.error("❌ Error creating dummy transactions:", error);
    return res.status(500).json({ error: "Server error" });
  }
});




export default router;
