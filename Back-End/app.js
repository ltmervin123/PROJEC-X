require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

// Allow requests from a specific origin (your frontend)
app.use(
  cors({
    origin: process.env.FRONT_END_URL, // Frontend URL
  })
);

// Import the central routes file
const apiRoutes = require("./routes/uploadResumeFile");

// Middleware to parse JSON or form data (if required)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
~(
  // Use the centralized routes under /api
  app.use("/api", apiRoutes)
);

// Home page route (optional)
app.get("/", (req, res) => {
  res.send("Welcome to the Home Page");
});

// Start the server
const PORT = process.env.BACK_END_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
