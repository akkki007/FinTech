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

app.use("/api/plaid", plaidRoutes);
app.use("/api/report",cashflows)

const WORQHAT_API_KEY = process.env.API_KEY;
const WORQHAT_API_URL = "https://api.worqhat.com/api/ai/content/v4";

app.post("/api/chat", async (req, res) => {
  try {
      const { userId, question } = req.body;

      if (!userId || !question) {
          return res.status(400).json({ error: "User ID and question are required" });
      }

      // Fetch AI response from Worqhat
      const requestBody = JSON.stringify({
          question: question,
          training_data: "Provide financial advice if asked. Use 'answer' as the key.",
          response_type: "json",
          model: "aicon-v4-nano-160824"
      });

      const response = await fetch(WORQHAT_API_URL, {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${WORQHAT_API_KEY}`,
              "Content-Type": "application/json"
          },
          body: requestBody
      });

      const responseData = await response.json();
      let answer = "Sorry, I couldn't process that.";

      if (responseData && responseData.content) {
          try {
              const contentJson = JSON.parse(responseData.content);
              answer = contentJson.answer || answer;
          } catch (error) {
              answer = responseData.content;
          }
      }

      // ✅ Save Message in MongoDB
      const newMessage = new Message({
          userId,
          question,
          response: answer
      });
      await newMessage.save();

      res.json({ answer });

  } catch (error) {
      console.error("❌ Error communicating with Worqhat API:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get Chat History for a User
app.get("/api/chat/history/:userId", async (req, res) => {
  try {
      const { userId } = req.params;

      const messages = await Message.find({ userId }).sort({ timestamp: -1 });
      res.json({ messages });

  } catch (error) {
      console.error("❌ Error fetching chat history:", error.message);
      res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

app.listen(process.env.PORT | 3000,()=>{
    console.log("Server is running on port http://localhost:3000");
});