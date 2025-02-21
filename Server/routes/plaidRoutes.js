import express from "express";
import { Account, Transaction } from "../models/AccTrs.js";
import User from "../models/user.js";

const router = express.Router();

// ✅ Generate Dummy Accounts for a User
router.post("/generate_accounts", async (req, res) => {
  try {
   
    
    const { email } = req.body;

    console.log(email);
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Check if the user already has accounts
    const existingAccounts = await Account.find({ userId: user._id });
    if (existingAccounts.length > 0) {
      return res.status(400).json({ message: "User already has accounts", accounts: existingAccounts });
    }

    // ✅ Fetch predefined dummy accounts (template accounts)
    const dummyAccounts = await Account.find({ userId: null }); // Fetch template accounts (userId: null)

    if (!dummyAccounts.length) {
      return res.status(500).json({ error: "No predefined dummy accounts found" });
    }

    // ✅ Create user-specific accounts based on dummy data
    const userAccounts = dummyAccounts.map((account) => ({
      name: account.name,
      type: account.type,
      balance: account.balance, // Use predefined balance
      userId: user._id, // Assign to user
      accountNumber: `ACC${Math.floor(100000 + Math.random() * 900000)}`, // Ensure unique account number
    }));

    // ✅ Save accounts to DB
    const createdAccounts = await Account.insertMany(userAccounts);
    res.json({ message: "Accounts created successfully", accounts: createdAccounts });
  } catch (error) {
    console.error("Error generating accounts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Fetch User's Accounts
router.post("/accounts", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const accounts = await Account.find({ userId: user._id });

    if (!accounts.length) return res.status(404).json({ error: "No accounts found" });

    res.json({ accounts });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Add Transaction & Update Account Balance
router.post("/add-transaction", async (req, res) => {
  try {
    const { email, accountNumber, amount, category, transactionType } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const account = await Account.findOne({ userId: user._id, accountNumber });

    if (!account) return res.status(404).json({ error: "Account not found" });

    // ✅ Convert amount to a number
    const amountValue = parseFloat(amount);

    // ✅ Calculate new balance before updating DB
    let newBalance = transactionType === "credit"
      ? account.balance + amountValue
      : account.balance - amountValue;

    // ✅ Ensure balance is properly updated in DB
    await Account.updateOne({ userId: user._id, accountNumber }, { balance: newBalance });

    // ✅ Save transaction
    const newTransaction = new Transaction({
      userId: user._id,
      accountNumber,
      amount: amountValue,
      category,
      transactionType,
      date: new Date(),
    });

    await newTransaction.save();

    res.status(201).json({ message: "Transaction added", newBalance });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Simulate Transactions & Auto-Update Balance
router.post("/simulate_transactions", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    // ✅ Fetch only accounts linked to this user
    const accounts = await Account.find({ userId: user._id });

    if (!accounts.length) {
      return res.status(404).json({ error: "No accounts found for this user." });
    }

    const categories = ["Office Supplies", "Software Subscription", "Client Payment", "Travel Expenses"];
    let transactions = [];

    for (const account of accounts) {
      const numTransactions = Math.floor(Math.random() * 5) + 3; // Generate 3-7 transactions

      for (let i = 0; i < numTransactions; i++) {
        const amount = parseFloat((Math.random() * 500 + 20).toFixed(2)); // Random $20 - $500
        const transactionType = Math.random() > 0.5 ? "credit" : "debit"; // 50% credit, 50% debit
        const category = categories[Math.floor(Math.random() * categories.length)];
        const randomDate = new Date(Date.now() - Math.random() * 1000000000); // Random past date

        transactions.push({
          userId: user._id,
          accountNumber: account.accountNumber,
          amount,
          category,
          transactionType,
          date: randomDate,
        });
      }
    }

    // ✅ Bulk insert transactions (they persist and add up)
    await Transaction.insertMany(transactions);
    console.log(`✅ Simulated ${transactions.length} transactions for ${user.email}`);

    res.json({ message: "Transactions simulated successfully!" });
  } catch (error) {
    console.error("❌ Error simulating transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// ✅ Fetch User's Transactions
router.post("/transactions", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const transactions = await Transaction.find({ userId: user._id }).sort({ date: -1 });

    if (!transactions.length) return res.status(404).json({ error: "No transactions found" });

    res.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Fetch Accounts with Transactions and Tally Balance
router.get("/accounts-with-transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ Fetch user-linked accounts
    const accounts = await Account.find({ userId });

    if (!accounts.length) {
      return res.status(404).json({ error: "No accounts found for this user." });
    }

    // ✅ Fetch all transactions for these accounts
    const accountNumbers = accounts.map((acc) => acc.accountNumber);
    const transactions = await Transaction.find({ accountNumber: { $in: accountNumbers } });

    // ✅ Calculate balance dynamically using transactions
    const accountsWithBalances = accounts.map((account) => {
      const accountTransactions = transactions.filter((tx) => tx.accountNumber === account.accountNumber);

      // ✅ Compute balance dynamically
      const realTimeBalance = accountTransactions.reduce((balance, tx) => {
        return tx.transactionType === "credit" ? balance + tx.amount : balance - tx.amount;
      }, 0);

      return {
        ...account._doc,
        transactions: accountTransactions,
        talliedBalance: parseFloat(realTimeBalance.toFixed(2)), // ✅ Rounded balance
      };
    });

    res.json({ accounts: accountsWithBalances });
  } catch (error) {
    console.error("Error fetching accounts with transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



export default router;