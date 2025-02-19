import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import User from "./models/user.js";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authenticate } from "./middlewares/auth.js";
const app = express();
dotenv.config();
connectDB();

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const SECRET_KEY = process.env.SECRET_KEY // Use a strong secret key in production


app.get("/", (req, res) => {
    res.send("Hello World!");
}
);

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
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ message: 'Login successful', user });
});
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

app.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'This is a protected route', userId: req.userId });
});



app.listen(process.env.PORT | 3000,(req,res)=>{
    console.log("Server is running on port http://localhost:3000");
});