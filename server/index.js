import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import courseRoute from './routes/courseRouter.js';
import mediaRoute from './routes/mediaRoute.js';
import purchesRoute from './routes/coursePurchesRoute.js'
// Load environment variables
dotenv.config();
if (!process.env.PORT) {
  console.error("⚠️  PORT is not defined in the .env file");
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));


// Connect to the database
dbConnection();

// Routes
app.use("/api/v1/media",mediaRoute );
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase",purchesRoute);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
