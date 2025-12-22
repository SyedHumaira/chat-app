// backend/src/controllers/message.controller.js
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../socket/socket.js";

// --- Async handler wrapper ---
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// --- GET USERS FOR SIDEBAR ---
export const getUsersForSidebar = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;

  const users = await User.find({ _id: { $ne: loggedInUserId } })
    .select("-password")
    .lean();

  res.status(200).json(users);
});

// --- GET MESSAGES BETWEEN TWO USERS ---
export const getMessages = asyncHandler(async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  })
    .populate("senderId", "fullName profilePic")
    .populate("receiverId", "fullName profilePic")
    .sort({ createdAt: 1 })
    .lean();

  res.status(200).json(messages);
});

// --- SEND MESSAGE ---
export const sendMessage = asyncHandler(async (req, res) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  if (!text && !image) {
    return res.status(400).json({ message: "Message cannot be empty" });
  }

  let imageUrl;
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;
  }

  const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });

  await newMessage.save();

  // Emit message to receiver via socket
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("receiveMessage", newMessage.toJSON());
  }

  res.status(201).json(newMessage);
});
// end of backend/src/controllers/message.controller.js
