import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5002;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import { userRoutes } from "./routes/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { adminRoutes } from "./routes/admin.route.js";


app.use(cookieParser());



const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_PORT,
    process.env.ADMIN_URL
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));




// Log every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next(); // important to pass control to next middleware/route
});


// simple health check
app.get("/health", (req, res) => res.status(200).json({ message: 'Working' }));



// app.use("/api",appointmentRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);



// connect DB then start server
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB is connected");
    app.listen(PORT, () => {
      console.log(`User App is listening on PORT ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start user service:", err);
    process.exit(1);
  }
};

start();






