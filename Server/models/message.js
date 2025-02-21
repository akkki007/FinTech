import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    response: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Message", MessageSchema);
