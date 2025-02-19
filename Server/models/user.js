import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    plaidAccessToken: {
        type: String,
        default: null,
    },
    plaidItemId: {
        type: String,
        default: null,
    },
    invoices: [
        {
            invoiceId: String,
            amount: Number,
            dueDate: Date,
            paid: Boolean,
        },
    ],
    expenses: [
        {
            expenseId: String,
            amount: Number,
            category: String,
            date: Date,
        },
    ],
    transactions: [
        {
            transactionId: String,
            amount: Number,
            date: Date,
            category: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);
export default User;