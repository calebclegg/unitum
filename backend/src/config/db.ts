import mongoose, { ConnectOptions } from "mongoose";

type ConnectDBFunction = () => Promise<void>;
const connectDB: ConnectDBFunction = async () => {
  const NODE_ENV = process.env.NODE_ENV;
  try {
    const conn = await mongoose.connect(
      NODE_ENV === "production"
        ? process.env.MONGO_URI!
        : NODE_ENV === "development"
        ? process.env.MONGO_DEV!
        : process.env.MONGO_LOCAL!,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );
    console.log(`Mongodb running : ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
