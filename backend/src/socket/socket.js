// backend/src/socket/socket.js
import { Server } from "socket.io";

let io;
const onlineUsers = new Map(); // userId -> socketId

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("CONNECTED:", socket.id);

    socket.on("setup", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

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

  return io;
};

export const getReceiverSocketId = (receiverId) => {
  return onlineUsers.get(receiverId);
};

export { io };
// end of backend/src/socket/socket.js