import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";
import authRoutes from "./routes/authRoutes.js";
import ingredientRoutes from "./routes/ingredientRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Dynamic CORS for all local development ports and origins
app.use(
  cors({
    origin: true, // Dynamically reflects incoming origin (localhost:5173, localhost:5174, etc.)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ingredients", ingredientRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };

  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "BakeLytics Backend API",
    database: {
      status: statusMap[dbStatus] || "Unknown",
      readyState: dbStatus,
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
    },
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to BakeLytics API Server",
    docs: "/api/health",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[Server Error]", err.stack || err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// Create HTTP server & bind Socket.io
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

initSocket(io);

// Start server after connecting to database
const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`[Server] BakeLytics backend running on port ${PORT}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
      console.log(`[Socket.io] WebSocket server initialized on port ${PORT}`);
    });
    return httpServer;
  } catch (error) {
    console.error("[Startup Error] Could not start server:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;

