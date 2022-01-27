import express from "express";
import { config as dotenv } from "dotenv-flow";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import communityRoutes from "./routes/community";
import postRoutes from "./routes/post";
import morgan from "morgan";
import connectDB from "./config/db";
import helmet from "helmet";
import cors from "cors";
import { redisConnect } from "./config/redis_connect";
import { createServer } from "http";
import { Server } from "socket.io";
import searchRouter from "./routes/search";

//dotenv conf
dotenv();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  cors: {
    origin: "*";
  }

  console.log("A user Connected", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

connectDB();
redisConnect();

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
app.use("/api/community", communityRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", searchRouter);
//Mount api routes here
// app.listen(process.env.PORT, () => {
//   console.log(`Backend server running on ${process.env.PORT}`);
// });

httpServer.listen(process.env.PORT, () => {
  console.log(`Backend server running on ${process.env.PORT}`);
});
