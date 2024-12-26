const { Server } = require("socket.io");
const { createTranscriptionSession } = require("./transcription");

function socketSetup(server, corsOptions) {
  const io = new Server(server, {
    cors: corsOptions,
    maxHttpBufferSize: 5e6, // Increased buffer size
    pingTimeout: 120000,
    pingInterval: 30000,
  });

  // Track active sessions
  const activeSessions = new Map();

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    try {
      // Create transcription session
      const session = createTranscriptionSession(socket);
      activeSessions.set(socket.id, session);
      const activeCount = activeSessions.size;
      console.log(`Active transcription sessions: ${activeCount}`);
      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
        const session = activeSessions.get(socket.id);
        if (session) {
          session.cleanup();
          activeSessions.delete(socket.id);
        }
        const activeCount = activeSessions.size;
        console.log(`Active transcription sessions: ${activeCount}`);
      });

      // Handle errors
      socket.on("error", (error) => {
        console.error(`Socket error for client ${socket.id}:`, error);
        socket.emit("error", { message: "Connection error occurred" });
      });
    } catch (error) {
      console.error(`Error setting up client ${socket.id}:`, error);
      socket.emit("error", { message: "Failed to initialize session" });
    }
  });

  return io;
}

module.exports = socketSetup;
