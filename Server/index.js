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
import cashflows from "./routes/cashflows.js";
import Message from "./models/message.js";
import { Transaction } from "./models/AccTrs.js";
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

app.use("/api", plaidRoutes);
app.use("/api/report",cashflows)

const WORQHAT_API_KEY = process.env.API_KEY;
const WORQHAT_API_URL = "https://api.worqhat.com/api/ai/content/v4";

app.post("/api/chat", async (req, res) => {
  try {
    const { userId, question } = req.body;

    if (!userId || !question) {
      return res.status(400).json({ error: "User ID and question are required" });
    }

    const requestBody = JSON.stringify({
      question,
      training_data: "Provide a concise and informative response to the question. put the key as answer",
      response_type: "json",
      model: "aicon-v4-nano-160824",
    });

    const response = await fetch(WORQHAT_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WORQHAT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error(`Worqhat API Error: ${response.status} - ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("🔍 Raw Worqhat API Response:", responseData);

    let answer = "Sorry, I couldn't process that.";

    try {
      if (responseData && responseData.content) {
        const parsedContent =
          typeof responseData.content === "string"
            ? JSON.parse(responseData.content)
            : responseData.content;
    
        // Ensure we extract the correct string response
        answer = parsedContent.response || Object.values(parsedContent)[0] || "Sorry, I couldn't process that.";
      } else {
        console.error("❌ Worqhat API response is missing 'content'.");
      }
    } catch (parseError) {
      console.error("❌ Error parsing Worqhat API content:", parseError.message);
    }
    
    // ✅ Force answer to be a string before sending
    
    

    console.log("🔍 Final Processed Answer:", answer);
    console.log("🔍 Type of Answer:", typeof answer);

    // ✅ Convert answer to string before saving to MongoDB
    const newMessage = new Message({
      userId,
      question,
      response: String(answer), // ✅ Force answer to be a string
      timestamp: new Date(),
    });

    await newMessage.save();

    res.json({ answer: String(answer) });
  } catch (error) {
    console.error("❌ Error communicating with Worqhat API:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/estimate-tax", async (req, res) => {
  try {
    const { email, taxYear } = req.body;

    // Fetch User
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Fetch Transactions (Only the ones in the given tax year)
    const startDate = new Date(`${taxYear}-01-01`);
    const endDate = new Date(`${taxYear}-12-31`);

    const transactions = await Transaction.find({
      userId: user._id,
      date: { $gte: startDate, $lte: endDate },
    });

    if (!transactions.length) {
      return res.status(404).json({ error: "No transactions found for the given year." });
    }

    // ✅ Categorize Transactions
    let income = 0;
    let deductibleExpenses = 0;
    const deductibleCategories = ["Office Supplies", "Business Travel", "Subscriptions"];

    transactions.forEach((tx) => {
      if (tx.transactionType === "credit") {
        income += tx.amount; // Business income
      } else if (deductibleCategories.includes(tx.category)) {
        deductibleExpenses += tx.amount; // Deductible expenses
      }
    });

    // ✅ Taxable Income Calculation
    const taxableIncome = income - deductibleExpenses;

    // ✅ Progressive Tax Bracket System
    let taxOwed = 0;

    if (taxableIncome > 50000) {
      taxOwed = (20000 * 0.10) + (30000 * 0.15) + ((taxableIncome - 50000) * 0.25);
    } else if (taxableIncome > 20000) {
      taxOwed = (20000 * 0.10) + ((taxableIncome - 20000) * 0.15);
    } else {
      taxOwed = taxableIncome * 0.10;
    }

    // ✅ Round to 2 decimal places for currency
    const roundToTwo = (num) => Math.round(num * 100) / 100;

    res.json({
      taxableIncome: roundToTwo(taxableIncome),
      deductibleExpenses: roundToTwo(deductibleExpenses),
      estimatedTax: roundToTwo(taxOwed),
      message: "Tax estimation successful",
    });
  } catch (error) {
    console.error("Error estimating tax:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/api/chat/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching chat history for userId:", userId);

    const messages = await Message.find({ userId }).sort({ timestamp: 1 });
    console.log("Messages found:", messages);

    if (!messages.length) {
      console.log("No messages found for userId:", userId);
      return res.json({ messages: [] });
    }

    res.json({ messages });
  } catch (error) {
    console.error("❌ Error fetching chat history:", error.message);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});



app.listen(process.env.PORT | 3000,()=>{
    console.log("Server is running on port http://localhost:3000");
});