// backend/src/socket/socket.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;
// TODO: In production, replace this Map with Redis or another persistent store
const onlineUsers = new Map();

// --- Initialize Socket.IO ---
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("CONNECTED:", socket.id);

    // --- Setup with JWT authentication ---
    socket.on("setup", (token) => {
      if (!token) return;

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        onlineUsers.set(userId.toString(), socket.id);

        // Emit updated online users list
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      } catch (err) {
        console.warn("Socket setup failed:", err.message);
        socket.emit("unauthorized", { message: "Invalid token" });
      }
    });

    // --- Handle disconnect ---
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      console.log("DISCONNECTED:", socket.id);
    });
  });
};

// --- Helper to get receiver's socket ID ---
export const getReceiverSocketId = (receiverId) =>
  onlineUsers.get(receiverId?.toString());

export { io };
// end of backend/src/socket/socket.js