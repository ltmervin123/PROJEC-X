// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
// Third-party dependencies
const express = require("express");
const cors = require("cors");
// Local modules
const CustomException = require("./exception/customException");
const { errorHandlerMiddleware } = require("./middleware/errorHandler");
// Initialize Express app
const app = express();
// Route imports
const resume = require("./routes/resumeRoute");
const interview = require("./routes/interviewRoute");
const user = require("./routes/userRoute");

// Allow requests only from the frontend URL specified in the environment variables
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
  })
);

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Using the routes
app.use("/api/evalaute-resume", resume);
app.use("/api/interview", interview);
app.use("/api/user/auth", user);

// Error-handling middleware
app.use(errorHandlerMiddleware);

// Server setup
const PORT = process.env.BACK_END_PORT || 5000;

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
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
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
