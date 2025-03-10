import express from "express";
import User from "../models/user.js";
import { Transaction } from "../models/AccTrs.js"; // ✅ Fetch transactions from the correct model
import dotenv from "dotenv";
import cors from "cors";
import regression from "regression"; // ✅ For Linear Regression
import moment from "moment"; // ✅ For date formatting

dotenv.config();

const router = express.Router();

router.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Aggregate Weekly Cash Flow from Transactions
router.post("/cashflow", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Fetch transactions linked to the user
    const transactions = await Transaction.find({ userId: user._id });

    if (!transactions.length) return res.status(400).json({ error: "No transactions found" });

    // ✅ Group transactions by week
    const weeklyCashflow = transactions.reduce((acc, tx) => {
      const week = moment(tx.date).startOf("week").format("YYYY-MM-DD");
      acc[week] = (acc[week] || 0) + (tx.transactionType === "credit" ? tx.amount : -tx.amount);
      return acc;
    }, {});

    // ✅ Convert to array format for frontend
    const cashflowData = Object.entries(weeklyCashflow).map(([week, net_cashflow]) => ({
      week,
      net_cashflow,
    }));

    // ✅ Calculate Moving Average (4-week window)
    cashflowData.forEach((entry, index) => {
      const start = Math.max(0, index - 3);
      const sum = cashflowData.slice(start, index + 1).reduce((acc, val) => acc + val.net_cashflow, 0);
      entry.moving_avg = sum / (index - start + 1);
    });

    res.json({ cashflow: cashflowData });
  } catch (error) {
    console.error("❌ Error calculating cash flow:", error.message);
    res.status(500).json({ error: "Failed to calculate cash flow" });
  }
});

// ✅ Predict Next Week's Cash Flow Using Regression
router.post("/predict-cashflow", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Fetch transactions for this user
    const transactions = await Transaction.find({ userId: user._id });

    if (!transactions.length) return res.status(400).json({ error: "No transactions found" });

    // ✅ Check if prediction already exists and is recent
    const lastUpdate = user.last_prediction_update;
    if (user.predicted_cashflow && lastUpdate && moment().diff(lastUpdate, "days") < 1) {
      console.log("✅ Returning cached prediction");
      return res.json({ predicted_cashflow: user.predicted_cashflow });
    }

    // ✅ Prepare Data for Regression
    const weeklyCashflow = transactions.reduce((acc, tx) => {
      const week = moment(tx.date).startOf("week").format("YYYY-MM-DD");
      acc[week] = (acc[week] || 0) + (tx.transactionType === "credit" ? tx.amount : -tx.amount);
      return acc;
    }, {});

    const cashflowArray = Object.entries(weeklyCashflow).map(([week, net_cashflow], index) => [
      index,
      net_cashflow,
    ]);

    if (cashflowArray.length < 2) return res.status(400).json({ error: "Not enough data for prediction" });

    // ✅ Perform Linear Regression
    const result = regression.linear(cashflowArray);
    const nextWeekIndex = cashflowArray.length;
    const predictedCashflow = result.predict(nextWeekIndex)[1];

    // ✅ Store Prediction in DB
    user.predicted_cashflow = predictedCashflow;
    user.last_prediction_update = new Date();
    await user.save();

    console.log("✅ New prediction stored:", predictedCashflow);
    res.json({ predicted_cashflow: predictedCashflow });
  } catch (error) {
    console.error("❌ Error predicting cash flow:", error.message);
    res.status(500).json({ error: "Failed to predict cash flow" });
  }
});

export default router;
