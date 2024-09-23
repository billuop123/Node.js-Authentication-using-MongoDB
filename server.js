import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

// Load environment variables from config.env
dotenv.config({ path: "./config.env" });

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(err.name, err.message);
  console.log("Uncaught Exception. Shutting down...");
  process.exit(1); // Exit the process with failure
});

// Database connection
const link = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(link)
  .then(() => console.log("Connected successfully to the database"))
  .catch((err) => console.error("Database connection error:", err));

// Start the server
const port = process.env.PORT || 3000; // Fallback port if not defined
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(err.name, err.message);
  console.log("Unhandled Rejection. Shutting down...");
  server.close(() => {
    process.exit(1); // Exit the process with failure
  });
});
