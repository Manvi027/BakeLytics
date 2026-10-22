import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bakelytics";
console.log("Attempting to connect to:", uri);

try {
  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log("SUCCESS: Connected to MongoDB host:", conn.connection.host);
  console.log("Database name:", conn.connection.name);
  console.log("Connection state:", conn.connection.readyState);
  await mongoose.disconnect();
  console.log("Disconnected cleanly.");
  process.exit(0);
} catch (err) {
  console.error("FAILURE connecting to MongoDB:", err.message);
  process.exit(1);
}
