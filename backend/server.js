import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import habitRoutes from "./routes/habitRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,            
}));

app.use("/api/users", authRoutes);
app.use("/api/users", socialRoutes);
app.use("/api/habits", habitRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on PORT:", PORT);
    });
});