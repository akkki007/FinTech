import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  type: String,
  balance: Number,
  accountNumber: String,
  createdAt: { type: Date, default: Date.now },
});

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  accountNumber: String,
  amount: Number,
  category: String,
  transactionType: { type: String, enum: ["credit", "debit"] },
  date: { type: Date, default: Date.now },
});

export const Account = mongoose.model("Account", AccountSchema);
export const Transaction = mongoose.model("Transaction", TransactionSchema);
