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
const user = require("./routes/userRoute");

// Using the routes
app.use("/api/evalaute-resume", resume);
app.use("/api/interview", interview);
app.use("/api/user/auth", user);

// Error-handling middleware
app.use((err, req, res, next) => {
  if (err instanceof CustomException) {
    console.log("Custom Exception:", err.message, err.status);
    res.status(err.status).json({ error: err.message });
  } else {
    console.log("Unhandled Error:", err);
    res
      .status(500)
      .json({ error: "Something went wrong to the server, Please try again" });
  }
});

// Server setup
const PORT = process.env.BACK_END_PORT || 3000;

//Start the server
const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Frontend is available at ${process.env.FRONT_END_URL}`);
  });
};
//MongoDB connection
const connectTODBAndStartServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.DATABASE_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,
      tlsInsecure: true,
    });
    console.log("Connected to MongoDB");
    startServer();
  } catch (err) {
    console.log("Error connecting to MongoDB", err.message);
    process.exit(1); // Exit if the database connection fails
  }
};

//Gracefuly shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed gracefully.");
  process.exit(0);
});

connectTODBAndStartServer();
