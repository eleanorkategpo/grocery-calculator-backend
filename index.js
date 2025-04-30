import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// Import routes
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import groceryRoutes from "./src/routes/groceryRoutes.js";
import shoppingListRoutes from "./src/routes/shoppingListRoutes.js";

// Load environment variables
dotenv.config({ path: "./.env" });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
// Allow CORS from the React front-end when sending credentials
const CLIENT_URL =
  process.env.CLIENT_URL ||
  "http://localhost:5173" ;
app.use(
  cors({
    origin: CLIENT_URL,
    
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/grocery", groceryRoutes);
app.use("/api/shopping-list", shoppingListRoutes);

// Health check route
app.get("/api/healthcheck", (req, res) => {
  console.log(res);
  res.status(200).json({ status: "success", message: "API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  res.status(statusCode).json({
    status,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();
