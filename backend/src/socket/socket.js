// backend/src/socket/socket.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

// In production, replace Map with Redis
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
    try {
      // --- Read JWT from cookies ---
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) {
        console.warn("Socket connection rejected: No cookies");
        socket.disconnect();
        return;
      }

      const token = cookies
        .split("; ")
        .find((c) => c.startsWith("JWT="))
        ?.split("=")[1];

      if (!token) {
        console.warn("Socket connection rejected: No JWT cookie");
        socket.disconnect();
        return;
      }

      // --- Verify JWT ---
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id.toString();

      // --- Store online user ---
      onlineUsers.set(userId, socket.id);

      console.log("SOCKET CONNECTED:", socket.id, "USER:", userId);

      // --- Broadcast online users ---
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      // --- Handle disconnect ---
      socket.on("disconnect", () => {
        onlineUsers.delete(userId);

        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
        console.log("SOCKET DISCONNECTED:", socket.id, "USER:", userId);
      });
    } catch (err) {
      console.error("Socket auth failed:", err.message);
      socket.disconnect();
    }
  });
};

// --- Helper to get receiver's socket ID ---
export const getReceiverSocketId = (receiverId) =>
  onlineUsers.get(receiverId?.toString());

export { io };
// end of backend/src/socket/socket.js
