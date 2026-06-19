import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("CRITICAL ERROR: MONGO_URI environment variable is not defined!");
    process.exit(1);
  }

  const options = {
    serverSelectionTimeoutMS: 30000, // Wait 30 seconds before failing connection (important for Atlas cold starts)
    connectTimeoutMS: 30000,
    socketTimeoutMS: 60000,
    autoIndex: true, // Always build indexes (needed on initial deploy)
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
