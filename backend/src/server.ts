import express, { Application } from "express";
import { config as dotenv } from "dotenv";
import userRoutes from "./routes/user";

import connectDB from "./config/db";

//dotenv conf
dotenv();

const app: Application = express();

connectDB();

//Body parser setup
app.use(express.json());

//Mount api routes here
app.use("/api/users", userRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Backend server running on ${process.env.PORT}`);
});
