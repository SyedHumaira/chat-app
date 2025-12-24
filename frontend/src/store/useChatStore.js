// frontend/src/store/useChatStore.js
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import socket from "../lib/socket";

// 🔐 StrictMode-safe flag
let isSocketInitialized = false;

export const useChatStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  messages: [],
  onlineUsers: [],
  isSending: false,

  // ✅ CONNECT SOCKET (COOKIE-BASED AUTH)
  connectSocket: () => {
    if (isSocketInitialized) return;

    isSocketInitialized = true;

    socket.connect(); // JWT read from HttpOnly cookie by backend

    // 🧹 clean listeners
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

  // ✅ DISCONNECT SOCKET (STRICTMODE SAFE)
  disconnectSocket: () => {
    if (!isSocketInitialized) return;

    isSocketInitialized = false;

    socket.removeAllListeners();
    socket.disconnect();

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
    if (!selectedUser || !text || isSending) return;

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
      set({ isSending: false });
    }
  },
}));
// end of frontend/src/store/useChatStore.js