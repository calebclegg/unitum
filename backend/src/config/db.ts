import mongoose from "mongoose";
const connectDB = async () => {
  const NODE_ENV = process.env.NODE_ENV;
  try {
    const conn = await mongoose.connect(
      NODE_ENV === "production"
        ? process.env.MONGO_URI!
        : NODE_ENV === "development"
        ? process.env.MONGO_DEV!
        : process.env.MONGO_LOCAL!
    );
    console.log(`Mongodb running : ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
