import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import User from "./models/user.js";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
const app = express();
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("Hello World!");
}
);

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', user });
});





app.listen(3000,(req,res)=>{
    console.log("Server is running on port http://localhost:3000");
});