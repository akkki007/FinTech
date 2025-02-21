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
    accounts: [
        {
            accountId: String,
            accountNumber: String,
            name: String,
            type: String,
        },
    ],
    invoices: [
        {
            invoiceId: String,
            amount: Number,
            dueDate: Date,
            paid: Boolean,
        },
    ],
    transactions: [
        {
            transactionId: String,
            accountNumber: String, // ✅ Link transaction to the correct account
            amount: Number,
            date: Date,
            category: String,
            Trtype: String,
        },
    ],
    predicted_cashflow: {
        type: Number,
        default: null,
    },
    last_prediction_update: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
