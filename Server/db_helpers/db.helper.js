import mongoose from "mongoose";

export const connectDb = async (mongoUri) => {
  const MONGOURI = process.env.MONGOURI || mongoUri;
  if (!MONGOURI) {
    throw new Error("MongoDB connection URI is not defined.");
  }
  try {
    await mongoose
      .connect(MONGOURI, {
        dbName: "myfilmproject",
      })
      .then(() => {
        console.log("Connected to MongoDB");
      });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
