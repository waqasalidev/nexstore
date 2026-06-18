import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("CRITICAL ERROR: MONGO_URI environment variable is not defined!");
    process.exit(1);
  }

  const options = {
    serverSelectionTimeoutMS: 5000, // Wait 5 seconds before failing connection
    autoIndex: process.env.NODE_ENV !== "production", // Don't build indexes in production
  };

  try {
    const conn = await mongoose.connect(mongoUri, options);
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Monitor mongoose connection status events
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB Connection Warning: Mongoose disconnected from the database.");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB Connection Error Event: ${err.message || err}`);
});

// Handle graceful termination of database connection
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through application termination (SIGINT).");
    process.exit(0);
  } catch (err) {
    console.error("Error during database shutdown:", err);
    process.exit(1);
  }
});

export default connectDB;
