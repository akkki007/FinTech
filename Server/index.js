import User from "./models/user.js";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authenticate } from "./middlewares/auth.js";
import app from "./middlewares/remaining.js";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import session from "express-session";
import moment from "moment/moment.js";
import plaidRoutes from "./routes/plaidRoutes.js";
dotenv.config();
connectDB();

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";
const SECRET_KEY = process.env.SECRET_KEY // Use a strong secret key in production

// configuration of Plaid
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

  // Enable session to store access token temporarily (For production, use a database)
    app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );


app.get("/", (req, res) => {
    res.send("Hello World!");
}
);


app.get("/api/user", async (req, res) => {
    try {
      const { email } = req.query;
  
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json({ userId: user._id });
    } catch (error) {
      console.error("Error fetching user ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

// Create a Link Token for Frontend
    app.get("/api/create_link_token", async (req, res) => {
    try {
      const userId = req.sessionID; // Use logged-in user's ID in production
  
      const response = await plaidClient.linkTokenCreate({
        user: { client_user_id: userId },
        client_name: "My SaaS App",
        language: "en",
        products: ["transactions"],
        country_codes: ["US"],
      });
  
      res.json(response.data);
    } catch (error) {
      console.error("Error creating link token:", error);
      res.status(500).json({ error: "Failed to create link token" });
    }
  });
  // Exchange Public Token for Access Token
  app.post("/api/exchange_public_token", async (req, res) => {
    try {
      const { public_token, userId } = req.body; // userId comes from frontend
  
      const exchangeResponse = await plaidClient.itemPublicTokenExchange({
        public_token,
      });
  
      const { access_token, item_id } = exchangeResponse.data;
  
      // Store access_token and item_id in MongoDB
      await User.findByIdAndUpdate(userId, {
        plaidAccessToken: access_token,
        plaidItemId: item_id,
      });
      
      res.json({ success: true, message: "Bank account linked successfully" });
    } catch (error) {
      console.error("Error exchanging public token:", error);
      res.status(500).json({ error: "Failed to exchange public token" });
    }
  });
  // Fetch Transactions
  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!userId || userId === "undefined") {
        return res.status(400).json({ error: "Invalid or missing user ID" });
      }
  
      const user = await User.findById(userId);
      if (!user || !user.plaidAccessToken) {
        return res.status(404).json({ error: "User not found or no linked account" });
      }
  
      const startDate = moment().subtract(30, "days").format("YYYY-MM-DD");
      const endDate = moment().format("YYYY-MM-DD");
  
      const response = await plaidClient.transactionsGet({
        access_token: user.plaidAccessToken,
        start_date: startDate,
        end_date: endDate,
        options: { count: 20 },
      });
  
      res.json(response.data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });
  
  // Fetch the balance
  app.get("/api/balance/:userId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user || !user.plaidAccessToken) {
        return res.status(404).json({ error: "User or access token not found" });
      }
  
      const response = await plaidClient.accountsBalanceGet({
        access_token: user.plaidAccessToken,
      });
  
      res.json(response.data.accounts);
    } catch (error) {
      console.error("Error fetching balance:", error);
      res.status(500).json({ error: "Failed to fetch balance" });
    }
  });
  app.get("/bank_account/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Find user by ID and select relevant fields
        const user = await User.findById(userId).select("plaidAccessToken plaidItemId");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.plaidAccessToken) {
            return res.status(400).json({ message: "No linked bank account found" });
        }

        // Fetch bank accounts from Plaid API
        const response = await fetch("https://sandbox.plaid.com/accounts/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: process.env.PLAID_CLIENT_ID,
                secret: process.env.PLAID_SECRET,
                access_token: user.plaidAccessToken,
            }),
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ message: "Error fetching bank accounts", error: data.error });
        }

        res.json(data.accounts);
    } catch (error) {
        console.error("Error fetching bank accounts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
  

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });

    // Set cookies for token, username, and email
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.cookie('username', user.name, { httpOnly: false }); // Accessible by frontend
    res.cookie('email', user.email, { httpOnly: false });

    return res.status(200).json({ message: 'Login successful', user });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

app.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'This is a protected route', userId: req.userId });
});

app.use("/api/plaid", plaidRoutes);




app.listen(process.env.PORT | 3000,(req,res)=>{
    console.log("Server is running on port http://localhost:3000");
});