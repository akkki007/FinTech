import express from "express";
import User from "../models/user.js"; // Ensure your User model is imported
import dotenv from "dotenv";
import cors from "cors"
import { Configuration ,PlaidEnvironments,PlaidApi } from "plaid";
dotenv.config();

const router = express.Router();

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = "https://sandbox.plaid.com"; // Sandbox URL


router.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));

const config = new Configuration({
    basePath: PlaidEnvironments[PLAID_ENV],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
        "PLAID-SECRET": PLAID_SECRET,
        "Plaid-Version": "2020-09-14",
      },
    },
  });

const plaidClient = new PlaidApi(config);

router.post("/create_sandbox_user", async (req, res) => {
    try {
        const response = await fetch(`${PLAID_ENV}/sandbox/public_token/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                client_id: PLAID_CLIENT_ID,
                secret: PLAID_SECRET,
                institution_id: "ins_109508",
                initial_products: ["transactions", "auth", "identity"],
                options: {
                    webhook: "http://localhost:3000/api/plaid",
                    transactions: {
                        start_date: "2020-01-01",
                        end_date: "2020-12-31"
                    }
                }
            })
        });        

        const data = await response.json();
    
        res.json({ public_token: data.public_token });
    } catch (error) {
        console.error("❌ Error creating Sandbox User:", error.message);
        res.status(500).json({ error: "Failed to create Sandbox user" });
    }
});

router.post("/accounts", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.plaidAccessToken) {
            return res.status(400).json({ error: "User not found or no linked bank account" });
        }

        const response = await fetch("https://sandbox.plaid.com/accounts/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: process.env.PLAID_CLIENT_ID, // ✅ Required
                secret: process.env.PLAID_SECRET,      // ✅ Required
                access_token: user.plaidAccessToken,   // ✅ Correct
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error_message || "Failed to fetch accounts");
        }

        res.json(data);
    } catch (error) {
        console.error("❌ Error fetching accounts:", error.message);
        res.status(500).json({ error: "Failed to fetch accounts", details: error.message });
    }
});


// Exchange public_token for access_token and store in DB
router.post("/exchange_token", async (req, res) => {
    const { public_token, email } = req.body;

    if (!public_token || !email) {
        return res.status(400).json({ message: "Missing public_token or email" });
    }

    try {
        // Exchange public token for access token using fetch
        const response = await fetch("https://sandbox.plaid.com/item/public_token/exchange", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: process.env.PLAID_CLIENT_ID,
                secret: process.env.PLAID_SECRET,
                public_token
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error_message || "Failed to exchange token");
        }

        const { access_token } = data;

        // Save access token to the database (e.g., associated with the user's email)
        await User.updateOne({ email }, { plaidAccessToken: access_token });

        res.json({ access_token });
    } catch (error) {
        console.error("❌ Error exchanging public token:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


// Simulate Transaction Refresh
router.post("/simulate_transactions", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.plaidAccessToken) {
            return res.status(400).json({ error: "User not found or no linked bank account" });
        }

        await fetch(`${PLAID_ENV}/sandbox/transactions/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Buffer.from(`${PLAID_CLIENT_ID}:${PLAID_SECRET}`).toString('base64')}`
            },
            body: JSON.stringify({ access_token: user.plaidAccessToken })
        });

        res.json({ message: "Transactions simulated successfully" });
    } catch (error) {
        console.error("❌ Error simulating transactions:", error.message);
        res.status(500).json({ error: "Failed to simulate transactions" });
    }
});

// Simulate Bank Balance Update
router.post("/simulate_balance", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.plaidAccessToken) {
            return res.status(400).json({ error: "User not found or no linked bank account" });
        }

        await fetch(`${PLAID_ENV}/sandbox/item/fire_webhook`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Buffer.from(`${PLAID_CLIENT_ID}:${PLAID_SECRET}`).toString('base64')}`
            },
            body: JSON.stringify({
                access_token: user.plaidAccessToken,
                webhook_code: "DEFAULT_UPDATE"
            })
        });

        res.json({ message: "Balance update simulated successfully" });
    } catch (error) {
        console.error("❌ Error simulating balance:", error.message);
        res.status(500).json({ error: "Failed to simulate balance update" });
    }
});

export default router;
