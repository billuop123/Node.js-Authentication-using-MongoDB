import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import userRouter from "./router/userRoutes.js";
import globalErrorControllerHandler from "./Controllers/errorController.js";
import AppError from "./utils/AppError.js";

const app = express();

// Rate limiting middleware
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again after an hour",
});

// Apply rate limiting to all requests to the /api route
app.use("/api", limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Security headers
app.use(helmet());

// Limit JSON payload size
app.use(express.json({ limit: "10kb" }));

// Cookie parser middleware
app.use(cookieParser());

// User routes
app.use("/api/v2/users/", userRouter);

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find the requested URL: ${req.originalUrl}`, 404));
});

// Global error handling middleware
app.use(globalErrorControllerHandler);

export default app;
