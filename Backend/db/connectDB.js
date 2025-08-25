import mongoose from "mongoose";
import "dotenv/config"
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI );
    console.log("Connected to database");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
