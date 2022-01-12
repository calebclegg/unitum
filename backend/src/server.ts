import express from "express";
import { config as dotenv } from "dotenv-flow";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import morgan from "morgan";
import connectDB from "./config/db";
import helmet from "helmet";
import cors from "cors";

//dotenv conf
dotenv();

const app = express();

connectDB();

//Body parser setup
app.use(express.json());
app.use(
  cors({
    origin: "*"
  })
);
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
//Mount api routes here
app.listen(process.env.PORT, () => {
  console.log(`Backend server running on ${process.env.PORT}`);
});
