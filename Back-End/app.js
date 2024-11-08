// Load environment variables
require("dotenv").config();

const mongoose = require("mongoose");

// Third-party dependencies
const express = require("express");
const cors = require("cors");

// Local modules
const CustomException = require("./exception/customException");

// Initialize Express app
const app = express();

// Allow requests only from the frontend URL specified in the environment variables
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
  })
);

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route imports
const resume = require("./routes/resumeRoute");
const interview = require("./routes/interviewRoute");

// API Routes
app.use("/api", resume);
app.use("/api", interview);

// Error-handling middleware
app.use((err, req, res, next) => {
  if (err instanceof CustomException) {
    console.log("Custom Exception:", err);
    res.status(err.status).json({ error: err.message });
  } else {
    console.log("Unhandled Error:", err);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

//MongoDB connection
const connectTODB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error connecting to MongoDB", err.message);
    process.exit(1); // Exit if the database connection fails
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed gracefully.");
  process.exit(0);
});

connectTODB();

// Server setup
const PORT = process.env.BACK_END_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Frontend is available at ${process.env.FRONT_END_URL}`);
});
