// frontend/src/store/useAuthStore.js
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  setAuthUser: (user) => set({ authUser: user }),
  setCheckingAuth: (val) => set({ isCheckingAuth: val }),

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data, isCheckingAuth: false });
    } catch (error) {
      set({ authUser: null, isCheckingAuth: false });
      console.error("Auth check error:", error.response || error);
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

login: async (data) => {
  set({ isLoggingIn: true });
  try {
    const res = await axiosInstance.post("/auth/login", data);
    set({ authUser: res.data.user }); // 🔑 make sure backend returns { user: { ... } }
    toast.success("Logged in successfully");
    return res.data.user; // 🔑 return user for the frontend
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
    throw error; // 🔑 allow try/catch in LoginPage
  } finally {
    set({ isLoggingIn: false });
  }
},


  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout"); // clears cookie
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  },
}));
// end of frontend/src/store/useAuthStore.js
