import mongoose from "mongoose";

const connectMongo = async (): Promise<typeof mongoose | null> => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "Add the MONGODB_URI environment variable inside .env.local to use mongoose"
    );
  }

  try {
    return await mongoose.connect(process.env.MONGODB_URI);
  } catch (e) {
    console.error("Mongoose Client Error: " + (e as Error).message);
    return null; // Return null in case of an error
  }
};

export default connectMongo;
