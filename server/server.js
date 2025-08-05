import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

const PORT = process.env.PORT || 4000;

const app = express();

// ✅ Middlewares
app.use(express.json());
// CORS configuration for development and production
const allowedOrigins = [
  "http://localhost:3000", // React dev server
  "http://localhost:80", // Docker frontend
  "http://localhost", // Docker frontend (no port)
  "http://13.62.100.132", // Your EC2 frontend
  "http://13.62.100.132:80", // Your EC2 frontend with port
  "https://imaginexx.vercel.app", // Production frontend
  process.env.FRONTEND_URL, // Environment variable for additional domains
].filter(Boolean); // Remove any undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // In development, allow all origins
        if (process.env.NODE_ENV === "development") {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);
app.get("/", (req, res) => res.send("API Working"));

// ✅ Start Server after DB Connect
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1); // Optional: Exit if DB fails
  }
};

startServer();
