import mongoose from "mongoose";
import bcrypt from "bcrypt";

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

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;