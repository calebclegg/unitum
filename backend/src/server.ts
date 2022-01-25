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
import { Server, Socket } from "socket.io";
import { getUser } from "./eventHandlers/token.middleware";
import { Notification } from "./models/Notification";
//dotenv conf
dotenv();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});
io.use(getUser);
io.on("connection", async (socket: any) => {
  console.log("A user Connected", socket.id);

  socket.join(socket.user._id);
  socket.user.profile.communities.forEach((comm: String) => {
    socket.join(comm);
  });

  app.use((req: any, res, next) => {
    req.io = io;
    req.socket = socket;
    next();
  });

  const notifications = await Notification.find({
    userID: socket.user._id
  }).select("-__v -updatedAt");

  socket.to(socket.user._id).emit("Notification:get", notifications);

  socket.on("Notification:read", async (notificationID: String) => {
    try {
      await Notification.findOneAndDelete({ _id: notificationID });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

connectDB();
redisConnect();

//Body parser setup
app.use(express.json());
// app.use((req: any, res, next) => {
//   req.io = io;
//   next();
// });
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
//Mount api routes here
// app.listen(process.env.PORT, () => {
//   console.log(`Backend server running on ${process.env.PORT}`);
// });

httpServer.listen(process.env.PORT, () => {
  console.log(`Backend server running on ${process.env.PORT}`);
});
