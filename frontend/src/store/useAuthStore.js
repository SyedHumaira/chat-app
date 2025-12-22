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
    set((state) => ({
      authUser: state.authUser, // 🔑 DON'T wipe existing user
      isCheckingAuth: false,
    }));
  }
},


 signup: async (data) => {
  set({ isSigningUp: true });
  try {
    const res = await axiosInstance.post("/auth/signup", data);
    set({ authUser: res.data.user || res.data });
    toast.success("Account created successfully");
    return true; // ✅ SUCCESS
  } catch (error) {
    toast.error(error.response?.data?.message || "Signup failed");
    return false; // ❌ FAIL
  } finally {
    set({ isSigningUp: false });
  }
},


login: async (data) => {
  set({ isLoggingIn: true });
  try {
    const res = await axiosInstance.post("/auth/login", data);
    set({ authUser: res.data.user });
    toast.success("Logged in successfully");
    return true;
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
    return false;
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
