import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bakelytics", {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    // Don't exit process immediately in dev so developers see the clear message
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("[Database] MongoDB connection disconnected.");
});

mongoose.connection.on("reconnected", () => {
  console.log("[Database] MongoDB reconnected successfully.");
});

export default connectDB;
