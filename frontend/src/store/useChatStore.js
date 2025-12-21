import { create } from "zustand";
import axiosInstance from "../lib/axios";
import socket from "../lib/socket";

// 🔐 StrictMode-safe flag (module scoped)
let isSocketInitialized = false;

export const useChatStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  messages: [],
  onlineUsers: [],
  isSending: false, 

  // ✅ CONNECT SOCKET (ONLY ONCE)
  connectSocket: (userId) => {
    if (!userId) return;
    if (isSocketInitialized) return;

    isSocketInitialized = true;

    socket.connect();
    socket.emit("setup", userId);

    // 🧹 clean listeners before attaching
    socket.off("onlineUsers");
    socket.off("receiveMessage");

    socket.on("onlineUsers", (users) => {
      set({ onlineUsers: users });
    });

    socket.on("receiveMessage", (message) => {
      const { selectedUser } = get();

      if (
        selectedUser &&
        (message.senderId === selectedUser._id ||
          message.receiverId === selectedUser._id)
      ) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      }
    });
  },

  // ✅ DISCONNECT SOCKET (StrictMode safe)
 disconnectSocket: () => {
  if (!isSocketInitialized) return;

  isSocketInitialized = false;

  // remove all listeners first
  socket.removeAllListeners();
  
  // disconnect socket
  socket.disconnect();
  
  // optional: reset chat state
  set({ messages: [], selectedUser: null, onlineUsers: [] });
},


 fetchUsers: async () => {
    const res = await axiosInstance.get("/messages/users");
    set({ users: res.data });
  },

  selectUser: async (user) => {
    set({ selectedUser: user, messages: [] });

    const res = await axiosInstance.get(`/messages/${user._id}`);
    set({ messages: res.data });
  },

  sendMessage: async (text) => {
    const { selectedUser, isSending } = get();
    if (!selectedUser || !text || isSending) return; // 🔹 prevent double send

    set({ isSending: true });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        { text }
      );

      set((state) => ({
        messages: [...state.messages, res.data],
      }));
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      set({ isSending: false }); // 🔹 reset flag
    }
  },
}));
