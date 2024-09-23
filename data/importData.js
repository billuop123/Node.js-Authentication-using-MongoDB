import mongoose from "mongoose";
import User from "../models/userModel.js";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the current file and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB
mongoose
  .connect(`mongodb+srv://Biplov:mrcool10@cluster0.qbbmn.mongodb.net/Banking_System?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => console.log("Connected successfully to the database"))
  .catch((err) => console.error("Database connection error:", err));

// Function to import data from JSON file
const importData = async () => {
  try {
    const data = JSON.parse(await fs.readFile(`${__dirname}/users.json`, "utf-8"));
    await User.create(data, { validateBeforeSave: false });
    console.log("Data successfully imported");
  } catch (err) {
    console.error("Cannot import data:", err);
  }
};

// Function to delete all user data
const truncateData = async () => {
  try {
    await User.deleteMany();
    console.log("Users successfully deleted");
  } catch (err) {
    console.error("Cannot truncate data:", err);
  }
};

// Command-line argument handling
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  truncateData();
} else {
  console.log("Invalid command. Use --import to import data or --delete to delete data.");
}
