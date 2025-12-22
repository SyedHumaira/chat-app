// src/controllers/auth.controllers.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

// --- Async handler wrapper ---
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// --- SIGNUP ---
export const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  if (password.length < 6)
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "Email already exists" });

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ fullName, email, password: hashedPassword });
  await newUser.save();

  generateToken(newUser._id, res);

  res.status(201).json({
    _id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    profilePic: newUser.profilePic,
  });
});

// --- LOGIN ---
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect)
    return res.status(400).json({ message: "Invalid credentials" });

  generateToken(user._id, res);

  res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
  });
});

// --- LOGOUT ---
export const logout = asyncHandler(async (req, res) => {
  res.cookie("JWT", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// --- UPDATE PROFILE ---
export const updateProfile = asyncHandler(async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user._id;

  if (!profilePic)
    return res.status(400).json({ message: "Profile picture is required" });

  // Optional: delete old profile picture from Cloudinary
  if (req.user.profilePic) {
    try {
      const publicId = req.user.profilePic.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.warn("Failed to delete old profilePic:", err.message);
    }
  }

  const uploadResponse = await cloudinary.uploader.upload(profilePic);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profilePic: uploadResponse.secure_url },
    { new: true }
  ).select("-password");

  res.status(200).json(updatedUser);
});

// --- CHECK AUTH ---
export const checkAuth = asyncHandler(async (req, res) => {
  // Optionally, omit timestamps if not needed
  const { _id, fullName, email, profilePic } = req.user;
  res.status(200).json({ _id, fullName, email, profilePic });
});
// end of src/controllers/auth.controllers.js