require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const socketSetup = require("./socket/socketSetUp");
const { errorHandlerMiddleware } = require("./middleware/errorHandler");
const app = express();
const resume = require("./routes/resumeRoute");
const interview = require("./routes/interviewRoute");
const user = require("./routes/userRoute");
const path = require("path");
const fs = require("fs");

// Define the path to the 'uploads' folder
const uploadsFolder = path.join(__dirname, "uploads");

// Check if the 'uploads' folder exists
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder);
  console.log("Uploads folder created.");
} else {
  console.log("Uploads folder already exists.");
}

// Get frontend URL based on environment
const client =
  process.env.NODE_ENV === "development"
    ? process.env.DEVELOPMENT_FRONT_END_URL
    : process.env.PRODUCTION_FRONT_END_URL;

// CORS configuration
const corsOptions = {
  origin: client,
};

app.use(cors(corsOptions));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/evalaute-resume", resume);
app.use("/api/interview", interview);
app.use("/api/user/auth", user);

// Error-handling middleware
app.use(errorHandlerMiddleware);

// Create HTTP server
const server = createServer(app);

// Setup Socket.IO
socketSetup(server, corsOptions);

// Server port
const PORT = process.env.PORT || 5000;

// Start the server function
const startServer = async () => {
  try {
    const backendUrl =
      process.env.NODE_ENV === "development"
        ? process.env.DEVELOPMENT_BACK_END_URL
        : process.env.PRODUCTION_BACK_END_URL;

    server.listen(PORT, () => {
      console.log(`Server is running on ${backendUrl}:${PORT}`);
      console.log(`Frontend is available at ${client}`);
      console.log("Socket.IO server is ready");
    });
  } catch (error) {
    console.log("Error starting server", error.message);
  }
};

// MongoDB connection
const connectTODBAndStartServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.DATABASE_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB");
    startServer();
  } catch (err) {
    console.log("Error connecting to MongoDB", err.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed gracefully.");
  process.exit(0);
});

connectTODBAndStartServer();
