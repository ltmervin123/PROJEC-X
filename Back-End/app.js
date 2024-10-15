require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

// Allow requests from a specific origin (your frontend)
app.use(
  cors({
    origin: process.env.FRONT_END_URL , // Frontend URL
  })
);

//Routes
const uploadResumeRoutes = require("./routes/uploadResumeRoutes");
const uploadVideoRoutes = require("./routes/uploadVideoRoutes");

//Test Routes
const testUploadVideoRoutes = require("./test/test routes/uploadVideoTestRoutes");

// Middleware to parse JSON or form data (if required)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the test routes
app.use("/api/test", testUploadVideoRoutes);

// Use the  routes under /api
app.use("/api", uploadResumeRoutes);
app.use("/api", uploadVideoRoutes);


// Start the server
const PORT = process.env.BACK_END_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.BACK_END_PORT}`);
  console.log(`Frontend is running on ${process.env.FRONT_END_URL}`);
});
