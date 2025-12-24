// src/index.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { initSocket } from "./socket/socket.js";
import "./config/env.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
  
// --- Security Middleware ---
app.use(helmet());

// --- CORS ---
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200, // for legacy browsers
  })
);

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api", limiter);

// --- Body Parser & Cookies ---
app.use(express.json({ limit: "10mb" })); // increase if you send images/base64
app.use(cookieParser());

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// --- Database Connection ---
connectDB();

// --- HTTP Server + Socket.IO ---
const server = http.createServer(app);
initSocket(server);

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// end of src/index.js