const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());

// CORS: allow only frontend URL in production
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors({ origin: FRONTEND_URL }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/message", require("./routes/messages"));



// Test route
app.get("/", (req, res) => res.send("✅ Secure Message Transfer API Running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
