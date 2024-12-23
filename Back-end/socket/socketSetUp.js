const { Server } = require("socket.io");
const { createTranscriptionSession } = require("./transcription");

function socketSetup(server, corsOptions) {
  const io = new Server(server, {
    cors: corsOptions,
    maxHttpBufferSize: 1e6, // 1 MB max message size
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Track active sessions
  const activeSessions = new Map();

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    try {
      // Create transcription session
      const session = createTranscriptionSession(socket);
      activeSessions.set(socket.id, session);

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
        const session = activeSessions.get(socket.id);
        if (session) {
          session.cleanup();
          activeSessions.delete(socket.id);
        }
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

  // Monitor active sessions
  setInterval(() => {
    const activeCount = activeSessions.size;
    console.log(`Active transcription sessions: ${activeCount}`);
  }, 60000);

  return io;
}

module.exports = socketSetup;
