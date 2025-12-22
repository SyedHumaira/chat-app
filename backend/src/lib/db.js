// backend/src/lib/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Optional: avoid deprecation warnings
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // exit if DB connection fails
  }
};

export default connectDB;
// backend/src/lib/db.js