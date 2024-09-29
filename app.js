require("dotenv").config();

const express = require("express");
const app = express();

// Import the central routes file
const apiRoutes = require("./routes/uploadVideoFile");

// Middleware to parse JSON or form data (if required)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the centralized routes under /api
app.use("/api", apiRoutes);

// Home page route (optional)
app.get("/", (req, res) => {
  res.send("Welcome to the Home Page");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
