import express from "express";
import { config as dotenv } from "dotenv";
import userRoutes from "./routes/user";
const morgan = require("morgan")

import connectDB from "./config/db";

//dotenv conf
dotenv();

const app = express();

connectDB();

//Body parser setup
app.use(express.json());
app.use(morgan("dev"))

//Mount api routes here
app.use("/api/users", userRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Backend server running on ${process.env.PORT}`);
});
