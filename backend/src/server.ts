import express from "express";
import { config as dotenv } from "dotenv";
import connectDB from "./config/db";

//dotenv conf
dotenv();

const app = express();

connectDB();

//Body parser setup
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`Backend server running on ${process.env.PORT}`);
});
